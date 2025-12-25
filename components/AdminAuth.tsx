'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // セッションストレージからログイン状態を確認
    const loggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    setIsAuthenticated(loggedIn);

    // ログインしていない場合はログインページにリダイレクト
    if (!loggedIn && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [router, pathname]);

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
