'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { isViewMode, setViewMode, MOCK_ADMIN_STATS } from '@/lib/view-mode';

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const [stats, setStats] = useState({
    todayReservations: 0,
    weekReservations: 0,
    pendingPayments: 0,
    completedReservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const viewQ = typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode()) ? '?view=1' : '';

  const fetchStats = async () => {
    try {
      if (!supabase) {
        console.error('Supabaseが設定されていません');
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      // Today's reservations
      const { count: todayCount } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('date', today);

      // Week's reservations
      const { count: weekCount } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .gte('date', weekAgoStr);

      // Pending payments
      const { count: pendingCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Completed reservations
      const { count: completedCount } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done');

      setStats({
        todayReservations: todayCount || 0,
        weekReservations: weekCount || 0,
        pendingPayments: pendingCount || 0,
        completedReservations: completedCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode())) {
      setViewMode();
      setStats(MOCK_ADMIN_STATS);
      setLoading(false);
      return;
    }
    fetchStats();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-8">
        <div className="text-center text-[#646970]">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[#50575e]">今日の予約</h3>
            <Calendar className="h-5 w-5 text-[#0073aa]" />
          </div>
          <div className="text-3xl font-normal text-[#23282d]">{stats.todayReservations}</div>
        </div>

        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[#50575e]">今週の予約</h3>
            <Clock className="h-5 w-5 text-[#0073aa]" />
          </div>
          <div className="text-3xl font-normal text-[#23282d]">{stats.weekReservations}</div>
        </div>

        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[#50575e]">入金待ち</h3>
            <DollarSign className="h-5 w-5 text-[#0073aa]" />
          </div>
          <div className="text-3xl font-normal text-[#23282d]">{stats.pendingPayments}</div>
        </div>

        <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[#50575e]">完了件数</h3>
            <CheckCircle className="h-5 w-5 text-[#0073aa]" />
          </div>
          <div className="text-3xl font-normal text-[#23282d]">{stats.completedReservations}</div>
        </div>
      </div>

      {/* クイックアクセス */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
        <div className="px-5 py-4 border-b border-[#c3c4c7]">
          <h2 className="text-base font-semibold text-[#23282d]">クイックアクセス</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/admin/reservations${viewQ}`}
              className="block p-4 border border-[#c3c4c7] rounded hover:border-[#0073aa] hover:bg-[#f0f6fc] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-[#0073aa]" />
                <div>
                  <div className="font-medium text-[#23282d]">予約管理</div>
                  <div className="text-sm text-[#646970]">予約一覧と詳細管理</div>
                </div>
              </div>
            </Link>

            <Link
              href={`/admin/payments${viewQ}`}
              className="block p-4 border border-[#c3c4c7] rounded hover:border-[#0073aa] hover:bg-[#f0f6fc] transition-colors"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-[#0073aa]" />
                <div>
                  <div className="font-medium text-[#23282d]">決済管理</div>
                  <div className="text-sm text-[#646970]">決済一覧とステータス管理</div>
                </div>
              </div>
            </Link>

            <Link
              href={`/admin/schedule${viewQ}`}
              className="block p-4 border border-[#c3c4c7] rounded hover:border-[#0073aa] hover:bg-[#f0f6fc] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-[#0073aa]" />
                <div>
                  <div className="font-medium text-[#23282d]">スケジュール管理</div>
                  <div className="text-sm text-[#646970]">営業日と空き枠の設定</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
