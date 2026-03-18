'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { RefreshCw, Search, Trash2, User, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  password_hash: string | null;
  reservations: { id: string; date: string; time: string; status: string; type: string }[];
  payments: { id: string; amount: number; status: string }[];
};

function CustomersPageContent() {
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [detail, setDetail] = useState<Customer | null>(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          reservations(id, date, time, status, type),
          payments:reservations(payments(id, amount, status))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // paymentsをフラット化
      const formatted = (data || []).map((u: any) => ({
        ...u,
        payments: (u.reservations || []).flatMap((r: any) => r.payments || []),
      }));

      setCustomers(formatted);
    } catch (e: any) {
      toast.error('顧客データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !supabase) return;
    setDeleting(true);
    try {
      // 支払い→予約→ユーザーの順で削除
      const resIds = deleteTarget.reservations.map(r => r.id);
      if (resIds.length > 0) {
        await supabase.from('payments').delete().in('reservation_id', resIds);
        await supabase.from('reservations').delete().in('id', resIds);
      }
      const { error } = await supabase.from('users').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast.success(`${deleteTarget.name}様の情報を削除しました`);
      setDeleteTarget(null);
      fetchCustomers();
    } catch (e: any) {
      toast.error('削除に失敗しました: ' + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = customers.filter(c =>
    !search ||
    c.name.includes(search) ||
    c.email.includes(search) ||
    (c.phone || '').includes(search)
  );

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      reserved: { label: '予約済み', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      done: { label: '完了', className: 'bg-green-100 text-green-800 border-green-200' },
      estimated: { label: '見積済み', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    };
    const s = map[status] || { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' };
    return <Badge variant="outline" className={s.className}>{s.label}</Badge>;
  };

  const totalPaid = (customer: Customer) =>
    customer.payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);

  if (loading) return (
    <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-8 text-center text-[#646970]">読み込み中...</div>
  );

  return (
    <div className="space-y-4">
      {/* サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">登録顧客数</div>
          <div className="text-2xl font-semibold text-[#23282d]">{customers.length}名</div>
        </div>
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">マイページ設定済み</div>
          <div className="text-2xl font-semibold text-blue-600">
            {customers.filter(c => c.password_hash).length}名
          </div>
          <div className="text-xs text-[#646970] mt-1">パスワード登録済み</div>
        </div>
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="text-sm text-[#646970] mb-1">総予約件数</div>
          <div className="text-2xl font-semibold text-[#23282d]">
            {customers.reduce((s, c) => s + c.reservations.length, 0)}件
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7] flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-[#23282d]">顧客一覧</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#646970]" />
              <Input
                className="pl-8 h-9 w-52 border-[#c3c4c7] text-sm"
                placeholder="名前・メール・電話で検索"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchCustomers} className="border-[#c3c4c7]">
              <RefreshCw className="h-4 w-4 mr-2" />更新
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f7f7]">
                <TableHead>お客様名</TableHead>
                <TableHead>連絡先</TableHead>
                <TableHead>住所</TableHead>
                <TableHead>予約数</TableHead>
                <TableHead>入金済み額</TableHead>
                <TableHead>マイページ</TableHead>
                <TableHead>登録日</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-[#646970] py-8">
                    {search ? `「${search}」に一致する顧客が見つかりません` : '顧客データがありません'}
                  </TableCell>
                </TableRow>
              ) : filtered.map(customer => (
                <TableRow key={customer.id} className="hover:bg-[#f6f7f7]">
                  <TableCell>
                    <div className="font-medium text-[#23282d]">{customer.name}</div>
                    <div className="text-xs text-[#646970] mt-0.5">{customer.email}</div>
                  </TableCell>
                  <TableCell className="text-sm text-[#646970]">
                    {customer.phone || <span className="text-[#bbb]">未登録</span>}
                  </TableCell>
                  <TableCell className="text-sm text-[#646970] max-w-[160px] truncate">
                    {customer.address || <span className="text-[#bbb]">未登録</span>}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[#23282d]">{customer.reservations.length}件</span>
                  </TableCell>
                  <TableCell className="font-medium text-green-700">
                    {totalPaid(customer) > 0 ? `¥${totalPaid(customer).toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>
                    {customer.password_hash
                      ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">設定済み</Badge>
                      : <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">未設定</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-sm text-[#646970] whitespace-nowrap">
                    {format(new Date(customer.created_at), 'yyyy/MM/dd', { locale: ja })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline" size="sm"
                        className="border-[#c3c4c7] h-7 text-xs"
                        onClick={() => setDetail(customer)}
                      >
                        詳細
                      </Button>
                      <Button
                        variant="outline" size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 h-7"
                        onClick={() => setDeleteTarget(customer)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 顧客詳細ダイアログ */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#0073aa]" />
              {detail?.name} 様
            </DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-[#646970]">
                  <Mail className="h-4 w-4" />{detail.email}
                </div>
                <div className="flex items-center gap-2 text-[#646970]">
                  <Phone className="h-4 w-4" />{detail.phone || '未登録'}
                </div>
                <div className="flex items-center gap-2 text-[#646970] col-span-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />{detail.address || '未登録'}
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-[#646970] mb-2 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />予約履歴（{detail.reservations.length}件）
                </p>
                {detail.reservations.length === 0 ? (
                  <p className="text-sm text-[#bbb]">予約なし</p>
                ) : (
                  <div className="space-y-1">
                    {detail.reservations.map(r => (
                      <div key={r.id} className="flex items-center justify-between bg-[#f6f7f7] rounded px-3 py-2 text-sm">
                        <span>{r.date} {r.time?.slice(0,5)} / {r.type === 'onsite' ? '訪問' : 'Zoom'}</span>
                        {getStatusBadge(r.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-[#646970] mb-2 flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5" />支払い履歴（{detail.payments.length}件）
                </p>
                {detail.payments.length === 0 ? (
                  <p className="text-sm text-[#bbb]">支払いなし</p>
                ) : (
                  <div className="space-y-1">
                    {detail.payments.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#f6f7f7] rounded px-3 py-2 text-sm">
                        <span>¥{Number(p.amount).toLocaleString()}</span>
                        <Badge variant="outline" className={
                          p.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }>
                          {p.status === 'paid' ? '入金済み' : '入金待ち'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetail(null)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />顧客情報を削除
            </DialogTitle>
            <DialogDescription>この操作は取り消せません。本当に削除しますか？</DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm my-2">
              <div className="flex justify-between"><span className="text-muted-foreground">お名前</span><span className="font-medium">{deleteTarget.name} 様</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">メール</span><span>{deleteTarget.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">予約件数</span><span>{deleteTarget.reservations.length}件</span></div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">※ 関連する予約・支払い情報もすべて削除されます。</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>キャンセル</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="h-4 w-4 mr-2" />{deleting ? '削除中...' : '削除する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-6"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <CustomersPageContent />
    </Suspense>
  );
}
