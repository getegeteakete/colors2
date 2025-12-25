'use client';

import { usePathname } from 'next/navigation';

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

  return (
    <div className="bg-white border-b border-[#c3c4c7] h-12 fixed top-0 left-64 right-0 z-40 flex items-center px-8">
      <h1 className="text-base font-normal text-[#23282d]">{title}</h1>
    </div>
  );
}
