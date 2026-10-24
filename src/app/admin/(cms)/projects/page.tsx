import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Project } from '@/types/database.types';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import ProjectActions from '@/components/admin/ProjectActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Manage Projects — Admin' };

async function getProjects(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('display_order', { ascending: true });
  return (data ?? []) as Project[];
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6 pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Projects</h1>
          <p className="mt-1 text-zinc-500">{projects.length} total · manage case studies here</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary text-sm">
          + New Project
        </Link>
      </div>

      {/* Projects table */}
      {projects.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="mb-4 text-5xl">🚀</div>
          <h3 className="mb-2 text-lg font-bold text-white">No projects yet</h3>
          <p className="mb-6 text-zinc-500">Create your first case study to get started.</p>
          <Link href="/admin/projects/new" className="btn-primary">
            Create First Project →
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-900/20 text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Project
                </th>
                <th className="hidden px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:table-cell">
                  Category
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Status
                </th>
                <th className="hidden px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">
                  Updated
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-900/10">
              {projects.map((project) => (
                <tr key={project.id} className="group transition-colors hover:bg-brand-900/10">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {project.featured && (
                        <span title="Featured" className="text-sm">⭐</span>
                      )}
                      <div>
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="font-medium text-white hover:text-brand-400 transition-colors"
                        >
                          {project.title}
                        </Link>
                        <p className="text-xs text-zinc-600">/projects/{project.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    {project.category ? (
                      <span className="badge text-xs">{project.category}</span>
                    ) : (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge text-xs ${
                        project.status === 'published' ? 'badge-green' : 'badge-amber'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-xs text-zinc-500 lg:table-cell">
                    {formatDate(project.updated_at, { year: 'numeric', month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions)}
                  </td>
                  <td className="px-5 py-4">
                    <ProjectActions project={project} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
