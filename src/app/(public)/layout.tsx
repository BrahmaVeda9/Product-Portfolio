import { createServerSupabaseClient } from '@/lib/supabase/server';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('resume_url')
    .limit(1)
    .maybeSingle();

  return (
    <div className="lux min-h-screen flex flex-col">
      <Navbar resumeUrl={profile?.resume_url} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
