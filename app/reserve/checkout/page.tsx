'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { CreditCard, Wallet, Building2, CheckCircle2 } from 'lucide-react';
import { isViewMode, setViewMode, MOCK_RESERVATION } from '@/lib/view-mode';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PaymentMethod = 'card' | 'paypal' | 'bank_transfer';

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get('reservation_id');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [bankInfo, setBankInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      setReservation(MOCK_RESERVATION as any);
      return;
    }
    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId, searchParams]);

  const fetchReservation = async () => {
    try {
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        toast.error('Supabaseが設定されていません');
        return;
      }

      const { data, error } = await supabase
        .from('reservations')
        .select('*, users(*)')
        .eq('id', reservationId)
        .single();

      if (error) throw error;
      setReservation(data);
    } catch (error) {
      console.error('Error fetching reservation:', error);
      toast.error('予約情報の取得に失敗しました');
    }
  };

  const handleBankTransfer = async () => {
    if (!reservationId) return;

    setLoading(true);
    try {
      // まず決済レコードを作成
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reservation_id: reservationId,
          payment_method: 'bank_transfer',
        }),
      });

      if (!response.ok) throw new Error('決済レコードの作成に失敗しました');

      const { payment_id } = await response.json();

      // 銀行振り込み情報を取得
      const bankResponse = await fetch('/api/payment/bank-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id }),
      });

      if (!bankResponse.ok) throw new Error('銀行振り込み情報の取得に失敗しました');

      const bankData = await bankResponse.json();
      setBankInfo(bankData);
      toast.success('銀行振り込み情報を表示します');
    } catch (error) {
      console.error('Error processing bank transfer:', error);
      toast.error('銀行振り込み処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!reservationId) return;

    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      toast.success('決済が完了しました');
      router.push(`/reserve/success?session_id=view-session-1&view=1`);
      return;
    }

    // 銀行振り込みの場合は別処理
    if (paymentMethod === 'bank_transfer') {
      await handleBankTransfer();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reservation_id: reservationId,
          payment_method: paymentMethod,
        }),
      });

      if (!response.ok) throw new Error('決済セッションの作成に失敗しました');

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error('Stripeの読み込みに失敗しました');

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('決済処理に失敗しました');
      setLoading(false);
    }
  };

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p>読み込み中...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const amount = reservation.ai_price || 10000;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>決済方法を選択</CardTitle>
            <CardDescription>予約内容を確認して決済方法を選択してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 予約内容の表示 */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">予約内容</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">日時:</span> {reservation.date} {reservation.time}</p>
                <p><span className="text-muted-foreground">種類:</span> {reservation.type === 'onsite' ? '訪問調査' : 'Zoom相談'}</p>
                {reservation.address && (
                  <p><span className="text-muted-foreground">住所:</span> {reservation.address}</p>
                )}
              </div>
            </div>

            {/* お支払い金額 */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">お支払い金額</h3>
              <p className="text-3xl font-bold">¥{amount.toLocaleString()}</p>
            </div>

            {/* 決済方法の選択 */}
            <div>
              <h3 className="font-semibold mb-4">決済方法を選択</h3>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="card" id="card" className="mt-1" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <div className="font-medium">クレジットカード</div>
                          <div className="text-sm text-muted-foreground">
                            VISA、Mastercard、American Express、JCB対応
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5" />
                        <div>
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-muted-foreground">
                            PayPalアカウントで簡単決済
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-1" />
                    <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5" />
                        <div>
                          <div className="font-medium">銀行振り込み</div>
                          <div className="text-sm text-muted-foreground">
                            振り込み確認後に予約が確定します
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* 銀行振り込み情報の表示 */}
            {bankInfo && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="h-5 w-5" />
                    銀行振り込み情報
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">振込先</div>
                    <div className="font-semibold">{bankInfo.bank_info.bank_name} {bankInfo.bank_info.bank_branch}</div>
                    <div className="font-semibold">{bankInfo.bank_info.account_type} {bankInfo.bank_info.account_number}</div>
                    <div className="font-semibold">{bankInfo.bank_info.account_name}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">振込金額</div>
                    <div className="text-2xl font-bold">¥{bankInfo.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">振込参考番号</div>
                    <div className="font-mono font-semibold">{bankInfo.transfer_reference}</div>
                  </div>
                  <div className="pt-3 border-t text-xs text-muted-foreground">
                    <p>※ 振り込み確認後、予約が確定いたします</p>
                    <p>※ 振り込み手数料はお客様負担となります</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 決済ボタン */}
            {!bankInfo && (
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? '処理中...' : paymentMethod === 'bank_transfer' ? '銀行振り込み情報を表示' : '決済に進む'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
