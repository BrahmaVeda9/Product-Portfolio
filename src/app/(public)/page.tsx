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

const defaultImpactStats = [
  { value: '8+', label: 'Years in Product' },
  { value: '15+', label: 'Products Shipped' },
  { value: '$40M+', label: 'ARR Influenced' },
  { value: '4', label: 'AI Agents Deployed' },
];

export default async function HomePage() {
  const { profile, featuredProjects } = await getHomeData();

  const displayName     = profile?.full_name || 'Senior Product Leader';
  const displayHeadline = profile?.headline || 'Senior Product Manager & Strategic Builder';
  const displaySummary  = profile?.summary
    || 'Driving product vision, technical architecture, and cross-functional execution to scale AI platforms, enterprise SaaS, and automated workflow systems.';

  const stats = (profile?.impact_stats && Array.isArray(profile.impact_stats) && profile.impact_stats.length > 0)
    ? profile.impact_stats
    : defaultImpactStats;

  // Curate 4 key core specialties (prevent excessive tag clutter)
  const coreSpecialties = ['AI & Agent Systems', 'B2B Enterprise SaaS', 'Product Strategy', 'Scalable Architecture'];

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO — Warm Cream Beige Background
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#E8D2B5] pt-32 pb-20 sm:pt-40 sm:pb-28 border-b border-[#A5A79B]/30">
        {/* Subtle Signature Architectural Grid Background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(#292724 1px, transparent 1px), linear-gradient(90deg, #292724 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
          {/* Subtle warm architectural watermark element */}
          <div className="absolute right-[-8%] top-[10%] h-[500px] w-[500px] rounded-full border-[1.5px] border-[#A5A79B]/25 pointer-events-none" />
          <div className="absolute right-[-4%] top-[16%] h-[380px] w-[380px] rounded-full border-[1.5px] border-[#590907]/10 pointer-events-none" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">

            {/* ── Left Content (Text & Hierarchy) ── */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Status Pill */}
              <div className="badge-available">
                <span className="h-2 w-2 rounded-full bg-[#590907] animate-pulse" />
                <span className="font-semibold text-xs tracking-wide">Available for Strategic Product Leadership</span>
              </div>

              {/* Name & Headline with Warm Charcoal & Burgundy Accents */}
              <div className="space-y-3">
                <p className="text-sm font-bold uppercase tracking-widest text-[#590907]">
                  {displayName}
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-[#292724] leading-[1.12]">
                  Building high-impact <span className="text-[#590907]">intelligent products</span> from conviction to scale.
                </h1>
                <p className="text-lg font-medium text-[#292724]/80">
                  {displayHeadline}
                </p>
              </div>

              {/* Summary */}
              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#292724]/75">
                {displaySummary}
              </p>

              {/* Curated 4-5 core specialties (eliminating tag clutter) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#292724]/50 mr-1">
                  Focus:
                </span>
                {coreSpecialties.map((spec) => (
                  <span key={spec} className="badge-cream font-medium text-xs">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Primary Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link href="/projects" className="btn-burgundy">
                  Explore Case Studies →
                </Link>
                <Link href="/contact" className="btn-outline-burgundy">
                  Start a Conversation
                </Link>
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-subtle"
                  >
                    Resume ↓
                  </a>
                )}
              </div>
            </div>

            {/* ── Right Profile Image (Elegantly Sized & Balanced) ── */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-64 sm:w-72">
                {/* Signature framing badge */}
                <div className="absolute -inset-2.5 rounded-3xl border border-[#590907]/20 bg-[#A5A79B]/20 -rotate-2" />
                <div className="relative overflow-hidden rounded-2xl border-2 border-[#590907]/25 bg-[#ffffff] shadow-lg">
                  {profile?.avatar_url ? (
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={profile.avatar_url}
                        alt={displayName}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center p-6 bg-gradient-to-b from-[#ffffff] to-[#E8D2B5]/40 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#590907] text-2xl font-black text-[#E8D2B5] shadow-md mb-3">
                        {displayName ? displayName.slice(0, 2).toUpperCase() : 'PM'}
                      </div>
                      <p className="text-sm font-bold text-[#292724]">{displayName}</p>
                      <p className="text-xs text-[#292724]/60 mt-0.5">Product Executive</p>
                    </div>
                  )}

                  {/* Clean micro-footer strip on portrait */}
                  <div className="border-t border-[#A5A79B]/30 bg-[#fbf7f0] px-4 py-2.5 flex items-center justify-between text-[11px] font-semibold text-[#292724]/75">
                    <span>{profile?.location || 'Global / Remote'}</span>
                    <span className="text-[#590907]">PM · Strategy</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Impact Metrics Bar (Warm Cream Card with Burgundy Numbers) */}
          <div className="mt-16 pt-8 border-t border-[#A5A79B]/35 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label || i} className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-black text-[#590907] tracking-tight">{stat.value}</p>
                <p className="text-xs font-semibold text-[#292724]/60 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT PREVIEW — Muted Sage Grey (#A5A79B)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#A5A79B] py-20 border-b border-[#292724]/10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="section-label-sage">Product Philosophy</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#292724] tracking-tight">
                Turning complex technology into clear market advantage.
              </h2>
              <p className="text-base text-[#292724]/80 leading-relaxed">
                Operating between engineering rigor, commercial viability, and intuitive user experiences.
              </p>
              <div className="pt-2">
                <Link href="/about" className="btn-burgundy text-xs">
                  Read Full Philosophy & Bio →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              <div className="card-sage p-6 space-y-2">
                <h3 className="font-bold text-[#590907] text-base">01. Discovery & Clarity</h3>
                <p className="text-xs sm:text-sm text-[#292724]/75 leading-relaxed">
                  Validating root pain points with qualitative stakeholder engagement before engineering investment.
                </p>
              </div>
              <div className="card-sage p-6 space-y-2">
                <h3 className="font-bold text-[#590907] text-base">02. Technical Architecture</h3>
                <p className="text-xs sm:text-sm text-[#292724]/75 leading-relaxed">
                  Working closely with engineering leads on data models, API boundaries, and LLM orchestration.
                </p>
              </div>
              <div className="card-sage p-6 space-y-2">
                <h3 className="font-bold text-[#590907] text-base">03. High-Velocity Shipping</h3>
                <p className="text-xs sm:text-sm text-[#292724]/75 leading-relaxed">
                  Shortening feedback cycles through production dogfooding and disciplined milestone tracking.
                </p>
              </div>
              <div className="card-sage p-6 space-y-2">
                <h3 className="font-bold text-[#590907] text-base">04. Measurable Outcomes</h3>
                <p className="text-xs sm:text-sm text-[#292724]/75 leading-relaxed">
                  Anchoring product milestones directly to revenue retention, margin expansion, and user efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED PROJECTS — Warm Cream Beige (#E8D2B5)
      ══════════════════════════════════════════════════ */}
      {featuredProjects.length > 0 && (
        <section className="bg-[#E8D2B5] py-24 border-b border-[#A5A79B]/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="section-label mb-3 block w-fit">Proven Impact</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#292724]">
                  Featured Case Studies
                </h2>
                <p className="mt-2 text-base text-[#292724]/70">
                  Comprehensive architectural deep dives, trade-offs, and commercial results.
                </p>
              </div>
              <Link href="/projects" className="btn-outline-burgundy text-xs self-start sm:self-auto">
                All Case Studies →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} priority={idx === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          CONTACT CALLOUT — Deep Burgundy Background (#590907)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#590907] py-20 text-[#E8D2B5]">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <span className="section-label-burgundy">Initiative & Collaboration</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E8D2B5]">
            Looking for a Senior Product Partner?
          </h2>
          <p className="mx-auto max-w-xl text-base text-[#E8D2B5]/80 leading-relaxed">
            Available for executive product management roles, AI system advisory, and high-stakes product turnarounds.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-cream-on-burgundy">
              Start a Conversation →
            </Link>
            <Link href="/experience" className="btn-ghost-on-burgundy">
              Review Track Record
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
