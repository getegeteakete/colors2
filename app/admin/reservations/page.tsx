'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
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
import { Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type Reservation = {
  id: string;
  type: 'onsite' | 'zoom';
  date: string;
  time: string;
  address: string | null;
  content: string;
  status: 'reserved' | 'done' | 'estimated';
  created_at: string;
  users: {
    name: string;
    email: string;
    phone: string | null;
  };
  payments: Array<{
    id: string;
    amount: number;
    status: 'pending' | 'paid' | 'refunded';
  }>;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        return;
      }

      let query = supabase
        .from('reservations')
        .select(`
          *,
          users(*),
          payments(id, amount, status)
        `)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReservations(data || []);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      toast.error('予約データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'reserved' | 'done' | 'estimated') => {
    try {
      if (!supabase) return;

      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success('ステータスを更新しました');
      fetchReservations();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('ステータスの更新に失敗しました');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      reserved: { label: '予約済み', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      estimated: { label: '見積済み', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      done: { label: '完了', className: 'bg-green-100 text-green-800 border-green-200' },
    };
    const variant = variants[status] || variants.reserved;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    return type === 'onsite' ? '訪問調査' : 'Zoom相談';
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-8">
        <div className="text-center text-[#646970]">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#23282d]">予約一覧</h2>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ステータスで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="reserved">予約済み</SelectItem>
                <SelectItem value="estimated">見積済み</SelectItem>
                <SelectItem value="done">完了</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchReservations}
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
                <TableHead className="text-[#23282d]">日時</TableHead>
                <TableHead className="text-[#23282d]">お客様名</TableHead>
                <TableHead className="text-[#23282d]">種類</TableHead>
                <TableHead className="text-[#23282d]">住所/URL</TableHead>
                <TableHead className="text-[#23282d]">ステータス</TableHead>
                <TableHead className="text-[#23282d]">決済状況</TableHead>
                <TableHead className="text-[#23282d]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-[#646970] py-8">
                    予約データがありません
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="text-[#23282d]">
                      <div>
                        {format(new Date(reservation.date), 'yyyy年MM月dd日', { locale: ja })}
                      </div>
                      <div className="text-sm text-[#646970]">{reservation.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[#23282d]">{reservation.users.name}</div>
                      <div className="text-sm text-[#646970]">{reservation.users.email}</div>
                      {reservation.users.phone && (
                        <div className="text-sm text-[#646970]">{reservation.users.phone}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#c3c4c7]">
                        {getTypeLabel(reservation.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {reservation.type === 'onsite' ? (
                        <div className="text-sm text-[#23282d] truncate">
                          {reservation.address || '-'}
                        </div>
                      ) : (
                        <div className="text-sm text-[#0073aa] truncate">
                          {reservation.zoom_url || 'URL未設定'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={reservation.status}
                        onValueChange={(value: 'reserved' | 'done' | 'estimated') =>
                          updateStatus(reservation.id, value)
                        }
                      >
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reserved">予約済み</SelectItem>
                          <SelectItem value="estimated">見積済み</SelectItem>
                          <SelectItem value="done">完了</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {reservation.payments && reservation.payments.length > 0 ? (
                        reservation.payments.map((payment) => (
                          <div key={payment.id} className="text-sm">
                            <Badge
                              variant="outline"
                              className={
                                payment.status === 'paid'
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : payment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }
                            >
                              {payment.status === 'paid'
                                ? '入金済み'
                                : payment.status === 'pending'
                                ? '入金待ち'
                                : '返金済み'}
                            </Badge>
                            <div className="text-xs text-[#646970] mt-1">
                              ¥{payment.amount.toLocaleString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-[#646970]">未決済</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/reservations/${reservation.id}`}>
                        <Button variant="outline" size="sm" className="border-[#c3c4c7]">
                          <Eye className="h-4 w-4 mr-1" />
                          詳細
                        </Button>
                      </Link>
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
