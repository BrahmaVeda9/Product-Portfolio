import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Skill } from '@/types/database.types';
import type { Metadata } from 'next';
import React from 'react';
import PageHeader from '@/components/public/PageHeader';
import Reveal from '@/components/public/Reveal';

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

const categoryOrder = ['Core PM', 'AI/ML', 'Technical', 'Leadership', 'Tools', 'Other'];

const proficiencyLabel = (p: number) => {
  if (p >= 5) return 'Mastery';
  if (p >= 4) return 'Advanced';
  if (p >= 3) return 'Proficient';
  return 'Familiar';
};

const proficiencyColor = (p: number) => {
  if (p >= 5) return 'text-champagne-200';
  if (p >= 4) return 'text-champagne-400';
  return 'text-taupe-400';
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
      <PageHeader
        eyebrow="Core competencies"
        title={
          <>
            Strategic domains &amp;{' '}
            <span className="italic text-champagne">product capabilities</span>
          </>
        }
        intro="A comprehensive overview of product management leadership, engineering fluency, and organizational operating frameworks."
      />

      <section className="pb-28 sm:pb-36">
        <div className="lux-container">
          {skills.length === 0 ? (
            <div className="panel mx-auto max-w-xl p-14 text-center">
              <span className="font-display text-5xl italic text-champagne-300">—</span>
              <h3 className="font-display mt-6 text-3xl font-light text-parchment-100">Competency catalogue in preparation</h3>
              <p className="mt-3 text-sm text-taupe-300">Skills and proficiencies can be managed via the admin dashboard.</p>
            </div>
          ) : (
            <div className="space-y-20">
              {sortedCategories.map((category) => (
                <Reveal key={category} className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <h2 className="font-display text-4xl sm:text-5xl font-light text-parchment-100">{category}</h2>
                    <span className="label mt-4 block">
                      {grouped[category].length} {grouped[category].length === 1 ? 'skill' : 'skills'}
                    </span>
                  </div>

                  <ul className="border-t border-white/[0.08] lg:col-span-8">
                    {grouped[category].map((skill) => (
                      <li key={skill.id} className="row-lux border-b border-white/[0.08] py-6 lg:px-4">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-base font-normal text-parchment-100">{skill.name}</span>
                          {skill.proficiency && (
                            <span className={`text-[0.66rem] font-semibold uppercase tracking-[0.22em] ${proficiencyColor(skill.proficiency)}`}>
                              {proficiencyLabel(skill.proficiency)}
                            </span>
                          )}
                        </div>
                        {skill.proficiency && (
                          <div className="meter mt-4" role="meter" aria-valuemin={0} aria-valuemax={5} aria-valuenow={skill.proficiency} aria-label={`${skill.name} proficiency`}>
                            <span style={{ width: `${(skill.proficiency / 5) * 100}%` }} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
