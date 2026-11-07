import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile, Project } from '@/types/database.types';
import Link from 'next/link';
import Image from 'next/image';
import ProjectCard from '@/components/public/ProjectCard';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Home | PM Portfolio',
  description: 'Senior Product Manager specializing in AI/GenAI, SaaS, ERP, and workflow automation.',
  openGraph: {
    title: 'PM Portfolio',
    description: 'Senior Product Manager specializing in AI/GenAI, SaaS, ERP, and workflow automation.',
    url: absoluteUrl('/'),
    type: 'website',
  },
};

async function getHomeData() {
  const supabase = await createServerSupabaseClient();
  const [profileRes, projectsRes] = await Promise.all([
    supabase.from('profiles').select('*').limit(1).maybeSingle(),
    supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('display_order', { ascending: true })
      .limit(3),
  ]);
  return {
    profile:          profileRes.data as Profile | null,
    featuredProjects: (projectsRes.data ?? []) as Project[],
  };
}

const expertiseAreas = [
  {
    category: 'Intelligent Systems',
    title: 'AI & Generative Platforms',
    desc: 'Architecting LLM-driven applications, production agent workflows, and data feedback loops that solve high-value operational bottlenecks.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    color: 'text-gold-400',
    iconBg: 'bg-gold-400/10 border-gold-400/20',
  },
  {
    category: 'Product Strategy',
    title: 'Enterprise B2B SaaS',
    desc: 'Leading product discovery, market expansion, PLG, and cross-functional teams to deliver scalable enterprise software.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
    color: 'text-teal-400',
    iconBg: 'bg-teal-400/10 border-teal-400/20',
  },
  {
    category: 'Core Infrastructure',
    title: 'ERP & Systems Architecture',
    desc: 'Modernizing complex multi-stakeholder operational stacks, database integrity, financial workflows, and mission-critical business platforms.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    color: 'text-navy-300',
    iconBg: 'bg-navy-300/10 border-navy-300/20',
  },
  {
    category: 'Operational Scale',
    title: 'Workflow & Agent Automation',
    desc: 'Eliminating organizational friction and high-cost manual overhead through custom autonomous agents and resilient pipeline automation.',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    color: 'text-teal-300',
    iconBg: 'bg-teal-300/10 border-teal-300/20',
  },
];

const defaultImpactStats = [
  { value: '8+', label: 'Years in Product' },
  { value: '15+', label: 'Products Shipped' },
  { value: '$40M+', label: 'ARR Influenced' },
  { value: '4', label: 'AI Agents Deployed' },
];

