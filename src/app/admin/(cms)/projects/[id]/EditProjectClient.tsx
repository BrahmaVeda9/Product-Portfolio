'use client';

import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import type { Project, ProjectWithCaseStudy } from '@/types/database.types';

interface EditProjectClientProps {
  project: ProjectWithCaseStudy;
  userId: string;
}

export default function EditProjectClient({ project, userId }: EditProjectClientProps) {
  const router = useRouter();

  const handleSaved = (_: Project) => {
    router.refresh();
  };

  return <ProjectForm project={project} userId={userId} onSaved={handleSaved} />;
}
