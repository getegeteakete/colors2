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
      <div className="flex min-h-screen bg-[#f0f0f1]">
        <AdminSidebar />
        <div className="ml-64 flex-1">
          <AdminHeader />
          <main className="mt-12 p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminAuth>
  );
}