export default async function HomePage() {
  const { profile, featuredProjects } = await getHomeData();

  const displayName    = profile?.full_name    || 'Product Executive & Strategic Leader';
  const displayHeadline = profile?.headline    || 'Senior Product Manager & Strategic Builder';
  const displaySummary  = profile?.summary
    || 'Driving product vision, technical architecture, and cross-functional execution to scale AI/GenAI platforms, enterprise SaaS, and automated workflow systems.';

  const stats = (profile?.impact_stats && Array.isArray(profile.impact_stats) && profile.impact_stats.length > 0)
    ? profile.impact_stats
    : defaultImpactStats;

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO — Deep Navy Dark Section
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden section-dark flex items-center">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-navy-800/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-teal-900/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-navy-800/25 blur-3xl" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 w-full">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">

            {/* ── Left: Narrative ── */}
            <div className="lg:col-span-7 space-y-7">
              {/* Available pill */}
              <div className="badge-available w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Open to Product Leadership Roles</span>
              </div>

              {/* Name & headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.08]">
                  {profile?.full_name ? (
                    <>
                      {profile.full_name}
                      <span className="block mt-2 text-2xl sm:text-3xl lg:text-[1.75rem] font-medium leading-snug">
                        <span className="text-gold-gradient">{displayHeadline}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      Executive Product<br />
                      <span className="text-gold-gradient">Leadership & Strategy</span>
                    </>
                  )}
                </h1>
              </div>

              {/* Summary */}
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-zinc-300 font-light">
                {displaySummary}
              </p>

              {/* Keyword tags */}
              {profile?.keywords && profile.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.keywords.map((kw) => (
                    <span key={kw} className="badge-dark">{kw}</span>
                  ))}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link href="/projects" className="btn-gold">
                  View Case Studies →
                </Link>
                <Link href="/contact" className="btn-ghost-dark">
                  Get in Touch
                </Link>
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-dark"
                  >
                    Download CV ↓
                  </a>
                )}
              </div>

              {/* Social links */}
              {(profile?.linkedin_url || profile?.github_url || profile?.email) && (
                <div className="flex items-center gap-5 pt-2 border-t border-white/[0.07] text-xs font-medium text-zinc-400">
                  {profile?.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 transition-colors hover:text-white"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile?.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 transition-colors hover:text-white"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-1.5 transition-colors hover:text-white"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      <span>{profile.email}</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ── Right: Profile Card ── */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                {/* Glow behind card */}
                <div className="absolute inset-4 bg-gold-400/8 rounded-3xl blur-2xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-navy-900/80 shadow-navy-lg backdrop-blur-sm">
                  {profile?.avatar_url ? (
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name ?? 'Product Manager Portrait'}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/5] w-full flex flex-col items-center justify-between p-8 bg-gradient-to-b from-navy-800 to-navy-950">
                      <div className="w-full flex justify-between items-center text-xs font-mono text-zinc-500">
                        <span>PORTFOLIO</span>
                        <span>v2</span>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-24 w-24 rounded-2xl border border-gold-400/20 bg-gold-400/8 flex items-center justify-center text-3xl font-black text-gold-300 shadow-inner">
                          {profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : 'PM'}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white tracking-tight">
                            {profile?.full_name || 'Product Executive'}
                          </p>
                          <p className="text-sm text-zinc-400 font-normal mt-0.5">Strategic Leadership</p>
                        </div>
                      </div>
                      <div className="w-full border-t border-white/[0.06] pt-4 text-center">
                        <span className="text-[11px] text-zinc-500 font-mono tracking-wider">
                          ENTERPRISE · AI/GENAI · SAAS
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer strip */}
                  <div className="border-t border-white/[0.07] bg-navy-950/90 p-5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">Focus</span>
                        <span className="font-medium text-zinc-200">AI Products & SaaS</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">Location</span>
                        <span className="font-medium text-zinc-200">{profile?.location || 'Global / Remote'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Impact Stats Row */}
          <div className="mt-16 pt-10 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label || i} className="text-center">
                <p className="text-3xl font-black text-gold-gradient">{stat.value}</p>
                <p className="text-xs text-zinc-400 mt-1 font-medium tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          EXPERTISE — Light Ivory Section
      ══════════════════════════════════════════════════ */}
      <section className="section-light py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <span className="section-label-light mb-4 block w-fit">Strategic Domains</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-navy-900">
              Core Leadership Competencies
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-500">
              Transforming complex technical capabilities into defensible products with compounding business outcomes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {expertiseAreas.map((area) => (
              <div
                key={area.title}
                className="card-light p-6 flex flex-col gap-4 hover:shadow-ivory-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${area.iconBg} ${area.color}`}>
                  {area.icon}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-1">
                    {area.category}
                  </span>
                  <h3 className="text-sm font-bold text-navy-900 mb-2 tracking-tight">
                    {area.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500">
                    {area.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED PROJECTS — Dark Navy Alt Section
      ══════════════════════════════════════════════════ */}
      {featuredProjects.length > 0 && (
        <section className="section-dark-alt py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="max-w-2xl">
                <span className="section-label-dark mb-4 block w-fit">Track Record</span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Featured Case Studies
                </h2>
                <p className="mt-2 text-base text-zinc-400">
                  Deep explorations of product decisions, architectural strategies, and delivered impact.
                </p>
              </div>
              <Link href="/projects" className="btn-ghost-dark text-xs self-start sm:self-auto whitespace-nowrap">
                View All Case Studies →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          CTA — Light Ivory Section
      ══════════════════════════════════════════════════ */}
      <section className="section-light py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-2xl border border-navy-900/10 bg-navy-950 px-8 py-14 sm:px-14 text-center shadow-navy-lg">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-teal-900/30 blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-2xl space-y-5">
              <span className="badge-gold">
                Open to New Opportunities
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Let's Build Something Meaningful
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                Exploring opportunities in executive product leadership, AI product strategy, strategic advisory,
                and board-level consulting with high-growth technology companies.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn-gold">
                  Start a Conversation →
                </Link>
                <Link href="/experience" className="btn-ghost-dark">
                  Review Career History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
