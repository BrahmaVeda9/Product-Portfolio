import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProjectWithCaseStudy } from '@/types/database.types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, absoluteUrl } from '@/lib/utils';
import FormattedText from '@/components/FormattedText';
import Reveal from '@/components/public/Reveal';
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
  content: string | null | undefined;
}) {
  if (!content || !content.trim()) return null;
  return (
    <Reveal as="section" className="grid gap-6 border-t border-white/[0.08] py-14 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <span className="font-display block text-5xl italic font-light text-champagne-400/80">{number}</span>
        <h2 className="font-display mt-3 text-3xl font-light text-parchment-100">{title}</h2>
      </div>
      <div className="prose-lux space-y-5 text-[1.05rem] leading-[1.85] font-light text-taupe-300 lg:col-span-8">
        {content.split('\n\n').map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            <FormattedText text={para} />
          </p>
        ))}
      </div>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <>
      {/* ═════════════ HEADER ═════════════ */}
      <section className="relative overflow-hidden pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 page-glow" />
        <div className="relative lux-container">
          <nav aria-label="Breadcrumb" className="rise flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-taupe-400">
            <Link href="/" className="transition-colors hover:text-parchment-100">Home</Link>
            <span className="text-taupe-600">/</span>
            <Link href="/projects" className="transition-colors hover:text-parchment-100">Projects</Link>
            <span className="text-taupe-600">/</span>
            <span className="max-w-[14rem] truncate text-champagne-300">{project.title}</span>
          </nav>

          <div className="rise rise-1 mt-12 flex flex-wrap items-center gap-3">
            {project.category && <span className="chip chip-gold">{project.category}</span>}
            {project.featured && <span className="chip">Featured case study</span>}
            <span className="label ml-1">{formatDate(project.created_at, { year: 'numeric', month: 'long' })}</span>
          </div>

          <h1 className="rise rise-2 font-display mt-8 max-w-5xl text-[2.8rem] leading-[1.02] sm:text-7xl lg:text-[5.4rem] font-light text-parchment-100">
            {project.title}
          </h1>

          {project.short_desc && (
            <p className="rise rise-3 mt-8 max-w-3xl text-lg sm:text-xl leading-relaxed font-light text-taupe-300">
              {project.short_desc}
            </p>
          )}

          <div className="rise rise-4 mt-14 flex flex-wrap items-end justify-between gap-8 border-t border-white/[0.08] pt-8">
            <dl className="flex flex-wrap gap-x-14 gap-y-6">
              {project.role && (
                <div>
                  <dt className="label">Role</dt>
                  <dd className="mt-2 text-parchment-100">{project.role}</dd>
                </div>
              )}
              {project.category && (
                <div>
                  <dt className="label">Domain</dt>
                  <dd className="mt-2 text-parchment-100">{project.category}</dd>
                </div>
              )}
            </dl>

            <div className="flex flex-wrap gap-3">
              {project.project_url && (
                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="btn-lux-ghost !py-3">
                  Live product ↗
                </a>
              )}
              {(project as any).prototype_url && (
                <a href={(project as any).prototype_url} target="_blank" rel="noopener noreferrer" className="btn-lux-ghost !py-3">
                  View prototype ↗
                </a>
              )}
              {(project as any).case_study_pdf_url && (
                <a href={(project as any).case_study_pdf_url} target="_blank" rel="noopener noreferrer" className="btn-lux !py-3">
                  Download PDF ↓
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ CONTENT ═════════════ */}
      <section className="pb-28 sm:pb-36">
        <div className="lux-container">
          {project.thumbnail_url && (
            <Reveal className="relative mb-16 aspect-[16/8] w-full overflow-hidden rounded-lg border border-white/[0.07] bg-ink-900">
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                sizes="(min-width: 1312px) 1216px, 100vw"
                className="object-cover"
                priority
              />
            </Reveal>
          )}

          <div className="border-b border-white/[0.08]">
            <Section number="01" title="The Problem" content={project.problem} />
            <Section number="02" title="Approach & Strategy" content={project.approach} />
            <Section number="03" title="Decisions & Trade-offs" content={project.decisions} />
            <Section number="04" title="Solution" content={project.solution} />
            <Section number="05" title="Outcomes & Metrics" content={project.outcomes} />
            <Section
              number="06"
              title="Additional Case Study Content"
              content={
                Array.isArray(project.case_studies)
                  ? (project.case_studies[0] as any)?.content
                  : project.case_studies?.content
              }
            />
          </div>

          {project.skills.length > 0 && (
            <Reveal className="grid gap-6 border-b border-white/[0.08] py-14 lg:grid-cols-12 lg:gap-12">
              <h3 className="label lg:col-span-4">Technologies &amp; methodologies</h3>
              <div className="flex flex-wrap gap-2 lg:col-span-8">
                {project.skills.map((skill) => (
                  <span key={skill} className="chip">{skill}</span>
                ))}
              </div>
            </Reveal>
          )}

          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <div className="py-14">
              <h3 className="label mb-8">Product artifacts &amp; interface gallery</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {project.gallery_urls.map((url, i) => (
                  <Reveal key={i} delay={(i % 2) * 120} className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/[0.07] bg-ink-900">
                    <Image
                      src={url}
                      alt={`${project.title} artifact ${i + 1}`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] hover:scale-[1.04]"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
            <Link href="/projects" className="btn-lux-ghost">
              ← All case studies
            </Link>
            <Link href="/contact" className="btn-lux">
              Discuss this work <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
