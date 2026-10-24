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
      className="exec-card-interactive group block overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-950/80 border-b border-white/[0.06]">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900/60 to-zinc-950/90">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              </div>
              <span className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">Executive Case Study</span>
            </div>
          </div>
        )}

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-transparent opacity-80" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute right-3.5 top-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Featured Study
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category + Date */}
        <div className="mb-3 flex items-center justify-between text-xs">
          {project.category ? (
            <span className="exec-badge text-[11px] font-medium text-slate-300">
              {project.category}
            </span>
          ) : <div />}
          <span className="text-zinc-500 font-mono text-[11px]">
            {formatDate(project.created_at, { year: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-indigo-200">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-5 text-sm leading-relaxed text-zinc-400 line-clamp-2">
          {truncate(project.short_desc, 130)}
        </p>

        {/* Skills */}
        {project.skills.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-400">
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] text-zinc-500">
                +{project.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Read more link */}
        <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
          <span>Read Executive Case Study</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
