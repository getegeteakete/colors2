'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase/client';
import { Download, ExternalLink } from 'lucide-react';
import { isViewMode, setViewMode, MOCK_MYPAGE_RESERVATIONS, MOCK_MYPAGE_PAYMENTS, MOCK_RESERVATION } from '@/lib/view-mode';

function MypagePageContent() {
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      setUserEmail(MOCK_RESERVATION.users.email);
      setReservations(MOCK_MYPAGE_RESERVATIONS);
      setPayments(MOCK_MYPAGE_PAYMENTS);
      setLoading(false);
      return;
    }
    const email = localStorage.getItem('user_email') || '';
    setUserEmail(email);
    if (email) {
      fetchData(email);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchData = async (email: string) => {
    try {
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        setLoading(false);
        return;
      }

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (!user) return;

      // Fetch reservations
      const { data: resData } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (resData) setReservations(resData);

      // Fetch payments
      const { data: payData } = await supabase
        .from('payments')
        .select('*, reservations(*)')
        .eq('reservations.user_id', user.id)
        .order('created_at', { ascending: false });

      if (payData) setPayments(payData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const labels: { [key: string]: string } = {
      reserved: '予約済み',
      done: '完了',
      estimated: '見積済み',
      paid: '支払済み',
      pending: '入金待ち',
      refunded: '返金済み',
    };
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      reserved: 'default',
      done: 'secondary',
      estimated: 'secondary',
      paid: 'default',
      pending: 'secondary',
      refunded: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">マイページ</h1>
        {(searchParams.get('view') === '1' || isViewMode()) && (
          <p className="text-muted-foreground mb-6">{MOCK_RESERVATION.users.name} 様　ログイン中</p>
        )}
        {!((searchParams.get('view') === '1' || isViewMode())) && <div className="mb-6" />}

        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reservations">予約履歴</TabsTrigger>
            <TabsTrigger value="payments">支払履歴</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>予約履歴</CardTitle>
                <CardDescription>過去の予約一覧</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日時</TableHead>
                      <TableHead>種類</TableHead>
                      <TableHead>住所</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>Zoom URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((res) => (
                      <TableRow key={res.id}>
                        <TableCell>{res.date} {res.time}</TableCell>
                        <TableCell>{res.type === 'onsite' ? '訪問' : 'Zoom'}</TableCell>
                        <TableCell>{res.address || '-'}</TableCell>
                        <TableCell>{getStatusBadge(res.status)}</TableCell>
                        <TableCell>
                          {res.zoom_url ? (
                            <a
                              href={res.zoom_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary flex items-center gap-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              開く
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>支払履歴</CardTitle>
                <CardDescription>過去の支払い一覧</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日時</TableHead>
                      <TableHead>金額</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>請求書</TableHead>
                      <TableHead>領収書</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((pay) => (
                      <TableRow key={pay.id}>
                        <TableCell>{new Date(pay.created_at).toLocaleDateString('ja-JP')}</TableCell>
                        <TableCell>¥{pay.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(pay.status)}</TableCell>
                        <TableCell>
                          {pay.invoice_pdf_url ? (
                            <a
                              href={pay.invoice_pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              ダウンロード
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {pay.receipt_pdf_url ? (
                            <a
                              href={pay.receipt_pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              ダウンロード
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function MypagePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <MypagePageContent />
    </Suspense>
  );
}





