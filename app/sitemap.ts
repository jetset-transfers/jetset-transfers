import { MetadataRoute } from 'next';
import { createBuildClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vuelatour.com';
  const locales = ['es', 'en'];
  const supabase = createBuildClient();

  // Fetch destinations and tours from database
  const [{ data: destinations }, { data: tours }] = await Promise.all([
    supabase.from('destinations').select('slug, updated_at').eq('is_active', true),
    supabase.from('air_tours').select('slug, updated_at').eq('is_active', true),
  ]);

  // Static routes with locale-specific paths
  const staticRoutes: { path: { es: string; en: string }; priority: number }[] = [
    { path: { es: '', en: '' }, priority: 1 },
    { path: { es: '/vuelos-charter', en: '/charter-flights' }, priority: 0.9 },
    { path: { es: '/tours-aereos', en: '/air-tours' }, priority: 0.9 },
    { path: { es: '/contacto', en: '/contact' }, priority: 0.8 },
    { path: { es: '/privacidad', en: '/privacy' }, priority: 0.5 },
    { path: { es: '/terminos', en: '/terms' }, priority: 0.5 },
    { path: { es: '/cookies', en: '/cookies' }, priority: 0.5 },
  ];

  // Generate sitemap entries for static routes (both locales)
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path[locale as keyof typeof route.path]}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route.priority,
    }))
  );

  // Generate sitemap entries for destinations (both locales)
  const destinationEntries: MetadataRoute.Sitemap = (destinations || []).flatMap((dest) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/charter-flights/${dest.slug}`,
      lastModified: dest.updated_at ? new Date(dest.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))
  );

  // Generate sitemap entries for tours (both locales)
  const tourEntries: MetadataRoute.Sitemap = (tours || []).flatMap((tour) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/air-tours/${tour.slug}`,
      lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))
  );

  return [...staticEntries, ...destinationEntries, ...tourEntries];
}
