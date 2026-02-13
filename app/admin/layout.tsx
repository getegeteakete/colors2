import AdminAuth from '@/components/AdminAuth';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-[#f0f0f1]">
        {/* WP風: サイドバーは画面上端から全高、ヘッダーはコンテンツ上のみ */}
        <AdminSidebar />
        <AdminHeader />
        <main className="ml-64 pt-12 p-6 min-h-screen">
          {children}
        </main>
      </div>
    </AdminAuth>
  );
}
