import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Project } from '@/types/database.types';
import ProjectCard from '@/components/public/ProjectCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Case Studies',
  description: 'In-depth product management case studies across AI/GenAI, enterprise SaaS, and workflow automation.',
};

const CATEGORIES = ['All', 'AI/GenAI', 'SaaS', 'ERP', 'Automation', 'Other'];

async function getProjects(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true });
  return (data ?? []) as Project[];
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const projects = await getProjects();
  const activeCategory = searchParams.category ?? 'All';

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* ══════════════════════════════════════════════════
          PROJECTS HEADER — Warm Cream Beige (#E8D2B5)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#E8D2B5] pt-32 pb-16 sm:pt-40 sm:pb-20 border-b border-[#A5A79B]/30">
        <div className="mx-auto max-w-6xl px-6">
          <span className="section-label mb-3 block w-fit">Portfolio & Retrospectives</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#292724] leading-tight">
            Product <span className="text-[#590907]">Case Studies</span>
          </h1>
          <p className="mt-4 text-lg text-[#292724]/75 max-w-2xl leading-relaxed">
            In-depth strategic analyses covering problem framing, cross-functional execution, architectural trade-offs, and commercial impact.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROJECTS GRID — Warm Cream Beige (#E8D2B5)
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#E8D2B5] py-16">
        <div className="mx-auto max-w-6xl px-6">

          {/* Filter Pills */}
          <div className="mb-10 flex flex-wrap gap-2 pb-6 border-b border-[#A5A79B]/35">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={cat === 'All' ? '/projects' : `/projects?category=${cat}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#590907] text-[#E8D2B5] shadow-sm'
                      : 'border border-[#A5A79B]/50 bg-white/40 text-[#292724]/80 hover:border-[#590907]/40 hover:text-[#590907]'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="card-cream p-16 text-center max-w-md mx-auto">
              <div className="h-12 w-12 rounded-xl bg-[#590907]/10 flex items-center justify-center mx-auto mb-4 text-[#590907]">
                📂
              </div>
              <h3 className="font-bold text-base text-[#292724] mb-1">No Case Studies Found</h3>
              <p className="text-xs text-[#292724]/60">
                {activeCategory !== 'All'
                  ? `No case studies in category "${activeCategory}".`
                  : 'Case studies will appear once published from the admin panel.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, idx) => (
                <ProjectCard key={project.id} project={project} priority={idx === 0 && activeCategory === 'All'} />
              ))}
            </div>
          )}

          {/* Count Row */}
          {filtered.length > 0 && (
            <div className="mt-12 border-t border-[#A5A79B]/30 pt-6 flex justify-between items-center text-xs text-[#292724]/60 font-mono">
              <span>
                Showing {filtered.length} {filtered.length === 1 ? 'case study' : 'case studies'}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              </span>
              <Link href="/" className="hover:text-[#590907] transition-colors font-sans font-semibold">
                ← Back to Overview
              </Link>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
