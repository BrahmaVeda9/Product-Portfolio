import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Experience, Profile } from '@/types/database.types';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Experience | Track Record',
  description: 'Career history and leadership track record in Product Management, AI, and SaaS.',
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
    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#590907] bg-[#590907]/08 border border-[#590907]/20 px-3 py-1 rounded-full">
      <span className="h-1.5 w-1.5 rounded-full bg-[#590907]" />
      {startStr} — {endStr}
    </span>
  );
}

export default async function ExperiencePage() {
  const { experience, profile } = await getData();

  return (
    <>
      {/* ══════════════════════════════════════════════════
          EXPERIENCE HEADER — Warm Cream Beige (#E8D2B5)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#E8D2B5] pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-[#A5A79B]/30">
        <div className="mx-auto max-w-4xl px-6">
          <span className="section-label mb-3 block w-fit">Track Record</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#292724] leading-tight">
            Leadership & <span className="text-[#590907]">Experience</span>
          </h1>
          <p className="mt-4 text-lg text-[#292724]/75 max-w-2xl leading-relaxed">
            {profile?.headline || 'Proven leadership delivering scalable products across AI, SaaS platforms, and enterprise systems.'}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TIMELINE SECTION — Warm Cream Beige (#E8D2B5)
      ══════════════════════════════════════════════════ */}
      <section id="experience" className="bg-[#E8D2B5] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12">
            <span className="section-label mb-2 block w-fit">Career Timeline</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292724] tracking-tight">
              Roles & Shipped Outcomes
            </h2>
            <p className="mt-1 text-sm text-[#292724]/70">
              Chronological track record driving discovery, execution, and compounding growth.
            </p>
          </div>

          {experience.length === 0 ? (
            <div className="card-cream p-12 text-center max-w-md mx-auto">
              <div className="h-12 w-12 rounded-xl bg-[#590907]/10 flex items-center justify-center mx-auto mb-4 text-[#590907]">
                💼
              </div>
              <h3 className="font-bold text-base text-[#292724] mb-1">Career History Updating</h3>
              <p className="text-xs text-[#292724]/60">Manage your experience roles via the admin dashboard.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-[#590907]/25 ml-4 sm:ml-6 pl-8 sm:pl-10 space-y-10">
              {experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[41px] sm:-left-[49px] top-6">
                    <div className="timeline-dot" />
                  </div>

                  {/* Card on Cream background */}
                  <div className="card-cream p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[#A5A79B]/30 mb-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-[#292724] tracking-tight">{exp.role}</h3>
                        <p className="text-sm font-bold text-[#590907] mt-0.5">{exp.company}</p>
                      </div>
                      <DateRange start={exp.start_date} end={exp.end_date} />
                    </div>

                    {exp.description && (
                      <p className="text-sm leading-relaxed text-[#292724]/80 mb-5">
                        {exp.description}
                      </p>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] uppercase font-bold tracking-wider text-[#590907] block">
                          Key Achievements & Outcomes
                        </span>
                        <ul className="space-y-2">
                          {exp.achievements.map((ach, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#292724]/80 leading-relaxed">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#590907] mt-2 flex-shrink-0" />
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer CTAs */}
          <div className="mt-16 pt-8 border-t border-[#A5A79B]/30 flex flex-wrap items-center justify-between gap-4">
            <Link href="/projects" className="btn-burgundy text-xs">
              View Shipped Case Studies →
            </Link>
            <Link href="/contact" className="btn-subtle text-xs">
              Inquire About Experience
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
