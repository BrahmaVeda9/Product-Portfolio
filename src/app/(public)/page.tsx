import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile, Project } from '@/types/database.types';
import Link from 'next/link';
import Image from 'next/image';
import ProjectCard from '@/components/public/ProjectCard';
import HeroSceneLoader from '@/components/three/HeroSceneLoader';
import Tilt from '@/components/public/Tilt';
import Reveal from '@/components/public/Reveal';
import CountUp from '@/components/public/CountUp';
import Marquee from '@/components/public/Marquee';
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
  },
  {
    category: 'Product Strategy',
    title: 'Enterprise B2B SaaS',
    desc: 'Leading product discovery, market expansion, PLG, and cross-functional teams to deliver scalable enterprise software.',
  },
  {
    category: 'Core Infrastructure',
    title: 'ERP & Systems Architecture',
    desc: 'Modernizing complex multi-stakeholder operational stacks, database integrity, financial workflows, and mission-critical business platforms.',
  },
  {
    category: 'Operational Scale',
    title: 'Workflow & Agent Automation',
    desc: 'Eliminating organizational friction and high-cost manual overhead through custom autonomous agents and resilient pipeline automation.',
  },
];

const defaultImpactStats = [
  { value: '8+', label: 'Years in Product' },
  { value: '15+', label: 'Products Shipped' },
  { value: '$40M+', label: 'ARR Influenced' },
  { value: '4', label: 'AI Agents Deployed' },
];

const defaultFocus = ['AI & GenAI Platforms', 'Enterprise SaaS', 'ERP Modernisation', 'Agentic Automation', 'Product Strategy', 'Zero-to-One'];

const LinkedInIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

