import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database.types';
import type { Metadata } from 'next';
import ContactForm from '@/components/public/ContactForm';
import PageHeader from '@/components/public/PageHeader';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for PM roles, advisory, or consulting opportunities.',
};

async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
  return data as Profile | null;
}

export default async function ContactPage() {
  const profile = await getProfile();

  const channels: { label: string; value: React.ReactNode }[] = [];
  if (profile?.email) {
    channels.push({
      label: 'Direct email',
      value: <a href={`mailto:${profile.email}`} className="link-lux">{profile.email}</a>,
    });
  }
  if (profile?.location) {
    channels.push({ label: 'Base location', value: <span>{profile.location}</span> });
  }
  if (profile?.linkedin_url) {
    channels.push({
      label: 'Professional network',
      value: (
        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="link-lux">
          Connect on LinkedIn ↗
        </a>
      ),
    });
  }
  if (profile?.resume_url) {
    channels.push({
      label: 'Documentation',
      value: (
        <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="link-lux">
          Download executive CV ↓
        </a>
      ),
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Direct communication"
        title={
          <>
            Let&apos;s start a{' '}
            <span className="italic text-champagne">strategic conversation</span>
          </>
        }
        intro="Open to executive product leadership roles, AI product strategy, advisory engagements, and consulting partnerships."
      />

      <section className="pb-28 sm:pb-36">
        <div className="lux-container grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Details */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-champagne-300">
              <span className="status-dot" />
              Currently available
            </div>
            <p className="font-display mt-6 text-3xl font-light leading-snug text-parchment-100">
              Full-time product leadership, strategic advisory and consulting engagements.
            </p>
            <p className="mt-4 text-sm text-taupe-300">Typical response time: 24–48 hours.</p>

            {channels.length > 0 && (
              <dl className="mt-12 border-t border-white/[0.08]">
                {channels.map((c) => (
                  <div key={c.label} className="flex flex-col gap-2 border-b border-white/[0.08] py-6">
                    <dt className="label">{c.label}</dt>
                    <dd className="min-w-0 break-words text-lg font-light text-parchment-100">{c.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
