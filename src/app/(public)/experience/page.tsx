import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Experience, Profile } from '@/types/database.types';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';

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
    <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
      <span className="h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0" />
      {startStr} — {endStr}
    </span>
  );
}

export default async function ExperiencePage() {
  const { experience, profile } = await getData();

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HEADER — Dark Navy
      ══════════════════════════════════════════════════ */}
      <section className="section-dark relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-navy-800/50 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-teal-900/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6">
          <span className="section-label-dark mb-4 block w-fit">Track Record & Leadership</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Leadership Experience<br />
            <span className="text-gold-gradient">& Proven Impact</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            {profile?.headline ?? 'Proven leadership delivering high-impact products across AI, SaaS platforms, and enterprise systems.'}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TIMELINE — Light Ivory
      ══════════════════════════════════════════════════ */}
      <section id="experience" className="section-light py-20 scroll-mt-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12">
            <span className="section-label-light mb-3 block w-fit">Career History</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy-900">
              Professional Experience & Shipped Outcomes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Chronological leadership record driving product discovery, cross-functional delivery, and commercial growth.
            </p>
          </div>

          {experience.length === 0 ? (
            <div className="card-light p-14 text-center max-w-lg mx-auto shadow-card">
              <div className="h-14 w-14 rounded-2xl border border-navy-900/08 bg-ivory-200 flex items-center justify-center mx-auto mb-5">
                <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">Career History In Preparation</h3>
              <p className="text-sm text-slate-500">Professional history can be managed via the admin dashboard.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-navy-900/10 ml-4 sm:ml-6 pl-8 sm:pl-10 space-y-10">
              {experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[41px] sm:-left-[49px] top-5">
                    <div className="timeline-dot" />
                  </div>

                  {/* Card */}
                  <div className="card-light p-7 sm:p-8 shadow-card hover:shadow-ivory-lg transition-all duration-300">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-5 border-b border-navy-900/07 mb-5">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-navy-900">{exp.role}</h3>
                        <p className="text-sm font-semibold text-teal-600 mt-1">{exp.company}</p>
                      </div>
                      <DateRange start={exp.start_date} end={exp.end_date} />
                    </div>

                    {exp.description && (
                      <p className="text-sm leading-relaxed text-slate-600 mb-5">
                        {exp.description}
                      </p>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 block mb-3">
                          Strategic Outcomes & Delivered Impact
                        </span>
                        <ul className="space-y-2.5">
                          {exp.achievements.map((ach, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
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

          {/* Bottom navigation CTA */}
          <div className="mt-16 pt-8 border-t border-navy-900/08 flex flex-wrap items-center justify-between gap-4">
            <Link href="/projects" className="btn-navy text-xs">
              Explore Shipped Case Studies →
            </Link>
            <Link href="/contact" className="btn-ghost-light text-xs">
              Inquire About Experience
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