export default async function HomePage() {
  const { profile, featuredProjects } = await getHomeData();

  const displayHeadline = profile?.headline || 'Senior Product Manager & Strategic Builder';
  const displaySummary =
    profile?.home_tagline ||
    profile?.summary ||
    'Driving product vision, technical architecture, and cross-functional execution to scale AI/GenAI platforms, enterprise SaaS, and automated workflow systems.';

  const stats =
    profile?.impact_stats && Array.isArray(profile.impact_stats) && profile.impact_stats.length > 0
      ? profile.impact_stats
      : defaultImpactStats;

  // Hero shows the tagline (or summary); the introduction shows the summary only when it isn't already in the hero.
  const introText =
    profile?.home_tagline && profile?.summary
      ? profile.summary
      : 'I operate at the intersection of business strategy, customer discovery and engineering execution — aligning teams around clear bets and shipping products that move the numbers that matter.';

  const focus = profile?.keywords && profile.keywords.length > 0 ? profile.keywords : defaultFocus;
  const monogram = profile?.full_name
    ? profile.full_name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'PM';

  return (
    <>
      {/* ═════════════════════════ HERO ═════════════════════════ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden hero-atmos">
        {/* 3D centrepiece: its own band above the text on mobile, beside it on desktop */}
        <div className="absolute inset-x-0 top-0 h-[58svh] sm:h-[62svh] lg:inset-0 lg:h-auto">
          <HeroSceneLoader />
        </div>
        <div className="pointer-events-none absolute inset-0 hero-vignette" />

        <div className="relative lux-container flex flex-1 flex-col justify-end pt-[50svh] pb-10 sm:pt-[56svh] lg:justify-center lg:pt-40 lg:pb-0">
          <div className="max-w-[46rem]">
            <div className="rise flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-champagne-300">
              <span className="status-dot" />
              Open to product leadership roles
            </div>

            <h1 className="rise rise-1 font-display mt-8 text-[3.3rem] leading-[0.98] sm:text-[5rem] lg:text-[6.4rem] font-light text-parchment-100">
              {profile?.full_name ? (
                <>
                  {profile.full_name}
                  <span className="mt-4 block text-[1.6rem] sm:text-[2.2rem] lg:text-[2.6rem] leading-[1.15] italic font-light text-champagne">
                    {displayHeadline}
                  </span>
                </>
              ) : (
                <>
                  Executive Product
                  <span className="block italic text-champagne">Leadership &amp; Strategy</span>
                </>
              )}
            </h1>

            <p className="rise rise-2 mt-8 max-w-xl text-base sm:text-lg leading-relaxed font-light text-taupe-300">
              {displaySummary}
            </p>

            <div className="rise rise-3 mt-11 flex flex-wrap items-center gap-4">
              <Link href="/projects" className="btn-lux">
                View case studies <span className="btn-arrow">→</span>
              </Link>
              <Link href="/contact" className="btn-lux-ghost">
                Get in touch
              </Link>
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="link-lux ml-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
                  Download CV ↓
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hero footer strip */}
        <div className="relative lux-container rise rise-5 pb-8 lg:pb-10">
          <div className="hairline mb-6" />
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 text-xs text-taupe-400">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              <div>
                <span className="label block">Based in</span>
                <span className="mt-1.5 block text-parchment-200">{profile?.location || 'Global / Remote'}</span>
              </div>
              <div>
                <span className="label block">Focus</span>
                <span className="mt-1.5 block text-parchment-200">AI Products &amp; SaaS</span>
              </div>
              {(profile?.linkedin_url || profile?.github_url || profile?.email) && (
                <div className="flex items-center gap-5 text-taupe-300">
                  {profile?.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-champagne-300" aria-label="LinkedIn">
                      <LinkedInIcon />
                    </a>
                  )}
                  {profile?.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-champagne-300" aria-label="GitHub">
                      <GitHubIcon />
                    </a>
                  )}
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="link-lux text-xs">
                      {profile.email}
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <span className="label">Scroll</span>
              <span className="relative block h-10 w-px overflow-hidden bg-white/10">
                <span className="scroll-cue absolute inset-0 bg-champagne-400" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════ FOCUS RIBBON ═════════════════════════ */}
      <Marquee items={focus} />

      {/* ═════════════════════════ INTRODUCTION ═════════════════════════ */}
      <section className="relative py-28 sm:py-36">
        <div className="lux-container grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Portrait */}
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-[24rem]">
              <div className="absolute -inset-5 arch border border-champagne-400/20" />
              <div className="arch relative aspect-[4/5] w-full bg-ink-850">
                {profile?.avatar_url ? (
                  <>
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name ?? 'Product Manager Portrait'}
                      fill
                      sizes="(min-width: 1024px) 24rem, 80vw"
                      className="object-cover grayscale-[25%] contrast-[1.05]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(80%_60%_at_50%_35%,rgba(201,169,110,0.18),transparent_70%)]">
                    <span className="font-display text-[7.5rem] font-light italic leading-none text-champagne">{monogram}</span>
                    <span className="label mt-6">{profile?.full_name || 'Product Executive'}</span>
                  </div>
                )}
              </div>
              <div className="panel absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 px-6 py-4 text-center">
                <span className="label block">Currently</span>
                <span className="mt-1.5 block font-display text-lg italic text-parchment-100">Strategic product leadership</span>
              </div>
            </div>
          </Reveal>

          {/* Statement */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">Introduction</span>
              <p className="font-display mt-8 text-[2.1rem] sm:text-[2.8rem] leading-[1.15] font-light text-parchment-100">
                Turning complex technical capability into{' '}
                <span className="italic text-champagne">defensible products</span> with compounding business outcomes.
              </p>
              <p className="mt-8 max-w-2xl text-base leading-relaxed font-light text-taupe-300">
                {introText}
              </p>
              <Link href="/about" className="link-lux mt-8 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em]">
                More about my approach <span className="btn-arrow">→</span>
              </Link>
            </Reveal>

            {/* Impact figures */}
            <div className="mt-16 grid grid-cols-2 gap-y-2 border-t border-white/[0.08] pt-2 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal
                  key={stat.label || i}
                  delay={i * 120}
                  className="border-l border-white/[0.08] py-7 pl-5 pr-3"
                >
                  <CountUp value={stat.value} className="font-display block text-[2.6rem] xl:text-[3.1rem] leading-none font-light text-champagne whitespace-nowrap" />
                  <span className="label mt-4 block !tracking-[0.18em]">{stat.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════ PRACTICE AREAS ═════════════════════════ */}
      <section className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_100%_50%,rgba(201,169,110,0.06),transparent_70%)]" />
        <div className="relative lux-container">
          <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Strategic domains</span>
              <h2 className="font-display mt-8 text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.02] text-parchment-100">
                Core leadership<br />
                <span className="italic text-champagne">competencies</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-taupe-300">
              Four domains where strategy, architecture and execution meet — and where I&apos;ve delivered measurable outcomes.
            </p>
          </Reveal>

          <ul className="mt-20 border-b border-white/[0.08]">
            {expertiseAreas.map((area, i) => (
              <Reveal as="li" key={area.title} delay={i * 80} className="row-lux border-t border-white/[0.08]">
                <div className="grid gap-4 py-10 sm:py-12 lg:grid-cols-12 lg:items-baseline lg:gap-10 lg:px-4">
                  <span className="label !text-champagne-400 lg:col-span-3">{area.category}</span>
                  <h3 className="font-display text-3xl sm:text-[2.6rem] leading-[1.1] font-light text-parchment-100 lg:col-span-4">
                    {area.title}
                  </h3>
                  <p className="text-sm sm:text-[0.95rem] leading-relaxed font-light text-taupe-300 lg:col-span-5">
                    {area.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════════════════════════ SELECTED WORK ═════════════════════════ */}
      {featuredProjects.length > 0 && (
        <section className="relative py-24 sm:py-32">
          <div className="lux-container">
            <Reveal className="mb-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="eyebrow">Track record</span>
                <h2 className="font-display mt-8 text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.02] text-parchment-100">
                  Selected <span className="italic text-champagne">case studies</span>
                </h2>
              </div>
              <Link href="/projects" className="btn-lux-ghost self-start sm:self-auto">
                View all <span className="btn-arrow">→</span>
              </Link>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.id} delay={i * 120} className="h-full">
                  <Tilt className="h-full" max={4}>
                    <ProjectCard project={project} />
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═════════════════════════ CLOSING ═════════════════════════ */}
      <section className="relative overflow-hidden py-28 sm:py-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_70%_at_50%_50%,rgba(201,169,110,0.12),transparent_70%)]" />
        <Reveal className="relative lux-container text-center">
          <div className="hairline-gold mx-auto mb-14 w-40" />
          <span className="label">Open to new opportunities</span>
          <h2 className="font-display mx-auto mt-8 max-w-4xl text-5xl sm:text-7xl lg:text-[5.5rem] font-light leading-[1.02] text-parchment-100">
            Let&apos;s build something <span className="italic text-champagne">meaningful.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed font-light text-taupe-300">
            Exploring opportunities in executive product leadership, AI product strategy, strategic advisory,
            and board-level consulting with high-growth technology companies.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-lux">
              Start a conversation <span className="btn-arrow">→</span>
            </Link>
            <Link href="/experience" className="btn-lux-ghost">
              Review career history
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
