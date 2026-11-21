import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database.types';
import Image from 'next/image';
import Link from 'next/link';
import FormattedText from '@/components/FormattedText';
import PageHeader from '@/components/public/PageHeader';
import Reveal from '@/components/public/Reveal';
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

  const monogram = profile?.full_name
    ? profile.full_name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'PM';

  return (
    <>
      <PageHeader
        eyebrow="Leadership profile"
        title={
          <>
            Product philosophy,{' '}
            <span className="italic text-champagne">vision &amp; stewardship</span>
          </>
        }
        intro="Delivering defensible market advantage by aligning organizational strategy with deep user empathy and technical precision."
      />

      {/* ═════════════ PROFILE ═════════════ */}
      <section className="pb-28 sm:pb-36">
        <div className="lux-container grid items-start gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Portrait & details */}
          <Reveal className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative mx-auto max-w-[24rem]">
              <div className="arch relative aspect-[4/5] w-full bg-ink-850 border border-white/[0.06]">
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
                    <span className="font-display text-[7rem] font-light italic leading-none text-champagne">{monogram}</span>
                    <span className="label mt-6">{profile?.full_name || 'Product Executive'}</span>
                  </div>
                )}
              </div>

              <dl className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07] text-sm">
                {profile?.location && (
                  <div className="flex items-center justify-between gap-6 py-4">
                    <dt className="label">Based in</dt>
                    <dd className="text-right text-parchment-200">{profile.location}</dd>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center justify-between gap-6 py-4">
                    <dt className="label">Email</dt>
                    <dd className="min-w-0 truncate text-right">
                      <a href={`mailto:${profile.email}`} className="link-lux">{profile.email}</a>
                    </dd>
                  </div>
                )}
                {profile?.linkedin_url && (
                  <div className="flex items-center justify-between gap-6 py-4">
                    <dt className="label">LinkedIn</dt>
                    <dd className="text-right">
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="link-lux">
                        View profile ↗
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              <div id="resume" className="mt-8 scroll-mt-32">
                {profile?.resume_url ? (
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="btn-lux w-full">
                    Download executive CV <span className="btn-arrow">↓</span>
                  </a>
                ) : (
                  <Link href="/contact" className="btn-lux-ghost w-full">
                    Request full executive CV <span className="btn-arrow">→</span>
                  </Link>
                )}
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">Biography</span>
              <h2 className="font-display mt-8 text-4xl sm:text-5xl font-light leading-[1.1] text-parchment-100">
                {headline}
              </h2>
              <div className="mt-10 space-y-6 text-[1.05rem] leading-[1.85] font-light text-taupe-300">
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className={`whitespace-pre-line ${i === 0 ? 'first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-champagne-300' : ''}`}
                  >
                    <FormattedText text={para} />
                  </p>
                ))}
              </div>
            </Reveal>

            {profile?.keywords && profile.keywords.length > 0 && (
              <Reveal className="mt-14 border-t border-white/[0.08] pt-10">
                <h3 className="label">Core focus &amp; competencies</h3>
                <div className="mt-6 flex flex-wrap gap-2">
                  {profile.keywords.map((kw) => (
                    <span key={kw} className="chip">{kw}</span>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal className="mt-14 flex flex-wrap gap-4 border-t border-white/[0.08] pt-10">
              <Link href="/projects" className="btn-lux">
                View case studies <span className="btn-arrow">→</span>
              </Link>
              <Link href="/experience" className="btn-lux-ghost">Career history</Link>
              <Link href="/contact" className="btn-lux-ghost">Get in touch</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═════════════ PHILOSOPHY ═════════════ */}
      <section className="relative border-t border-white/[0.06] py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_0%_0%,rgba(201,169,110,0.07),transparent_70%)]" />
        <div className="relative lux-container">
          <Reveal>
            <span className="eyebrow">PM philosophy</span>
            <h2 className="font-display mt-8 text-5xl sm:text-6xl font-light leading-[1.02] text-parchment-100">
              How I build <span className="italic text-champagne">products</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
            {pmApproach.map((item, i) => (
              <Reveal key={item.title} delay={i * 120} className="group bg-ink-950 p-9 sm:p-10 transition-colors duration-700 hover:bg-ink-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne-400/40 text-champagne-300 transition-colors duration-700 group-hover:border-champagne-300">
                  {item.icon}
                </div>
                <h3 className="font-display mt-10 text-[1.9rem] leading-tight font-normal text-parchment-100">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed font-light text-taupe-300">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
