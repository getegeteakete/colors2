'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { isViewMode, setViewMode } from '@/lib/view-mode';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const view = typeof window !== 'undefined' && (searchParams.get('view') === '1' || isViewMode());
    if (view) {
      setViewMode();
      sessionStorage.setItem('admin_logged_in', 'true');
      sessionStorage.setItem('view_mode', '1');
      setIsAuthenticated(true);
      return;
    }
    const loggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    setIsAuthenticated(loggedIn);

    if (!loggedIn && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [router, pathname, searchParams]);

  // ログイン状態の確認中
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  // ログインしていない場合
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null; // リダイレクトが進行中
  }

  return <>{children}</>;
}
