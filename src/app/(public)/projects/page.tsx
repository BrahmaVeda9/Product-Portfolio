import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Project } from '@/types/database.types';
import ProjectCard from '@/components/public/ProjectCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Case studies and portfolio projects in AI/GenAI, SaaS, ERP, and workflow automation.',
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
    <div className="relative min-h-screen pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 block mb-3">
            Portfolio & Retrospectives
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Product Case Studies
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            In-depth strategic analyses covering problem framing, stakeholder alignment, architectural trade-offs, and shipped metrics.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-12 flex flex-wrap gap-2 border-b border-white/[0.06] pb-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <a
                key={cat}
                href={cat === 'All' ? '/projects' : `/projects?category=${cat}`}
                className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                    : 'border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </a>
            );
          })}
        </div>

        {/* Projects grid */}
        {filtered.length === 0 ? (
          <div className="exec-card p-16 text-center max-w-lg mx-auto">
            <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No Published Studies</h3>
            <p className="text-xs text-zinc-400">
              {activeCategory !== 'All'
                ? `No published ${activeCategory} case studies found.`
                : 'Case studies will appear here once published from the admin panel.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Project count */}
        {filtered.length > 0 && (
          <div className="mt-14 border-t border-white/[0.06] pt-6 flex justify-between items-center text-xs text-zinc-500 font-mono">
            <span>
              DISPLAYING {filtered.length} {filtered.length === 1 ? 'RECORD' : 'RECORDS'}
              {activeCategory !== 'All' ? ` IN [${activeCategory.toUpperCase()}]` : ''}
            </span>
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              ← Executive Overview
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
