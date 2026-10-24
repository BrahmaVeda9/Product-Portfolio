import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProjectWithCaseStudy } from '@/types/database.types';
import { notFound } from 'next/navigation';
import EditProjectClient from './EditProjectClient';
import type { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: 'Edit Project — Admin' };

async function getProject(id: string): Promise<ProjectWithCaseStudy | null> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('projects')
    .select('*, case_studies(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();
  return data as ProjectWithCaseStudy | null;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-3xl space-y-6 pt-16 lg:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/projects" className="text-sm text-zinc-500 hover:text-white transition-colors">
              ← Projects
            </Link>
          </div>
          <h1 className="text-3xl font-black text-white">Edit Project</h1>
          <p className="mt-1 text-zinc-500 font-mono text-sm">/projects/{project.slug}</p>
        </div>
        <span
          className={`badge mt-2 ${
            project.status === 'published' ? 'badge-green' : 'badge-amber'
          }`}
        >
          {project.status}
        </span>
      </div>

      <EditProjectClient project={project} userId={user!.id} />
    </div>
  );
}
