import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Project } from '@/types/database.types';
import ProjectCard from '@/components/public/ProjectCard';
import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/public/PageHeader';
import Reveal from '@/components/public/Reveal';
import Tilt from '@/components/public/Tilt';

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
  searchParams: Promise<{ category?: string }>;
}) {
  const [projects, { category }] = await Promise.all([getProjects(), searchParams]);
  const activeCategory = category ?? 'All';

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio & retrospectives"
        title={
          <>
            Product <span className="italic text-champagne">case studies</span>
          </>
        }
        intro="In-depth strategic analyses covering problem framing, stakeholder alignment, architectural trade-offs, and shipped metrics."
      />

      <section className="pb-28 sm:pb-36">
        <div className="lux-container">
          {/* Category filter */}
          <nav aria-label="Filter by category" className="mb-14 flex flex-wrap gap-x-8 gap-y-4">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <a
                  key={cat}
                  href={cat === 'All' ? '/projects' : `/projects?category=${cat}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ${
                    isActive ? 'text-champagne-300' : 'text-taupe-400 hover:text-parchment-100'
                  }`}
                >
                  {cat}
                  <span className={`absolute bottom-0 left-0 h-px w-full origin-left bg-champagne-400 transition-transform duration-700 ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                </a>
              );
            })}
          </nav>

          {filtered.length === 0 ? (
            <div className="panel mx-auto max-w-xl p-14 text-center">
              <span className="font-display text-5xl italic text-champagne-300">—</span>
              <h3 className="font-display mt-6 text-3xl font-light text-parchment-100">No published studies</h3>
              <p className="mt-3 text-sm text-taupe-300">
                {activeCategory !== 'All'
                  ? `No published ${activeCategory} case studies found.`
                  : 'Case studies will appear here once published from the admin panel.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, i) => (
                <Reveal key={project.id} delay={(i % 3) * 120} className="h-full">
                  <Tilt className="h-full" max={4}>
                    <ProjectCard project={project} />
                  </Tilt>
                </Reveal>
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="mt-16 flex items-center justify-between border-t border-white/[0.08] pt-8 text-xs text-taupe-400">
              <span className="label">
                {filtered.length} {filtered.length === 1 ? 'case study' : 'case studies'}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              </span>
              <Link href="/" className="link-lux text-[0.7rem] uppercase tracking-[0.22em]">
                ← Back to overview
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
