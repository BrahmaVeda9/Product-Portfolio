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
    <>
      {/* ══════════════════════════════════════════════════
          HEADER — Dark Navy
      ══════════════════════════════════════════════════ */}
      <section className="section-dark relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-navy-800/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-teal-900/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6">
          <span className="section-label-dark mb-4 block w-fit">Portfolio & Retrospectives</span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Product Case Studies
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            In-depth strategic analyses covering problem framing, stakeholder alignment, architectural trade-offs, and shipped metrics.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROJECTS GRID — Light Ivory
      ══════════════════════════════════════════════════ */}
      <section className="section-light py-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Category filter pills */}
          <div className="mb-10 flex flex-wrap gap-2 pb-8 border-b border-navy-900/07">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <a
                  key={cat}
                  href={cat === 'All' ? '/projects' : `/projects?category=${cat}`}
                  className={`filter-pill ${isActive ? 'active' : ''}`}
                >
                  {cat}
                </a>
              );
            })}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="card-light p-16 text-center max-w-lg mx-auto shadow-card">
              <div className="h-14 w-14 rounded-2xl border border-navy-900/08 bg-ivory-200 flex items-center justify-center mx-auto mb-5">
                <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">No Published Studies</h3>
              <p className="text-sm text-slate-500">
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

          {/* Count row */}
          {filtered.length > 0 && (
            <div className="mt-12 border-t border-navy-900/07 pt-6 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>
                {filtered.length} {filtered.length === 1 ? 'case study' : 'case studies'}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              </span>
              <Link href="/" className="hover:text-navy-800 transition-colors">
                ← Back to Overview
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
