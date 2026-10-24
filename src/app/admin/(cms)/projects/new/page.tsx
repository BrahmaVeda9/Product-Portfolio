'use client';

import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import type { Project } from '@/types/database.types';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const handleSaved = (project: Project) => {
    router.push(`/admin/projects/${project.id}`);
  };

  if (!userId) {
    return (
      <div className="flex h-64 items-center justify-center pt-16 lg:pt-0">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-16 lg:pt-0">
      <div>
        <h1 className="text-3xl font-black text-white">New Project</h1>
        <p className="mt-1 text-zinc-500">Create a new case study. Save as draft first, publish when ready.</p>
      </div>
      <ProjectForm userId={userId} onSaved={handleSaved} />
    </div>
  );
}
