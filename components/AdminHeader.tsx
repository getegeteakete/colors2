'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isViewMode } from '@/lib/view-mode';
import { Home, User, ChevronDown } from 'lucide-react';

const pageTitles: { [key: string]: string } = {
  '/admin': 'ダッシュボード',
  '/admin/reservations': '予約管理',
  '/admin/payments': '決済管理',
  '/admin/schedule': 'スケジュール管理',
  '/admin/settings': '設定',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || '管理画面';
  const [adminName, setAdminName] = useState<string>('管理者');

  useEffect(() => {
    if (isViewMode()) {
      setAdminName('管理者');
    }
  }, []);

  return (
    <div className="h-12 bg-white border-b border-[#c3c4c7] shadow-[0_1px_0_rgba(0,0,0,0.1)] fixed top-0 left-64 right-0 z-50 flex items-center justify-between px-4">
      {/* 左: サイト名・ホーム */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#23282d] hover:text-[#0073aa] text-sm font-medium"
        >
          <Home className="w-4 h-4" />
          <span>COLORS調査予約</span>
        </Link>
        <span className="text-[#c3c4c7]">|</span>
        <span className="text-sm text-[#646970]">{title}</span>
      </div>

      {/* 右: こんにちは、〇〇さん・ログイン中 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#23282d]">
          こんにちは、<span className="font-medium">{adminName}</span>さん
        </span>
        <div className="w-8 h-8 rounded-full bg-[#0073aa] flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs text-[#646970]">ログイン中</span>
        <button
          type="button"
          className="p-1 rounded hover:bg-[#f0f0f1] text-[#646970]"
          aria-label="表示オプション"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
