import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Experience, Profile } from '@/types/database.types';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'My professional experience and career history in product management.',
};

async function getData() {
  const supabase = await createServerSupabaseClient();
  const [expRes, profileRes] = await Promise.all([
    supabase
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true }),
    supabase.from('profiles').select('*').limit(1).maybeSingle(),
  ]);
  return {
    experience: (expRes.data ?? []) as Experience[],
    profile: profileRes.data as Profile | null,
  };
}

function DateRange({ start, end }: { start: string; end: string | null }) {
  const startStr = formatDate(start, { year: 'numeric', month: 'short' });
  const endStr = end ? formatDate(end, { year: 'numeric', month: 'short' }) : 'Present';
  return (
    <span className="font-mono text-xs tracking-wider uppercase text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
      {startStr} — {endStr}
    </span>
  );
}

export default async function ExperiencePage() {
  const { experience, profile } = await getData();

  return (
    <div className="relative min-h-screen pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 block mb-3">
            Track Record & Career History
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Leadership Experience & Impact
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            {profile?.headline ?? 'Proven leadership delivering high-impact products across AI, SaaS platforms, and enterprise systems.'}
          </p>
        </div>

        {experience.length === 0 ? (
          <div className="exec-card p-12 text-center max-w-xl mx-auto">
            <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Career History In Preparation</h3>
            <p className="text-xs text-zinc-400">
              Professional history can be managed via the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="relative border-l border-white/[0.08] ml-4 sm:ml-6 pl-8 sm:pl-10 space-y-12">
            {experience.map((exp) => (
              <div key={exp.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[41px] sm:-left-[49px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-[#090a0f]">
                  <div className="h-2 w-2 rounded-full bg-zinc-300 transition-all group-hover:scale-125 group-hover:bg-white" />
                </div>

                {/* Card Container */}
                <div className="exec-card p-7 sm:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/[0.06] pb-4">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white">{exp.role}</h2>
                      <p className="text-sm font-semibold text-zinc-300 mt-0.5">{exp.company}</p>
                    </div>
                    <div>
                      <DateRange start={exp.start_date} end={exp.end_date} />
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {exp.description}
                    </p>
                  )}

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-3">
                        Strategic Outcomes & Delivered Impact
                      </span>
                      <ul className="space-y-2.5">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 mt-2 flex-shrink-0" />
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
      </div>
    </div>
  );
}
