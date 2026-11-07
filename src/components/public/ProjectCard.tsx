import Link from 'next/link';
import Image from 'next/image';
import { truncate, formatDate } from '@/lib/utils';
import type { Project } from '@/types/database.types';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`card-cream group flex flex-col overflow-hidden transition-all duration-300 ${
        priority ? 'ring-2 ring-[#590907]/20 shadow-lg' : ''
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative h-52 w-full overflow-hidden bg-[#A5A79B]/20 border-b border-[#A5A79B]/30">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#fbf7f0] to-[#E8D2B5]">
            <div className="flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#590907] text-[#E8D2B5] font-bold text-sm shadow-sm">
                PM
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#292724]/50 uppercase">Case Study</span>
            </div>
          </div>
        )}

        {/* Featured Ribbon */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="badge-burgundy bg-[#ffffff]/90 text-[11px] shadow-sm backdrop-blur-sm">
              ★ Featured Case Study
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-6 space-y-3">
        {/* Domain & Date */}
        <div className="flex items-center justify-between text-xs">
          {project.category ? (
            <span className="badge-burgundy">{project.category}</span>
          ) : <div />}
          <span className="text-[#292724]/50 font-mono text-[11px]">
            {formatDate(project.created_at, { year: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold tracking-tight text-[#292724] group-hover:text-[#590907] transition-colors leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-[#292724]/75 line-clamp-2 flex-1">
          {truncate(project.short_desc, 130)}
        </p>

        {/* Competencies Pills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-md border border-[#A5A79B]/35 bg-[#A5A79B]/15 px-2 py-0.5 text-[11px] font-semibold text-[#292724]/75">
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="rounded-md border border-[#A5A79B]/25 bg-transparent px-1.5 py-0.5 text-[10px] font-medium text-[#292724]/50">
                +{project.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bottom Read Action */}
        <div className="pt-3 border-t border-[#A5A79B]/20 flex items-center justify-between text-xs font-bold text-[#590907]">
          <span>View Retrospective</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1 font-mono">→</span>
        </div>
      </div>
    </Link>
  );
}
