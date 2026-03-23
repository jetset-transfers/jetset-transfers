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

  // Fetch vehicles to check if vehicles page should be included
  const { count: vehicleCount } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Static routes (same path for both locales)
  const staticRoutes: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: '/destinations', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/services/private-transfer', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/services/shared-transfer', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/services/vip-transfer', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/transfer-booking', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/cookies', priority: 0.3, changeFrequency: 'monthly' },
  ];

  // Add vehicles page if there are vehicles
  if (vehicleCount && vehicleCount > 0) {
    staticRoutes.push({ path: '/vehicles', priority: 0.8, changeFrequency: 'weekly' });
  }

  // Generate sitemap entries for static routes (both locales)
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          es: `${baseUrl}/es${route.path}`,
          en: `${baseUrl}/en${route.path}`,
          'x-default': `${baseUrl}/en${route.path}`,
        },
      },
    }))
  );

  // Generate sitemap entries for destinations (both locales)
  const destinationEntries: MetadataRoute.Sitemap = (destinations || []).flatMap((dest) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/destinations/${dest.slug}`,
      lastModified: dest.updated_at ? new Date(dest.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
      alternates: {
        languages: {
          es: `${baseUrl}/es/destinations/${dest.slug}`,
          en: `${baseUrl}/en/destinations/${dest.slug}`,
          'x-default': `${baseUrl}/en/destinations/${dest.slug}`,
        },
      },
    }))
  );

  return [...staticEntries, ...destinationEntries];
}
