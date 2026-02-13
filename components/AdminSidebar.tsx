'use client';

import Link from 'next/link';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const menuItems = [
  {
    title: 'ダッシュボード',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '予約管理',
    href: '/admin/reservations',
    icon: Calendar,
  },
  {
    title: '決済管理',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'スケジュール管理',
    href: '/admin/schedule',
    icon: Clock,
  },
  {
    title: '設定',
    href: '/admin/settings',
    icon: Settings,
  },
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
    <div className="w-64 bg-[#23282d] text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-[#32373c]">
        <h1 className="text-xl font-bold text-white">COLORS 管理画面</h1>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href + viewQ}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#0073aa] text-white'
                      : 'text-[#b4b9be] hover:bg-[#32373c] hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#32373c]">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-[#b4b9be] hover:text-white hover:bg-[#32373c]"
        >
          <LogOut className="w-5 h-5 mr-3" />
          ログアウト
        </Button>
      </div>
    </div>
  );
}
