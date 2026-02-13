'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { isViewMode, setViewMode, MOCK_ADMIN_PAYMENTS } from '@/lib/view-mode';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'paid' | 'refunded';
  stripe_intent: string | null;
  invoice_pdf_url: string | null;
  receipt_pdf_url: string | null;
  created_at: string;
  reservation_id: string;
  reservations: {
    id: string;
    date: string;
    time: string;
    type: 'onsite' | 'zoom';
    users: {
      name: string;
      email: string;
    };
  };
};

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      setPayments(MOCK_ADMIN_PAYMENTS as Payment[]);
      setLoading(false);
      return;
    }
    fetchPayments();
  }, [statusFilter, searchParams]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        return;
      }

      let query = supabase
        .from('payments')
        .select(`
          *,
          reservations!inner(
            id,
            date,
            time,
            type,
            users(name, email)
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast.error('決済データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'pending' | 'paid' | 'refunded') => {
    try {
      if (!supabase) return;

      const { error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success('ステータスを更新しました');
      fetchPayments();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('ステータスの更新に失敗しました');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: '入金待ち', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      paid: { label: '入金済み', className: 'bg-green-100 text-green-800 border-green-200' },
      refunded: { label: '返金済み', className: 'bg-red-100 text-red-800 border-red-200' },
    };
    const variant = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-8">
        <div className="text-center text-[#646970]">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">合計金額</div>
          <div className="text-2xl font-semibold text-[#23282d]">
            ¥{totalAmount.toLocaleString()}
          </div>
          <div className="text-xs text-[#646970] mt-1">
            {payments.length}件の決済
          </div>
        </div>
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">入金済み</div>
          <div className="text-2xl font-semibold text-green-600">
            ¥{paidAmount.toLocaleString()}
          </div>
          <div className="text-xs text-[#646970] mt-1">
            {payments.filter((p) => p.status === 'paid').length}件
          </div>
        </div>
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">入金待ち</div>
          <div className="text-2xl font-semibold text-yellow-600">
            ¥{pendingAmount.toLocaleString()}
          </div>
          <div className="text-xs text-[#646970] mt-1">
            {payments.filter((p) => p.status === 'pending').length}件
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#23282d]">決済一覧</h2>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ステータスで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="pending">入金待ち</SelectItem>
                <SelectItem value="paid">入金済み</SelectItem>
                <SelectItem value="refunded">返金済み</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPayments}
              className="border-[#c3c4c7]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              更新
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f7f7]">
                <TableHead className="text-[#23282d]">決済ID</TableHead>
                <TableHead className="text-[#23282d]">予約日時</TableHead>
                <TableHead className="text-[#23282d]">お客様名</TableHead>
                <TableHead className="text-[#23282d]">種類</TableHead>
                <TableHead className="text-[#23282d]">金額</TableHead>
                <TableHead className="text-[#23282d]">ステータス</TableHead>
                <TableHead className="text-[#23282d]">決済日時</TableHead>
                <TableHead className="text-[#23282d]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-[#646970] py-8">
                    決済データがありません
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="text-sm text-[#23282d] font-mono">
                        {payment.id.slice(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell className="text-[#23282d]">
                      <div>
                        {format(new Date(payment.reservations.date), 'yyyy年MM月dd日', {
                          locale: ja,
                        })}
                      </div>
                      <div className="text-sm text-[#646970]">{payment.reservations.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[#23282d]">{payment.reservations.users.name}</div>
                      <div className="text-sm text-[#646970]">{payment.reservations.users.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#c3c4c7]">
                        {payment.reservations.type === 'onsite' ? '訪問調査' : 'Zoom相談'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#23282d] font-semibold">
                      ¥{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={payment.status}
                        onValueChange={(value: 'pending' | 'paid' | 'refunded') =>
                          updateStatus(payment.id, value)
                        }
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
                    </TableCell>
                    <TableCell className="text-sm text-[#646970]">
                      {format(new Date(payment.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/reservations/${payment.reservation_id}`}>
                          <Button variant="outline" size="sm" className="border-[#c3c4c7]">
                            予約詳細
                          </Button>
                        </Link>
                        {payment.invoice_pdf_url && (
                          <a
                            href={payment.invoice_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="border-[#c3c4c7]">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              請求書
                            </Button>
                          </a>
                        )}
                        {payment.receipt_pdf_url && (
                          <a
                            href={payment.receipt_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="border-[#c3c4c7]">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              領収書
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
    </div>
  );
}
