import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Skill } from '@/types/database.types';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Skills & Capabilities',
  description: 'Product management capabilities, technical fluency, and domain expertise.',
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
          SKILLS HEADER — Warm Cream Beige (#E8D2B5)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#E8D2B5] pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-[#A5A79B]/30">
        <div className="mx-auto max-w-5xl px-6">
          <span className="section-label mb-3 block w-fit">Competencies</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#292724] leading-tight">
            Strategic Domains & <span className="text-[#590907]">Skills</span>
          </h1>
          <p className="mt-4 text-lg text-[#292724]/75 max-w-2xl leading-relaxed">
            A comprehensive overview of product strategy, technical fluency, AI platform architecture, and operational frameworks.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SKILLS ORGANIZED BY CATEGORY — Muted Sage Grey (#A5A79B)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#A5A79B] py-20 text-[#292724]">
        <div className="mx-auto max-w-5xl px-6">
          {skills.length === 0 ? (
            <div className="card-sage p-14 text-center max-w-md mx-auto bg-white/70">
              <span className="text-3xl mb-3 block">🎯</span>
              <h3 className="font-bold text-base text-[#292724] mb-1">Skills Updating</h3>
              <p className="text-xs text-[#292724]/60">Manage your skills and categories via the admin dashboard.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {sortedCategories.map((category) => (
                <div key={category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#292724]/15">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#590907]" />
                      <h2 className="text-xl font-extrabold text-[#292724] tracking-tight">{category}</h2>
                    </div>
                    <span className="text-xs font-mono text-[#292724]/60 font-medium">
                      {grouped[category].length} {grouped[category].length === 1 ? 'skill' : 'skills'}
                    </span>
                  </div>

                  {/* Clean Category Cards */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {grouped[category].map((skill) => (
                      <div
                        key={skill.id}
                        className="card-sage p-4 bg-white/60 hover:bg-white/90 space-y-2.5 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-[#292724]">
                            {skill.name}
                          </span>
                          {skill.proficiency && (
                            <span className="text-[10px] font-bold tracking-wider uppercase text-[#590907]">
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
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
