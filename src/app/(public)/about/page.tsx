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

const pmApproach = [
  {
    title: 'User-Centered Discovery',
    desc: 'Deep qualitative and quantitative research to surface the real jobs-to-be-done before a single line of code is written.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
  },
  {
    title: 'Data-Informed Roadmaps',
    desc: 'Prioritization frameworks that balance business impact, technical feasibility, and user value — clearly communicated to all stakeholders.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: 'Cross-Functional Execution',
    desc: 'Engineering empathy combined with business acumen to align diverse teams and remove delivery blockers without micromanagement.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197" />
      </svg>
    ),
  },
];

export default async function AboutPage() {
  const profile = await getProfile();

  const headline = profile?.headline || 'Executive Product Leader & Strategic Operator';
  const defaultSummary = [
    'Senior Product Leader with deep expertise spanning 0→1 innovation, venture-backed scaling, and multi-stakeholder enterprise modernization. Specializing in bridging the gap between cutting-edge technical architecture (AI/GenAI, autonomous workflows) and commercial viability.',
    'Throughout my career, I have operated at the intersection of business strategy, customer discovery, and engineering execution. I cultivate high-performing cross-functional teams, implement data-informed roadmaps, and ship resilient products that deliver tangible business outcomes.',
    'Currently exploring strategic leadership roles, advisory engagements, and collaboration with visionary founders and leadership teams building the next generation of intelligent software.',
  ];

  // about_approach is the dedicated About page bio; fall back to summary then default
  const bioSource = profile?.about_approach || profile?.summary;
  const paragraphs = bioSource
    ? bioSource.split('\n\n').filter(Boolean)
    : defaultSummary;


  return (
    <>
      {/* ══════════════════════════════════════════════════
          ABOUT HEADER — Dark Navy
      ══════════════════════════════════════════════════ */}
      <section className="section-dark relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-navy-800/50 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-teal-900/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6">
          <span className="section-label-dark mb-4 block w-fit">Leadership Profile</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight max-w-3xl">
            Product Philosophy,<br />
            <span className="text-gold-gradient">Vision & Stewardship</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Delivering defensible market advantage by aligning organizational strategy with deep user empathy and technical precision.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT CONTENT — Light Ivory
      ══════════════════════════════════════════════════ */}
      <section className="section-light py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">

            {/* ── Left: Portrait & Details ── */}
            <div className="space-y-6 lg:col-span-5">
              <div className="card-light overflow-hidden shadow-card">
                <div className="relative aspect-[4/5] w-full bg-ivory-200">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name ?? 'Product Manager Portrait'}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-gradient-to-b from-ivory-200 to-ivory-300 text-center">
                      <div className="h-24 w-24 rounded-2xl border-2 border-navy-900/10 bg-white flex items-center justify-center text-3xl font-black text-navy-900 shadow-card mb-4">
                        {profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : 'PM'}
                      </div>
                      <p className="text-sm font-semibold text-navy-900">
                        {profile?.full_name || 'Product Executive'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Product Leadership</p>
                    </div>
                  )}
                </div>

                {/* Profile details strip */}
                <div className="p-6 space-y-3 bg-white border-t border-navy-900/06">
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <svg className="h-4 w-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <svg className="h-4 w-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <a href={`mailto:${profile.email}`} className="text-navy-800 hover:text-teal-600 transition-colors font-medium">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile?.linkedin_url && (
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <svg className="h-4 w-4 text-teal-500 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy-800 hover:text-teal-600 transition-colors font-medium"
                      >
                        LinkedIn Profile ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume CTA */}
              <div id="resume" className="scroll-mt-32">
                {profile?.resume_url ? (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-navy w-full text-center justify-center flex items-center gap-2"
                  >
                    <span>Download Executive CV</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="btn-navy w-full text-center justify-center flex items-center gap-2 text-xs"
                  >
                    <span>Request Full Executive CV</span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* ── Right: Bio & Focus ── */}
            <div className="space-y-10 lg:col-span-7">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy-900 mb-5">
                  {headline}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-slate-600">
                  {paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              {profile?.keywords && profile.keywords.length > 0 && (
                <div className="border-t border-navy-900/08 pt-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                    Core Focus & Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.keywords.map((kw) => (
                      <span key={kw} className="badge-light">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="border-t border-navy-900/08 pt-8 flex flex-wrap gap-3">
                <Link href="/projects" className="btn-navy">
                  View Case Studies →
                </Link>
                <Link href="/experience" className="btn-ghost-light">
                  Career History
                </Link>
                <Link href="/contact" className="btn-ghost-light">
                  Get In Touch
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PM APPROACH — Dark Navy
      ══════════════════════════════════════════════════ */}
      <section className="section-dark py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12">
            <span className="section-label-dark mb-4 block w-fit">PM Philosophy</span>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              How I Build Products
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {pmApproach.map((item) => (
              <div key={item.title} className="card-dark p-6 space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/8 text-teal-400">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
