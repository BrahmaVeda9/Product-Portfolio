import Link from 'next/link';
import Image from 'next/image';
import { truncate, formatDate } from '@/lib/utils';
import type { Project } from '@/types/database.types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-light card-light-interactive group flex flex-col overflow-hidden shadow-card"
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-ivory-200">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ivory-200 to-ivory-300">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-navy-900/10 bg-white shadow-card">
                <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              </div>
              <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">Case Study</span>
            </div>
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute right-3 top-3">
            <span className="badge-gold text-[11px]">
              ★ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Category + Date */}
        <div className="mb-3 flex items-center justify-between text-xs">
          {project.category ? (
            <span className="badge-teal">{project.category}</span>
          ) : <div />}
          <span className="text-slate-400 font-mono text-[11px]">
            {formatDate(project.created_at, { year: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold tracking-tight text-navy-900 transition-colors group-hover:text-teal-600">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-slate-500 line-clamp-2 flex-1">
          {truncate(project.short_desc, 130)}
        </p>

        {/* Skills */}
        {project.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-md border border-navy-900/08 bg-ivory-100 px-2 py-0.5 text-[11px] text-slate-500">
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="rounded-md border border-navy-900/06 bg-ivory-100 px-2 py-0.5 text-[11px] text-slate-400">
                +{project.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Read more */}
        <div className="pt-4 border-t border-navy-900/06 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-teal-600 transition-colors">
          <span>Read Case Study</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
