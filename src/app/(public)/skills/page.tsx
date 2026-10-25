import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Skill } from '@/types/database.types';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'My product management skills, tools, and areas of expertise.',
};

async function getSkills() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });
  return (data ?? []) as Skill[];
}

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; iconBg: string }> = {
  'Core PM': {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    color: 'text-navy-500',
    iconBg: 'bg-navy-100 border-navy-200',
  },
  'AI/ML': {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    color: 'text-gold-500',
    iconBg: 'bg-gold-100 border-gold-200',
  },
  'Technical': {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    color: 'text-teal-600',
    iconBg: 'bg-teal-50 border-teal-200',
  },
  'Leadership': {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197" />
      </svg>
    ),
    color: 'text-navy-600',
    iconBg: 'bg-navy-50 border-navy-200',
  },
  'Tools': {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.32l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.32 4.486c.091.683.02 1.385-.205 2.016" />
      </svg>
    ),
    color: 'text-teal-500',
    iconBg: 'bg-teal-50 border-teal-200',
  },
  'Other': {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0" />
      </svg>
    ),
    color: 'text-slate-500',
    iconBg: 'bg-slate-100 border-slate-200',
  },
};

const categoryOrder = ['Core PM', 'AI/ML', 'Technical', 'Leadership', 'Tools', 'Other'];

const proficiencyLabel = (p: number) => {
  if (p >= 5) return 'Mastery';
  if (p >= 4) return 'Advanced';
  if (p >= 3) return 'Proficient';
  return 'Familiar';
};

const proficiencyColor = (p: number) => {
  if (p >= 5) return 'text-gold-500 bg-gold-100 border-gold-200';
  if (p >= 4) return 'text-teal-600 bg-teal-50 border-teal-200';
  return 'text-slate-500 bg-slate-100 border-slate-200';
};

export default async function SkillsPage() {
  const skills = await getSkills();

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const sortedCategories = categoryOrder.filter((cat) => grouped[cat]?.length > 0);

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HEADER — Dark Navy
      ══════════════════════════════════════════════════ */}
      <section className="section-dark relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-navy-800/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6">
          <span className="section-label-dark mb-4 block w-fit">Core Competencies</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Strategic Domains &<br />
            <span className="text-gold-gradient">Product Capabilities</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            A comprehensive overview of product management leadership, engineering fluency, and organizational operating frameworks.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SKILLS GRID — Light Ivory
      ══════════════════════════════════════════════════ */}
      <section className="section-light py-20">
        <div className="mx-auto max-w-5xl px-6">
          {skills.length === 0 ? (
            <div className="card-light p-14 text-center max-w-lg mx-auto shadow-card">
              <div className="h-14 w-14 rounded-2xl border border-navy-900/08 bg-ivory-200 flex items-center justify-center mx-auto mb-5">
                <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">Competency Catalog In Preparation</h3>
              <p className="text-sm text-slate-500">Skills and proficiencies can be managed via the admin dashboard.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {sortedCategories.map((category) => {
                const cfg = categoryConfig[category] ?? categoryConfig['Other'];
                return (
                  <div key={category} className="space-y-5">
                    {/* Category header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-navy-900/08">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${cfg.iconBg} ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <h2 className="text-lg font-bold text-navy-900">{category}</h2>
                      <span className="text-xs font-mono text-slate-400 ml-auto">
                        {grouped[category].length} {grouped[category].length === 1 ? 'skill' : 'skills'}
                      </span>
                    </div>

                    {/* Skills grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {grouped[category].map((skill) => (
                        <div
                          key={skill.id}
                          className="card-light p-5 flex flex-col gap-3 hover:shadow-ivory-lg transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-sm text-navy-900 tracking-tight">
                              {skill.name}
                            </span>
                            {skill.proficiency && (
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${proficiencyColor(skill.proficiency)}`}>
                                {proficiencyLabel(skill.proficiency)}
                              </span>
                            )}
                          </div>

                          {skill.proficiency && (
                            <div className="skill-bar-track">
                              <div
                                className="skill-bar-fill"
                                style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
