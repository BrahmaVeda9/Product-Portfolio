import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database.types';
import type { Metadata } from 'next';
import ContactForm from '@/components/public/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for PM roles, advisory, or consulting opportunities.',
};

async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
  return data as Profile | null;
}

const contactChannels = [
  {
    label: 'Direct Email',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HEADER — Dark Navy
      ══════════════════════════════════════════════════ */}
      <section className="section-dark relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-navy-800/50 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-teal-900/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6">
          <span className="section-label-dark mb-4 block w-fit">Direct Communication</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Let's Start a<br />
            <span className="text-gold-gradient">Strategic Conversation</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
            Open to executive product leadership roles, AI product strategy, advisory engagements, and consulting partnerships.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONTACT CONTENT — Dark Navy (form on dark bg)
      ══════════════════════════════════════════════════ */}
      <section className="section-dark-alt py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">

            {/* ── Left: Info Cards ── */}
            <div className="space-y-4 lg:col-span-5">
              {/* Contact cards */}
              {profile?.email && (
                <div className="card-dark p-5 flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/8 text-gold-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">Direct Email</span>
                    <a href={`mailto:${profile.email}`} className="font-medium text-sm text-white hover:text-gold-300 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="card-dark p-5 flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/8 text-teal-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">Base Location</span>
                    <p className="font-medium text-sm text-white">{profile.location}</p>
                  </div>
                </div>
              )}

              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-dark card-dark-interactive p-5 flex items-center gap-4 block"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-navy-300/20 bg-navy-300/8 text-navy-300">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">Professional Network</span>
                    <p className="font-medium text-sm text-white">Connect on LinkedIn ↗</p>
                  </div>
                </a>
              )}

              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-dark card-dark-interactive p-5 flex items-center gap-4 block"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/8 text-gold-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">Documentation</span>
                    <p className="font-medium text-sm text-white">Download Executive CV PDF ↓</p>
                  </div>
                </a>
              )}

              {/* Availability note */}
              <div className="card-dark p-5 border border-emerald-500/15 bg-emerald-500/5">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="text-xs font-semibold text-emerald-400">Currently Available</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Open to full-time product leadership roles, strategic advisory, and consulting engagements. Typical response time: 24–48 hours.
                </p>
              </div>
            </div>

            {/* ── Right: Contact Form ── */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
