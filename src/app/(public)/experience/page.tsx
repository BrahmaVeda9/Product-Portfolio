import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Experience, Profile } from '@/types/database.types';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/public/PageHeader';
import Reveal from '@/components/public/Reveal';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Professional career history and leadership track record in Product Management, AI, and SaaS.',
};

async function getData() {
  const supabase = await createServerSupabaseClient();
  const [expRes, profileRes] = await Promise.all([
    supabase.from('experience').select('*').order('display_order', { ascending: true }),
    supabase.from('profiles').select('*').limit(1).maybeSingle(),
  ]);
  return {
    experience: (expRes.data ?? []) as Experience[],
    profile: profileRes.data as Profile | null,
  };
}

function DateRange({ start, end }: { start: string; end: string | null }) {
  const startStr = formatDate(start, { year: 'numeric', month: 'short' });
  const endStr   = end ? formatDate(end, { year: 'numeric', month: 'short' }) : 'Present';
  return (
    <span className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-champagne-300">
      {startStr} <span className="text-taupe-500">—</span> {endStr}
    </span>
  );
}

export default async function ExperiencePage() {
  const { experience, profile } = await getData();

  return (
    <>
      <PageHeader
        eyebrow="Track record & leadership"
        title={
          <>
            Leadership experience{' '}
            <span className="italic text-champagne">&amp; proven impact</span>
          </>
        }
        intro={profile?.headline ?? 'Proven leadership delivering high-impact products across AI, SaaS platforms, and enterprise systems.'}
      />

      <section id="experience" className="scroll-mt-24 pb-28 sm:pb-36">
        <div className="lux-container">
          <Reveal className="mb-16 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="eyebrow">Career history</span>
            </div>
            <p className="font-display text-3xl sm:text-4xl font-light leading-[1.2] text-parchment-100 lg:col-span-7">
              Professional experience &amp; shipped outcomes —{' '}
              <span className="italic text-taupe-300">driving discovery, cross-functional delivery and commercial growth.</span>
            </p>
          </Reveal>

          {experience.length === 0 ? (
            <div className="panel mx-auto max-w-xl p-14 text-center">
              <span className="font-display text-5xl italic text-champagne-300">—</span>
              <h3 className="font-display mt-6 text-3xl font-light text-parchment-100">Career history in preparation</h3>
              <p className="mt-3 text-sm text-taupe-300">Professional history can be managed via the admin dashboard.</p>
            </div>
          ) : (
            <ol className="border-t border-white/[0.08]">
              {experience.map((exp, i) => (
                <Reveal as="li" key={exp.id} delay={i * 60} className="row-lux border-b border-white/[0.08]">
                  <div className="grid gap-8 py-12 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:px-4">
                    {/* Meta column */}
                    <div className="lg:col-span-4">
                      <DateRange start={exp.start_date} end={exp.end_date} />
                      <p className="font-display mt-4 text-2xl italic font-light text-champagne-200">{exp.company}</p>
                    </div>

                    {/* Body */}
                    <div className="lg:col-span-8">
                      <h3 className="font-display text-3xl sm:text-[2.6rem] leading-[1.1] font-light text-parchment-100">
                        {exp.role}
                      </h3>

                      {exp.description && (
                        <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed font-light text-taupe-300">
                          {exp.description}
                        </p>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-8">
                          <span className="label">Strategic outcomes &amp; delivered impact</span>
                          <ul className="mt-5 space-y-3.5">
                            {exp.achievements.map((ach, j) => (
                              <li key={j} className="flex items-start gap-4 text-[0.95rem] leading-relaxed font-light text-parchment-200">
                                <span className="mt-[0.6rem] h-[5px] w-[5px] flex-shrink-0 rotate-45 bg-champagne-400" />
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          )}

          <div className="mt-20 flex flex-wrap items-center justify-between gap-4">
            <Link href="/projects" className="btn-lux">
              Explore shipped case studies <span className="btn-arrow">→</span>
            </Link>
            <Link href="/contact" className="btn-lux-ghost">
              Inquire about experience
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
