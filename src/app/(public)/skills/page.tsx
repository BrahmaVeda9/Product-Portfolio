import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Skill } from '@/types/database.types';
import type { Metadata } from 'next';

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

const categoryIcons: Record<string, React.ReactNode> = {
  'Core PM': (
    <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.143 2.143L15.75 6" />
    </svg>
  ),
  'AI/ML': (
    <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  'Technical': (
    <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  'Leadership': (
    <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  'Tools': (
    <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.32l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.32 4.486c.091.683.02 1.385-.205 2.016" />
    </svg>
  ),
  'Other': (
    <svg className="h-5 w-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" />
    </svg>
  ),
};

const categoryOrder = ['Core PM', 'AI/ML', 'Technical', 'Leadership', 'Tools', 'Other'];

export default async function SkillsPage() {
  const skills = await getSkills();

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const sortedCategories = categoryOrder.filter((cat) => grouped[cat]?.length > 0);

  return (
    <div className="relative min-h-screen pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 block mb-3">
            Core Competencies
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Strategic Domains & Product Capabilities
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            A comprehensive overview of product management leadership, engineering fluency, and organizational operating frameworks.
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="exec-card p-12 text-center max-w-xl mx-auto">
            <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Competency Catalog In Preparation</h3>
            <p className="text-xs text-zinc-400">
              Skills and proficiencies can be managed via the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {sortedCategories.map((category) => (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    {categoryIcons[category] ?? categoryIcons['Other']}
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{category}</h2>
                  <span className="text-xs font-mono text-zinc-500 ml-auto">
                    {grouped[category].length} {grouped[category].length === 1 ? 'capability' : 'capabilities'}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[category].map((skill) => (
                    <div
                      key={skill.id}
                      className="exec-card p-5 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-sm text-white tracking-tight">
                          {skill.name}
                        </span>
                        {skill.proficiency && (
                          <span className="text-[11px] font-mono text-zinc-400">
                            {skill.proficiency >= 5
                              ? 'Mastery'
                              : skill.proficiency >= 4
                              ? 'Advanced'
                              : 'Proficient'}
                          </span>
                        )}
                      </div>

                      {skill.proficiency && (
                        <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-white/80 h-full rounded-full transition-all duration-500"
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
    </div>
  );
}
