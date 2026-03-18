'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { isViewMode, setViewMode, MOCK_ADMIN_RESERVATIONS } from '@/lib/view-mode';
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
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Eye, RefreshCw, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';

type Reservation = {
  id: string;
  type: 'onsite' | 'zoom';
  date: string;
  time: string;
  address: string | null;
  zoom_url: string | null;
  content: string;
  photos: string[];
  ai_price: number | null;
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

function ReservationsPageContent() {
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchName, setSearchName] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      setReservations(MOCK_ADMIN_RESERVATIONS as Reservation[]);
      setLoading(false);
      return;
    }
    fetchReservations();
  }, [statusFilter, searchName, searchDate, searchParams]);

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
      if (searchDate) {
        query = query.eq('date', searchDate);
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

  const handleDelete = async () => {
    if (!deleteTarget || !supabase) return;
    setDeleting(true);
    try {
      // 支払いを先に削除（外部キー制約のため）
      await supabase.from('payments').delete().eq('reservation_id', deleteTarget.id);
      // 予約を削除
      const { error } = await supabase.from('reservations').delete().eq('id', deleteTarget.id);
      if (error) throw error;

      // ユーザーの他の予約がなければユーザーも削除
      const { data: otherReservations } = await supabase
        .from('reservations')
        .select('id')
        .eq('user_id', (deleteTarget as any).user_id || '');
      if (otherReservations && otherReservations.length === 0) {
        await supabase.from('users').delete().eq('email', deleteTarget.users.email);
      }

      toast.success(`${deleteTarget.users.name}様の予約を削除しました`);
      setDeleteTarget(null);
      fetchReservations();
    } catch (error: any) {
      toast.error('削除に失敗しました: ' + error.message);
    } finally {
      setDeleting(false);
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
        <div className="px-5 py-4 border-b border-[#c3c4c7] flex flex-wrap items-center gap-3 justify-between">
          <h2 className="text-base font-semibold text-[#23282d]">予約一覧</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#646970]" />
              <Input
                className="pl-8 h-9 w-40 border-[#c3c4c7] text-sm"
                placeholder="お客様名で検索"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
            </div>
            <Input
              type="date"
              className="h-9 w-40 border-[#c3c4c7] text-sm"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
            />
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
                reservations
                  .filter(r => !searchName || r.users.name.includes(searchName) || r.users.email.includes(searchName))
                  .map((reservation) => (
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
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/reservations/${reservation.id}`}>
                          <Button variant="outline" size="sm" className="border-[#c3c4c7]">
                            <Eye className="h-4 w-4 mr-1" />
                            詳細
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          onClick={() => setDeleteTarget(reservation)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

      {/* 削除確認ダイアログ */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />予約を削除
            </DialogTitle>
            <DialogDescription>
              この操作は取り消せません。本当に削除しますか？
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm my-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">お客様名</span>
                <span className="font-medium">{deleteTarget.users.name} 様</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">メール</span>
                <span>{deleteTarget.users.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">予約日時</span>
                <span>{deleteTarget.date} {deleteTarget.time?.slice(0,5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">種類</span>
                <span>{deleteTarget.type === 'onsite' ? '訪問調査' : 'Zoom相談'}</span>
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            ※ 関連する支払い情報も同時に削除されます。他に予約がない場合はお客様情報も削除されます。
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>キャンセル</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? '削除中...' : '削除する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ReservationsPage() {
  return (
    <Suspense fallback={<div className="p-6"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <ReservationsPageContent />
    </Suspense>
  );
}
