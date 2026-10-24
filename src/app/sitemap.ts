import { createServerSupabaseClient } from '@/lib/supabase/server';
import { absoluteUrl } from '@/lib/utils';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('status', 'published');

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/about'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/experience'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/projects'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/skills'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/contact'), lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ];

  const projectPages: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: absoluteUrl(`/projects/${p.slug}`),
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}
