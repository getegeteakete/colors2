'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { isViewMode } from '@/lib/view-mode';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Clock,
  Settings,
  LogOut,
  PanelLeftClose,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
const menuItems = [
  { title: 'ダッシュボード', href: '/admin', icon: LayoutDashboard },
  { title: '予約管理', href: '/admin/reservations', icon: Calendar },
  { title: '決済管理', href: '/admin/payments', icon: CreditCard },
  { title: 'スケジュール管理', href: '/admin/schedule', icon: Clock },
  { title: '設定', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const viewQ = typeof window !== 'undefined' && isViewMode() ? '?view=1' : '';

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('view_mode');
    toast.success('ログアウトしました');
    router.push('/admin/login' + viewQ);
  };

  return (
    <aside className="w-64 bg-[#23282d] text-white h-screen fixed left-0 top-0 overflow-y-auto z-40">
      {/* サイト名エリア（WP風） */}
      <div className="p-3 border-b border-[#32373c] flex items-center gap-2 min-h-[52px]">
        <Image src="/logo.png" alt="" width={28} height={28} className="rounded flex-shrink-0" />
        <span className="text-sm font-semibold text-white truncate">COLORS 管理画面</span>
      </div>

      <nav className="p-2">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href + viewQ}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-normal transition-colors',
                    isActive
                      ? 'bg-[#0073aa] text-white border-l-4 border-l-[#0073aa]'
                      : 'text-[#b4b9be] hover:bg-[#32373c] hover:text-white border-l-4 border-l-transparent'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* メニューを閉じる・ログアウト（WP風） */}
      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-[#32373c] bg-[#23282d]">
        <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#b4b9be]">
          <PanelLeftClose className="w-5 h-5 flex-shrink-0" />
          <span>メニューを閉じる</span>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-[#b4b9be] hover:text-white hover:bg-[#32373c] rounded-none h-auto py-2.5 px-3 font-normal"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>ログアウト</span>
        </Button>
      </div>
    </aside>
  );
}
