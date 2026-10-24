import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProjectWithCaseStudy } from '@/types/database.types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, absoluteUrl } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<ProjectWithCaseStudy | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('projects')
    .select('*, case_studies(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data as ProjectWithCaseStudy | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.case_studies?.meta_title ?? project.title,
    description: project.case_studies?.meta_description ?? project.short_desc ?? undefined,
    openGraph: {
      title: project.case_studies?.meta_title ?? project.title,
      description: project.case_studies?.meta_description ?? project.short_desc ?? undefined,
      url: absoluteUrl(`/projects/${project.slug}`),
      images: project.case_studies?.og_image_url
        ? [{ url: project.case_studies.og_image_url }]
        : project.thumbnail_url
        ? [{ url: project.thumbnail_url }]
        : [],
    },
  };
}

function Section({
  number,
  title,
  content,
}: {
  number: string;
  title: string;
  content: string | null;
}) {
  if (!content) return null;
  return (
    <div className="exec-card p-7 sm:p-9 space-y-4">
      <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
        <span className="font-mono text-xs text-zinc-500">{number}</span>
        <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
      </div>
      <div className="space-y-4 text-base leading-relaxed text-zinc-300">
        {content.split('\n\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <div className="relative min-h-screen pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-zinc-300 truncate max-w-xs">{project.title}</span>
        </div>

        {/* Case Study Header & Dossier Meta */}
        <div className="mb-14 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            {project.category && (
              <span className="exec-badge text-xs font-medium text-slate-300">
                {project.category}
              </span>
            )}
            {project.featured && (
              <span className="exec-badge-emerald text-xs">
                Featured Case Study
              </span>
            )}
            <span className="text-xs font-mono text-zinc-500 ml-1">
              {formatDate(project.created_at, { year: 'numeric', month: 'long' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          {project.short_desc && (
            <p className="text-lg sm:text-xl leading-relaxed text-zinc-300 font-normal">
              {project.short_desc}
            </p>
          )}

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/[0.08] py-4 text-xs">
            <div className="flex items-center gap-6">
              {project.role && (
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider block text-[10px] font-mono">Role</span>
                  <span className="text-zinc-200 font-medium">{project.role}</span>
                </div>
              )}
              {project.category && (
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider block text-[10px] font-mono">Domain</span>
                  <span className="text-zinc-200 font-medium">{project.category}</span>
                </div>
              )}
            </div>

            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="exec-btn-primary text-xs py-2 px-3.5"
              >
                <span>Live Implementation ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Thumbnail */}
        {project.thumbnail_url && (
          <div className="relative mb-14 h-80 sm:h-96 w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950">
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Structured Case Study Sections */}
        <div className="space-y-6">
          <Section number="01" title="Problem Framing & Opportunity" content={project.problem} />
          <Section number="02" title="Product Strategy & Approach" content={project.approach} />
          <Section number="03" title="Trade-offs & Strategic Decisions" content={project.decisions} />
          <Section number="04" title="Solution & System Architecture" content={project.solution} />
          <Section number="05" title="Delivered Metrics & Outcomes" content={project.outcomes} />

          {/* Full Case Study Content */}
          {project.case_studies?.content && (
            <div className="exec-card p-7 sm:p-9 space-y-4">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
                <span className="font-mono text-xs text-zinc-500">06</span>
                <h2 className="text-lg font-bold tracking-tight text-white">In-Depth Retrospective</h2>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-zinc-300">
                {project.case_studies.content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills & Technologies Used */}
        {project.skills.length > 0 && (
          <div className="mt-12 border-t border-white/[0.08] pt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
              Technologies & Methodologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span key={skill} className="exec-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {project.gallery_urls && project.gallery_urls.length > 0 && (
          <div className="mt-14 border-t border-white/[0.08] pt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
              Product Artifacts & Interface Gallery
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.gallery_urls.map((url, i) => (
                <div key={i} className="relative h-56 overflow-hidden rounded-xl border border-white/[0.1] bg-zinc-950">
                  <Image
                    src={url}
                    alt={`${project.title} artifact ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back navigation */}
        <div className="mt-16 border-t border-white/[0.08] pt-8 flex items-center justify-between">
          <Link href="/projects" className="exec-btn-secondary text-xs">
            <span>← Return to Case Studies</span>
          </Link>
          <Link href="/contact" className="exec-btn-primary text-xs">
            <span>Discuss This Work →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
