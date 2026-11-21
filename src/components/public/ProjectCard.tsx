import Link from 'next/link';
import Image from 'next/image';
import { truncate, formatDate } from '@/lib/utils';
import type { Project } from '@/types/database.types';

interface ProjectCardProps {
  project: Project;
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="panel panel-hover group flex h-full flex-col overflow-hidden"
    >
      {/* Visual */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-ink-900">
        {project.thumbnail_url ? (
          <>
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-90 transition-all duration-[1400ms] ease-out group-hover:scale-[1.06] group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(70%_70%_at_50%_40%,rgba(201,169,110,0.14),transparent_70%)]">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: 'repeating-linear-gradient(135deg, #C9A96E 0 1px, transparent 1px 14px)' }}
            />
            <span className="relative font-display text-7xl font-light italic text-champagne-300/90 transition-transform duration-[1400ms] ease-out group-hover:scale-110">
              {initials(project.title)}
            </span>
          </div>
        )}

        {project.featured && (
          <span className="absolute left-5 top-5 chip chip-gold backdrop-blur-md">Featured</span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center justify-between gap-3 label">
          <span className="text-champagne-400">{project.category ?? 'Case study'}</span>
          <span>{formatDate(project.created_at, { year: 'numeric', month: 'short' })}</span>
        </div>

        <h3 className="font-display mt-5 text-[1.85rem] leading-[1.1] font-normal text-parchment-100 transition-colors duration-500 group-hover:text-champagne-200">
          {project.title}
        </h3>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-taupe-300 line-clamp-3">
          {truncate(project.short_desc, 150)}
        </p>

        {project.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="chip !py-1 !text-[0.66rem]">{skill}</span>
            ))}
            {project.skills.length > 3 && (
              <span className="chip !py-1 !text-[0.66rem] !text-taupe-500">+{project.skills.length - 3}</span>
            )}
          </div>
        )}

        <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-taupe-300 transition-colors duration-500 group-hover:text-champagne-300">
          <span>Read the case study</span>
          <span className="btn-arrow">→</span>
        </div>
      </div>
    </Link>
  );
}
