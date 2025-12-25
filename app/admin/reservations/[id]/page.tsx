'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

type ReservationDetail = {
  id: string;
  type: 'onsite' | 'zoom';
  date: string;
  time: string;
  address: string | null;
  content: string;
  photos: string[];
  zoom_url: string | null;
  ai_price: number | null;
  status: 'reserved' | 'done' | 'estimated';
  created_at: string;
  users: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  payments: Array<{
    id: string;
    amount: number;
    status: 'pending' | 'paid' | 'refunded';
    stripe_intent: string | null;
    invoice_pdf_url: string | null;
    receipt_pdf_url: string | null;
    created_at: string;
  }>;
};

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservation();
  }, [id]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        return;
      }

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          users(*),
          payments(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setReservation(data);
    } catch (error: any) {
      console.error('Error fetching reservation:', error);
      toast.error('予約データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: 'reserved' | 'done' | 'estimated') => {
    try {
      if (!supabase || !reservation) return;

      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', reservation.id);

      if (error) throw error;
      toast.success('ステータスを更新しました');
      fetchReservation();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('ステータスの更新に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-8">
        <div className="text-center text-[#646970]">読み込み中...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-8">
        <div className="text-center text-[#646970]">予約が見つかりません</div>
        <Link href="/admin/reservations">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/admin/reservations">
          <Button variant="outline" size="sm" className="border-[#c3c4c7]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
        </Link>
        <h2 className="text-xl font-semibold text-[#23282d]">予約詳細</h2>
      </div>

      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7] flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#23282d]">基本情報</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#646970]">ステータス:</span>
            <Select
              value={reservation.status}
              onValueChange={(value: 'reserved' | 'done' | 'estimated') => updateStatus(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reserved">予約済み</SelectItem>
                <SelectItem value="estimated">見積済み</SelectItem>
                <SelectItem value="done">完了</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="p-5 space-y-6">
          {/* 予約情報 */}
          <div>
            <h4 className="text-sm font-semibold text-[#23282d] mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              予約情報
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[#646970] mb-1">種類</div>
                <div className="text-[#23282d]">
                  <Badge variant="outline" className="border-[#c3c4c7]">
                    {reservation.type === 'onsite' ? '訪問調査' : 'Zoom相談'}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-[#646970] mb-1">日時</div>
                <div className="text-[#23282d] flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(reservation.date), 'yyyy年MM月dd日', { locale: ja })}
                  <Clock className="h-4 w-4 ml-2" />
                  {reservation.time}
                </div>
              </div>
              {reservation.type === 'onsite' && reservation.address && (
                <div className="col-span-2">
                  <div className="text-[#646970] mb-1">訪問先住所</div>
                  <div className="text-[#23282d] flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {reservation.address}
                  </div>
                </div>
              )}
              {reservation.type === 'zoom' && reservation.zoom_url && (
                <div className="col-span-2">
                  <div className="text-[#646970] mb-1">Zoom URL</div>
                  <div className="text-[#23282d]">
                    <a
                      href={reservation.zoom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0073aa] hover:underline"
                    >
                      {reservation.zoom_url}
                    </a>
                  </div>
                </div>
              )}
              {reservation.ai_price && (
                <div>
                  <div className="text-[#646970] mb-1">見積金額</div>
                  <div className="text-[#23282d] font-semibold">
                    ¥{reservation.ai_price.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* お客様情報 */}
          <div>
            <h4 className="text-sm font-semibold text-[#23282d] mb-3">お客様情報</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[#646970] mb-1">お名前</div>
                <div className="text-[#23282d]">{reservation.users.name}</div>
              </div>
              <div>
                <div className="text-[#646970] mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  メールアドレス
                </div>
                <div className="text-[#23282d]">
                  <a
                    href={`mailto:${reservation.users.email}`}
                    className="text-[#0073aa] hover:underline"
                  >
                    {reservation.users.email}
                  </a>
                </div>
              </div>
              {reservation.users.phone && (
                <div>
                  <div className="text-[#646970] mb-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    電話番号
                  </div>
                  <div className="text-[#23282d]">
                    <a
                      href={`tel:${reservation.users.phone}`}
                      className="text-[#0073aa] hover:underline"
                    >
                      {reservation.users.phone}
                    </a>
                  </div>
                </div>
              )}
              {reservation.users.address && (
                <div>
                  <div className="text-[#646970] mb-1">住所</div>
                  <div className="text-[#23282d]">{reservation.users.address}</div>
                </div>
              )}
            </div>
          </div>

          {/* ご相談内容 */}
          <div>
            <h4 className="text-sm font-semibold text-[#23282d] mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              ご相談内容
            </h4>
            <div className="bg-[#f6f7f7] border border-[#c3c4c7] rounded p-4 text-sm text-[#23282d] whitespace-pre-wrap">
              {reservation.content}
            </div>
          </div>

          {/* 決済情報 */}
          {reservation.payments && reservation.payments.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#23282d] mb-3">決済情報</h4>
              <div className="space-y-3">
                {reservation.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="border border-[#c3c4c7] rounded p-4 bg-[#f6f7f7]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-[#23282d]">
                        金額: ¥{payment.amount.toLocaleString()}
                      </div>
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
                    </div>
                    <div className="text-xs text-[#646970]">
                      作成日時:{' '}
                      {format(new Date(payment.created_at), 'yyyy年MM月dd日 HH:mm', {
                        locale: ja,
                      })}
                    </div>
                    {payment.invoice_pdf_url && (
                      <div className="mt-2">
                        <a
                          href={payment.invoice_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0073aa] hover:underline"
                        >
                          請求書PDF
                        </a>
                      </div>
                    )}
                    {payment.receipt_pdf_url && (
                      <div className="mt-1">
                        <a
                          href={payment.receipt_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0073aa] hover:underline"
                        >
                          領収書PDF
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 写真 */}
          {reservation.photos && reservation.photos.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#23282d] mb-3">お客様がアップロードした写真</h4>
              <div className="grid grid-cols-4 gap-4">
                {reservation.photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={photo}
                      alt={`写真 ${index + 1}`}
                      className="w-full h-full object-cover rounded border border-[#c3c4c7]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
