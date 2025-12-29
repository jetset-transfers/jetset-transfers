import { MetadataRoute } from 'next';
import { createBuildClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.jetsetcancun.com';
  const locales = ['es', 'en'];
  const supabase = createBuildClient();

  // Fetch destinations from database
  const { data: destinations } = await supabase
    .from('destinations')
    .select('slug, updated_at')
    .eq('is_active', true);

  // Static routes (same path for both locales)
  const staticRoutes: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/destinations', priority: 0.9 },
    { path: '/contact', priority: 0.8 },
    { path: '/privacy', priority: 0.5 },
    { path: '/terms', priority: 0.5 },
    { path: '/cookies', priority: 0.5 },
  ];

  // Generate sitemap entries for static routes (both locales)
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route.priority,
    }))
  );

  // Generate sitemap entries for destinations (both locales)
  const destinationEntries: MetadataRoute.Sitemap = (destinations || []).flatMap((dest) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/destinations/${dest.slug}`,
      lastModified: dest.updated_at ? new Date(dest.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))
  );

  return [...staticEntries, ...destinationEntries];
}
