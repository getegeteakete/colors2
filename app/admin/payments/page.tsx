'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { isViewMode, setViewMode, MOCK_ADMIN_PAYMENTS } from '@/lib/view-mode';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { RefreshCw, ExternalLink, CheckCircle, Landmark, CreditCard, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'paid' | 'refunded';
  payment_method: 'card' | 'paypal' | 'bank_transfer' | null;
  stripe_intent: string | null;
  invoice_pdf_url: string | null;
  receipt_pdf_url: string | null;
  bank_name: string | null;
  bank_branch: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  transfer_reference: string | null;
  created_at: string;
  reservation_id: string;
  reservations: {
    id: string;
    date: string;
    time: string;
    type: 'onsite' | 'zoom';
    users: { name: string; email: string };
  };
};

function PaymentsPageContent() {
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [confirmTarget, setConfirmTarget] = useState<Payment | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      setPayments(MOCK_ADMIN_PAYMENTS as Payment[]);
      setLoading(false);
      return;
    }
    fetchPayments();
  }, [statusFilter, methodFilter, searchParams]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      if (!supabase) return;

      let query = supabase
        .from('payments')
        .select(`*, reservations!inner(id, date, time, type, users(name, email))`)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (methodFilter !== 'all') query = query.eq('payment_method', methodFilter);

      const { data, error } = await query;
      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      toast.error('決済データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'pending' | 'paid' | 'refunded') => {
    try {
      if (!supabase) return;
      const { error } = await supabase.from('payments').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      toast.success('ステータスを更新しました');
      fetchPayments();
    } catch {
      toast.error('ステータスの更新に失敗しました');
    }
  };

  // 銀行振込の入金確認
  const handleBankConfirm = async () => {
    if (!confirmTarget || !supabase) return;
    setConfirming(true);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'paid' })
        .eq('id', confirmTarget.id);
      if (error) throw error;
      toast.success(`${confirmTarget.reservations.users.name}様の入金を確認しました`);
      setConfirmTarget(null);
      fetchPayments();
    } catch {
      toast.error('更新に失敗しました');
    } finally {
      setConfirming(false);
    }
  };

  const getPaymentMethodBadge = (method: string | null) => {
    if (method === 'bank_transfer') return (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1 w-fit">
        <Landmark className="h-3 w-3" />銀行振込
      </Badge>
    );
    if (method === 'paypal') return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">PayPal</Badge>
    );
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1 w-fit">
        <CreditCard className="h-3 w-3" />カード
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: '入金待ち', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      paid: { label: '入金済み', className: 'bg-green-100 text-green-800 border-green-200' },
      refunded: { label: '返金済み', className: 'bg-red-100 text-red-800 border-red-200' },
    };
    const v = variants[status] || variants.pending;
    return <Badge variant="outline" className={v.className}>{v.label}</Badge>;
  };

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);
  const bankPending = payments.filter(p => p.payment_method === 'bank_transfer' && p.status === 'pending');

  if (loading) return (
    <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-8">
      <div className="text-center text-[#646970]">読み込み中...</div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 銀行振込の未確認アラート */}
      {bankPending.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-5 py-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">
              銀行振込の入金確認が {bankPending.length}件 未完了です
            </p>
            <p className="text-xs text-yellow-700 mt-0.5">
              入金が確認できたら「入金確認」ボタンで承認してください
            </p>
          </div>
        </div>
      )}

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">合計金額</div>
          <div className="text-2xl font-semibold text-[#23282d]">¥{totalAmount.toLocaleString()}</div>
          <div className="text-xs text-[#646970] mt-1">{payments.length}件</div>
        </div>
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">入金済み</div>
          <div className="text-2xl font-semibold text-green-600">¥{paidAmount.toLocaleString()}</div>
          <div className="text-xs text-[#646970] mt-1">{payments.filter(p => p.status === 'paid').length}件</div>
        </div>
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">入金待ち</div>
          <div className="text-2xl font-semibold text-yellow-600">¥{pendingAmount.toLocaleString()}</div>
          <div className="text-xs text-[#646970] mt-1">{payments.filter(p => p.status === 'pending').length}件（銀行振込 {bankPending.length}件）</div>
        </div>
      </div>

      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7] flex flex-wrap items-center gap-3 justify-between">
          <h2 className="text-base font-semibold text-[#23282d]">決済一覧</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="支払方法" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての方法</SelectItem>
                <SelectItem value="card">カード</SelectItem>
                <SelectItem value="bank_transfer">銀行振込</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="pending">入金待ち</SelectItem>
                <SelectItem value="paid">入金済み</SelectItem>
                <SelectItem value="refunded">返金済み</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchPayments} className="border-[#c3c4c7]">
              <RefreshCw className="h-4 w-4 mr-2" />更新
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f7f7]">
                <TableHead>予約日時</TableHead>
                <TableHead>お客様名</TableHead>
                <TableHead>支払方法</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>決済日時</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-[#646970] py-8">
                    決済データがありません
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id} className={payment.payment_method === 'bank_transfer' && payment.status === 'pending' ? 'bg-yellow-50' : ''}>
                    <TableCell>
                      <div className="text-sm">{format(new Date(payment.reservations.date), 'yyyy年MM月dd日', { locale: ja })}</div>
                      <div className="text-xs text-[#646970]">{payment.reservations.time?.slice(0,5)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{payment.reservations.users.name}</div>
                      <div className="text-xs text-[#646970]">{payment.reservations.users.email}</div>
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(payment.payment_method)}
                      {payment.payment_method === 'bank_transfer' && payment.transfer_reference && (
                        <div className="text-xs text-[#646970] mt-1 font-mono">Ref: {payment.transfer_reference}</div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">¥{Number(payment.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      {payment.payment_method === 'bank_transfer' ? (
                        // 銀行振込はセレクト変更ではなく専用ボタン
                        getStatusBadge(payment.status)
                      ) : (
                        <Select
                          value={payment.status}
                          onValueChange={(v: 'pending' | 'paid' | 'refunded') => updateStatus(payment.id, v)}
                        >
                          <SelectTrigger className="w-32 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">入金待ち</SelectItem>
                            <SelectItem value="paid">入金済み</SelectItem>
                            <SelectItem value="refunded">返金済み</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-[#646970]">
                      {format(new Date(payment.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {/* 銀行振込の入金確認ボタン */}
                        {payment.payment_method === 'bank_transfer' && payment.status === 'pending' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                            onClick={() => setConfirmTarget(payment)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />入金確認
                          </Button>
                        )}
                        <Link href={`/admin/reservations/${payment.reservation_id}`}>
                          <Button variant="outline" size="sm" className="border-[#c3c4c7] h-7 text-xs">
                            予約詳細
                          </Button>
                        </Link>
                        {payment.invoice_pdf_url && (
                          <a href={payment.invoice_pdf_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="border-[#c3c4c7] h-7 text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />請求書
                            </Button>
                          </a>
                        )}
                        {payment.receipt_pdf_url && (
                          <a href={payment.receipt_pdf_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="border-[#c3c4c7] h-7 text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />領収書
                            </Button>
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 銀行振込確認ダイアログ */}
      <Dialog open={!!confirmTarget} onOpenChange={() => setConfirmTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              入金確認
            </DialogTitle>
            <DialogDescription>
              以下の銀行振込の入金を確認しますか？
            </DialogDescription>
          </DialogHeader>
          {confirmTarget && (
            <div className="space-y-3 py-2">
              <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">お客様名</span>
                  <span className="font-medium">{confirmTarget.reservations.users.name} 様</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">金額</span>
                  <span className="font-bold text-green-700">¥{Number(confirmTarget.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">振込参考番号</span>
                  <span className="font-mono text-xs">{confirmTarget.transfer_reference || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">予約日時</span>
                  <span>{confirmTarget.reservations.date} {confirmTarget.reservations.time?.slice(0,5)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ※ 確認するとお客様のマイページで領収書が発行可能になります
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmTarget(null)}>キャンセル</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleBankConfirm} disabled={confirming}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {confirming ? '処理中...' : '入金を確認する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="p-6"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <PaymentsPageContent />
    </Suspense>
  );
}
