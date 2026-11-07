import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Double-check: middleware already handles redirect, but belt-and-suspenders
  if (!user) {
    redirect('/admin/login');
  }

  // Verify user ID matches the configured admin (optional hard-coded check)
  const adminId = process.env.ADMIN_USER_ID;
  if (adminId && user.id !== adminId) {
    redirect('/admin/login?error=unauthorized');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto bg-surface-950 p-8 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
