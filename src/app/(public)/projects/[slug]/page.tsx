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
    <div className="card-light p-7 sm:p-9 space-y-4 shadow-[0_4px_24px_rgba(41,39,36,0.08)]">
      <div className="flex items-center gap-3 border-b border-[#292724]/07 pb-3 mb-2">
        <span className="font-mono text-xs text-[#590907] font-bold">{number}</span>
        <h2 className="text-lg font-bold tracking-tight text-[#292724]">{title}</h2>
      </div>
      <div className="space-y-4 text-base leading-relaxed text-[#292724]/65">
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
    <>
      {/* ══════════════════════════════════════════════════
          HEADER — Deep Burgundy
      ══════════════════════════════════════════════════ */}
      <section className="section-dark relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#7a0c0a]/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-xs font-mono text-[#E8D2B5]/40">
            <Link href="/" className="hover:text-[#E8D2B5] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-[#E8D2B5] transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-[#E8D2B5]/65 truncate max-w-xs">{project.title}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            {project.category && <span className="badge-dark">{project.category}</span>}
            {project.featured && <span className="badge-dark">★ Featured Case Study</span>}
            <span className="text-xs font-mono text-[#E8D2B5]/35">
              {formatDate(project.created_at, { year: 'numeric', month: 'long' })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#E8D2B5] leading-tight mb-4">
            {project.title}
          </h1>

          {project.short_desc && (
            <p className="text-lg sm:text-xl leading-relaxed text-[#E8D2B5]/65 font-normal max-w-2xl">
              {project.short_desc}
            </p>
          )}

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E8D2B5]/08 mt-8 pt-6 text-xs">
            <div className="flex items-center gap-8">
              {project.role && (
                <div>
                  <span className="text-[#E8D2B5]/35 uppercase tracking-wider block text-[10px] font-mono mb-0.5">Role</span>
                  <span className="text-[#E8D2B5]/85 font-medium">{project.role}</span>
                </div>
              )}
              {project.category && (
                <div>
                  <span className="text-[#E8D2B5]/35 uppercase tracking-wider block text-[10px] font-mono mb-0.5">Domain</span>
                  <span className="text-[#E8D2B5]/85 font-medium">{project.category}</span>
                </div>
              )}
            </div>

            {/* Action links */}
            <div className="flex flex-wrap gap-2.5">
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-dark text-xs py-2 px-4"
                >
                  Live Product ↗
                </a>
              )}
              {(project as any).prototype_url && (
                <a
                  href={(project as any).prototype_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-dark text-xs py-2 px-4"
                >
                  🧪 View Prototype ↗
                </a>
              )}
              {(project as any).case_study_pdf_url && (
                <a
                  href={(project as any).case_study_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cream text-xs py-2 px-4"
                >
                  📄 Download PDF ↓
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONTENT — Warm Cream Beige
      ══════════════════════════════════════════════════ */}
      <section className="section-light py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Hero Thumbnail */}
          {project.thumbnail_url && (
            <div className="relative mb-12 h-80 sm:h-96 w-full overflow-hidden rounded-2xl border border-[#292724]/08 bg-[#E8D2B5] shadow-[0_8px_32px_rgba(41,39,36,0.1)]">
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Case Study Sections */}
          <div className="space-y-5">
            <Section number="01" title="Problem Framing & Opportunity" content={project.problem} />
            <Section number="02" title="Product Strategy & Approach" content={project.approach} />
            <Section number="03" title="Trade-offs & Strategic Decisions" content={project.decisions} />
            <Section number="04" title="Solution & System Architecture" content={project.solution} />
            <Section number="05" title="Delivered Metrics & Outcomes" content={project.outcomes} />

            {/* Full narrative */}
            {project.case_studies?.content && (
              <div className="card-light p-7 sm:p-9 space-y-4 shadow-[0_4px_24px_rgba(41,39,36,0.08)]">
                <div className="flex items-center gap-3 border-b border-[#292724]/07 pb-3 mb-2">
                  <span className="font-mono text-xs text-[#590907] font-bold">06</span>
                  <h2 className="text-lg font-bold tracking-tight text-[#292724]">In-Depth Retrospective</h2>
                </div>
                <div className="space-y-4 text-base leading-relaxed text-[#292724]/65">
                  {project.case_studies.content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {project.skills.length > 0 && (
            <div className="mt-12 border-t border-[#292724]/07 pt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#292724]/40 mb-4">
                Technologies & Methodologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="badge-light">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <div className="mt-12 border-t border-[#292724]/07 pt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#292724]/40 mb-6">
                Product Artifacts & Interface Gallery
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.gallery_urls.map((url, i) => (
                  <div key={i} className="relative h-56 overflow-hidden rounded-xl border border-[#292724]/08 bg-[#E8D2B5] shadow-[0_4px_16px_rgba(41,39,36,0.08)]">
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
          <div className="mt-14 border-t border-[#292724]/07 pt-8 flex items-center justify-between">
            <Link href="/projects" className="btn-ghost-light">
              ← All Case Studies
            </Link>
            <Link href="/contact" className="btn-navy">
              Discuss This Work →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
