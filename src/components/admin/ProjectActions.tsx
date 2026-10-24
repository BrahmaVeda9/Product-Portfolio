'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { Project } from '@/types/database.types';
import Link from 'next/link';

interface ProjectActionsProps {
  project: Project;
}

export default function ProjectActions({ project }: ProjectActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('projects')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', project.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(newStatus === 'published' ? 'Project published!' : 'Project moved to draft');
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    const { error } = await supabase.from('projects').delete().eq('id', project.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Project deleted');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/projects/${project.id}`}
        className="rounded-lg border border-brand-600/20 px-3 py-1.5 text-xs font-medium text-brand-400 transition-all hover:border-brand-500/40 hover:bg-brand-900/30"
      >
        Edit
      </Link>

      <button
        onClick={togglePublish}
        disabled={loading}
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
          project.status === 'published'
            ? 'border-amber-500/20 text-amber-400 hover:bg-amber-900/20'
            : 'border-green-500/20 text-green-400 hover:bg-green-900/20'
        }`}
      >
        {loading ? '…' : project.status === 'published' ? 'Unpublish' : 'Publish'}
      </button>

      {project.status === 'published' && (
        <a
          href={`/projects/${project.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/5"
        >
          Preview ↗
        </a>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-900/20 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
