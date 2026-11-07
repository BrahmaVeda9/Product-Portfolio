import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database.types';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Product Philosophy',
  description: 'Background, values, and product management philosophy.',
};

async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
  return data as Profile | null;
}

const leadershipPillars = [
  {
    number: '01',
    title: 'Customer Discovery First',
    desc: 'Translating ambiguous user behaviors into sharp problem statements before aligning engineering resources.',
  },
  {
    number: '02',
    title: 'Technical Depth & Architecture',
    desc: 'Collaborating directly with engineering leads on data models, system boundaries, and scalable infrastructure.',
  },
  {
    number: '03',
    title: 'Cross-Functional Momentum',
    desc: 'Unblocking design, engineering, and sales with radical clarity, concise specs, and measurable outcomes.',
  },
  {
    number: '04',
    title: 'Compounding Business Impact',
    desc: 'Connecting shipped software directly to expansion ARR, customer retention, and operational margin improvements.',
  },
];

export default async function AboutPage() {
  const profile = await getProfile();

  const headline = profile?.headline || 'Senior Product Manager & Strategic Operator';
  const defaultSummary = [
    'Senior Product Leader specializing in bridging the gap between cutting-edge technical architecture (AI/GenAI, autonomous workflow systems) and commercial viability.',
    'Throughout my career, I have operated at the intersection of business strategy, customer discovery, and engineering execution. I cultivate high-performing cross-functional teams, implement data-informed roadmaps, and ship resilient products that deliver tangible business outcomes.',
    'Currently exploring strategic leadership roles, advisory engagements, and collaboration with visionary founders and leadership teams building the next generation of intelligent software.',
  ];

  const bioSource = profile?.about_approach || profile?.summary;
  const paragraphs = bioSource
    ? bioSource.split('\n\n').filter(Boolean)
    : defaultSummary;

  return (
    <>
      {/* ══════════════════════════════════════════════════
          ABOUT HEADER — Warm Cream Beige (#E8D2B5)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#E8D2B5] pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-[#A5A79B]/30">
        <div className="mx-auto max-w-5xl px-6">
          <span className="section-label mb-3 block w-fit">About Me</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#292724] leading-tight">
            Product Philosophy & <span className="text-[#590907]">Vision</span>
          </h1>
          <p className="mt-4 text-lg text-[#292724]/75 max-w-2xl leading-relaxed">
            Leading product teams to build scalable, resilient platforms with deep architectural grounding and measurable commercial impact.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT MAIN CONTENT — Muted Sage Grey (#A5A79B)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#A5A79B] py-20 text-[#292724]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-start">

            {/* Left: Portrait Card */}
            <div className="space-y-6 lg:col-span-5">
              <div className="card-sage p-4 shadow-md bg-white/70">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#E8D2B5]">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Product Manager'}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#590907] text-2xl font-black text-[#E8D2B5] shadow-md mb-3">
                        {profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : 'PM'}
                      </div>
                      <p className="text-base font-bold text-[#292724]">{profile?.full_name || 'Product Leader'}</p>
                      <p className="text-xs text-[#292724]/60">Product Executive</p>
                    </div>
                  )}
                </div>

                {/* Details Strip */}
                <div className="pt-4 space-y-2 text-xs font-semibold text-[#292724]/80">
                  {profile?.location && (
                    <div className="flex items-center justify-between py-1 border-b border-[#292724]/10">
                      <span className="text-[#292724]/50 uppercase tracking-wider text-[10px]">Location</span>
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center justify-between py-1 border-b border-[#292724]/10">
                      <span className="text-[#292724]/50 uppercase tracking-wider text-[10px]">Email</span>
                      <a href={`mailto:${profile.email}`} className="text-[#590907] hover:underline">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile?.linkedin_url && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#292724]/50 uppercase tracking-wider text-[10px]">LinkedIn</span>
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#590907] hover:underline">
                        Connect ↗
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
                    className="btn-burgundy w-full justify-center"
                  >
                    Download Resume PDF ↓
                  </a>
                ) : (
                  <Link href="/contact" className="btn-burgundy w-full justify-center">
                    Request Full CV →
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Narrative Bio */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292724] tracking-tight mb-4">
                  {headline}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-[#292724]/80">
                  {paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Pillars in Sage Background */}
              <div className="pt-4 border-t border-[#292724]/15">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#590907] mb-4">
                  Operating Principles
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {leadershipPillars.map((pillar) => (
                    <div key={pillar.number} className="card-sage p-4 bg-white/50 space-y-1">
                      <span className="font-mono text-xs font-bold text-[#590907]">{pillar.number}</span>
                      <h4 className="font-bold text-sm text-[#292724]">{pillar.title}</h4>
                      <p className="text-xs text-[#292724]/70 leading-relaxed">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3">
                <Link href="/projects" className="btn-burgundy">
                  View Case Studies →
                </Link>
                <Link href="/experience" className="btn-subtle">
                  Career History
                </Link>
                <Link href="/contact" className="btn-subtle">
                  Get In Touch
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
