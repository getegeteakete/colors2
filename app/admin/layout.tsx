'use client';

import { usePathname } from 'next/navigation';
import AdminAuth from '@/components/AdminAuth';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <AdminAuth>
        {children}
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-[#f0f0f1]">
        <AdminSidebar />
        <AdminHeader />
        <main className="ml-64 pt-12 p-6 min-h-screen">
          {children}
        </main>
      </div>
    </AdminAuth>
  );
}
