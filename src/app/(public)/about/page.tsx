import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database.types';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about my background, values, and product philosophy.',
};

async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
  return data as Profile | null;
}

export default async function AboutPage() {
  const profile = await getProfile();

  const headline = profile?.headline || 'Executive Product Leader & Strategic Operator';
  const defaultSummary = [
    'Senior Product Leader with deep expertise spanning 0→1 innovation, venture-backed scaling, and multi-stakeholder enterprise modernization. Specializing in bridging the gap between cutting-edge technical architecture (AI/GenAI, autonomous workflows) and commercial viability.',
    'Throughout my career, I have operated at the intersection of business strategy, customer discovery, and engineering execution. I cultivate high-performing cross-functional teams, implement data-informed roadmaps, and ship resilient products that deliver tangible business outcomes and compounding customer value.',
    'Currently exploring strategic leadership roles, advisory engagements, and collaboration with visionary founders and leadership teams building the next generation of intelligent software.'
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 block mb-3">
            Leadership Profile
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Product Philosophy, Vision & Stewardship
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Delivering defensible market advantage by aligning organizational strategy with deep user empathy and technical precision.
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Portrait & Executive Details */}
          <div className="space-y-6 lg:col-span-5">
            <div className="exec-card overflow-hidden">
              <div className="relative aspect-[4/5] w-full bg-zinc-950">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name ?? 'Executive Portrait'}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-gradient-to-b from-[#141724] to-[#0a0c13] text-center">
                    <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-2xl font-bold tracking-wider text-white shadow-inner mb-3">
                      {profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : 'PM'}
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {profile?.full_name || 'Product Executive'}
                    </p>
                    <p className="text-xs text-zinc-400">Leadership Dossier</p>
                  </div>
                )}
              </div>

              {/* Verified Credentials / Contact Details */}
              <div className="p-6 space-y-4 border-t border-white/[0.08] bg-[#0c0e17]">
                {profile?.location && (
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <svg className="h-4 w-4 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <svg className="h-4 w-4 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <a href={`mailto:${profile.email}`} className="text-zinc-300 hover:text-white transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile?.linkedin_url && (
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <svg className="h-4 w-4 text-zinc-500 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white transition-colors"
                    >
                      LinkedIn Profile ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Button */}
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="exec-btn-primary w-full text-center"
              >
                <span>Download Executive CV ↓</span>
              </a>
            )}
          </div>

          {/* Right Column: Narrative & Focus Areas */}
          <div className="space-y-10 lg:col-span-7">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
                {headline}
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-zinc-300">
                {(profile?.summary ? profile.summary.split('\n\n') : defaultSummary).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Focus Domains */}
            {profile?.keywords && profile.keywords.length > 0 && (
              <div className="border-t border-white/[0.08] pt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                  Core Focus & Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.keywords.map((kw) => (
                    <span key={kw} className="exec-badge">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="border-t border-white/[0.08] pt-8 flex flex-wrap gap-3.5">
              <Link href="/projects" className="exec-btn-primary">
                <span>View Product Case Studies →</span>
              </Link>
              <Link href="/experience" className="exec-btn-secondary">
                <span>Career History</span>
              </Link>
              <Link href="/contact" className="exec-btn-secondary">
                <span>Direct Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
