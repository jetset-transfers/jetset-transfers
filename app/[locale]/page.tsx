import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import QuickBenefitsSection from '@/components/home/QuickBenefitsSection';
import { LocalBusinessSchema, ServiceSchema, OrganizationSchema } from '@/components/seo/SchemaMarkup';
import { createClient } from '@/lib/supabase/server';
import { getYearsOfExperienceFormatted } from '@/lib/constants';

// Dynamic imports for below-the-fold components to reduce initial JS bundle
const DestinationsSection = dynamic(() => import('@/components/home/DestinationsSection'), {
  loading: () => <div className="min-h-[400px] bg-white dark:bg-navy-950 animate-pulse" />,
});

const FleetSection = dynamic(() => import('@/components/home/FleetSection'), {
  loading: () => <div className="min-h-[500px] bg-gray-50 dark:bg-navy-900/50 animate-pulse" />,
});

const WhyChooseSection = dynamic(() => import('@/components/home/WhyChooseSection'), {
  loading: () => <div className="min-h-[500px] bg-white dark:bg-navy-950 animate-pulse" />,
});

const TripAdvisorSection = dynamic(() => import('@/components/home/TripAdvisorSection'), {
  loading: () => <div className="min-h-[300px] bg-gray-50 dark:bg-navy-950 animate-pulse" />,
});

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch destinations from Supabase
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // Fetch vehicles from Supabase
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // Get most popular destination/tour based on contact requests
  // Query contact_requests grouped by destination field to find the most requested
  const { data: popularRequests } = await supabase
    .from('contact_requests')
    .select('destination, service_type')
    .not('destination', 'is', null)
    .not('destination', 'eq', '');

  // Count occurrences and find the most popular
  const destinationCounts: Record<string, { count: number; type: string }> = {};
  (popularRequests || []).forEach((req) => {
    if (req.destination) {
      const slug = req.destination.toLowerCase().replace(/\s+/g, '-');
      if (!destinationCounts[slug]) {
        destinationCounts[slug] = { count: 0, type: req.service_type || 'private' };
      }
      destinationCounts[slug].count++;
    }
  });

  // Find the most popular slug
  let mostPopularSlug: string | null = null;
  let maxCount = 0;
  Object.entries(destinationCounts).forEach(([slug, data]) => {
    if (data.count > maxCount) {
      maxCount = data.count;
      mostPopularSlug = slug;
    }
  });

  // Find the actual destination that matches the most popular
  let popularItem = null;
  if (mostPopularSlug && maxCount >= 1) {
    popularItem = (destinations || []).find(
      (d) => d.slug === mostPopularSlug || d.name_es.toLowerCase().includes(mostPopularSlug!) || d.name_en.toLowerCase().includes(mostPopularSlug!)
    );
  }

  // Fetch site content from Supabase
  const { data: content } = await supabase
    .from('site_content')
    .select('*');

  // Fetch site images from Supabase
  const { data: images } = await supabase
    .from('site_images')
    .select('*');

  // Transform images to a map by category
  const imagesMap = (images || []).reduce((acc, img) => {
    const category = img.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(img);
    return acc;
  }, {} as Record<string, typeof images>);

  // Helper to get primary image from a category (or fallback to first)
  const getPrimaryImage = (category: string) => {
    const categoryImages = imagesMap[category] || [];
    return categoryImages.find((img: any) => img.is_primary) || categoryImages[0] || null;
  };

  // Get hero image (primary or first from hero category)
  const heroImage = getPrimaryImage('hero');

  // Get fleet image (primary or first from fleet category)
  const fleetImage = getPrimaryImage('fleet');

  // Get hero carousel images (all images from hero_carousel category, ordered by display_order)
  const { data: carouselImages } = await supabase
    .from('site_images')
    .select('id, url, alt_es, alt_en, title_es, title_en, display_order, metadata')
    .eq('category', 'hero_carousel')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // Get Why Choose image
  const { data: whyChooseImages } = await supabase
    .from('site_images')
    .select('url, alt_es, alt_en')
    .eq('category', 'why_choose')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1);

  const whyChooseImage = whyChooseImages?.[0] || null;

  // Transform carousel images to include price and link_url from metadata
  const transformedCarouselImages = (carouselImages || []).map((img: any) => ({
    id: img.id,
    url: img.url,
    alt_es: img.alt_es,
    alt_en: img.alt_en,
    title_es: img.title_es,
    title_en: img.title_en,
    price: img.metadata?.price || null,
    link_url: img.metadata?.link_url || null,
    display_order: img.display_order,
  }));

  // Transform content to a key-value map
  const contentMap = (content || []).reduce((acc, item) => {
    acc[item.key] = {
      es: item.value_es,
      en: item.value_en,
    };
    return acc;
  }, {} as Record<string, { es: string; en: string }>);

  return (
    <>
      {/* SEO Schema Markup */}
      <LocalBusinessSchema
        locale={locale}
        heroImageUrl={heroImage?.url}
        fleetImageUrl={fleetImage?.url}
      />
      <ServiceSchema locale={locale} />
      <OrganizationSchema locale={locale} />

      {/* Page Content */}
      <HeroSection
        locale={locale}
        content={contentMap}
        heroImage={heroImage}
        carouselImages={transformedCarouselImages}
        featuredDestination={popularItem || (destinations?.[0] || null)}
        hasPopularData={!!popularItem}
      />
      <QuickBenefitsSection />
      <DestinationsSection
        locale={locale}
        destinations={destinations || []}
      />
      <FleetSection locale={locale} vehicles={vehicles || []} />
      <WhyChooseSection locale={locale} image={whyChooseImage} />
      <TripAdvisorSection locale={locale} />
    </>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch hero image for OG meta - prioritize primary image
  const { data: images } = await supabase
    .from('site_images')
    .select('url, alt_es, alt_en, is_primary')
    .eq('category', 'hero')
    .order('is_primary', { ascending: false })
    .limit(1);

  const heroImage = images?.[0];

  // Get OG image URL - use hero image if available, fallback to static
  const ogImageUrl = heroImage?.url
    ? (heroImage.url.startsWith('http') ? heroImage.url : `https://www.jetsettransfers.com${heroImage.url}`)
    : 'https://www.jetsettransfers.com/images/og/og-image.jpg';

  const ogImageAlt = heroImage
    ? (locale === 'es' ? heroImage.alt_es : heroImage.alt_en) || 'Jetset Transfers'
    : locale === 'es' ? 'Jetset Transfers - Transporte en Cancún' : 'Jetset Transfers - Transportation in Cancún';

  const titles = {
    es: 'Jetset Transfers | Transporte Privado en Cancún y Riviera Maya',
    en: 'Jetset Transfers | Private Transportation in Cancún & Riviera Maya',
  };

  const yearsExp = getYearsOfExperienceFormatted();
  const descriptions = {
    es: `Transporte privado seguro y puntual desde el Aeropuerto de Cancún. Traslados a Zona Hotelera, Playa del Carmen, Tulum. ${yearsExp} años de experiencia.`,
    en: `Safe and punctual private transportation from Cancun Airport. Transfers to Hotel Zone, Playa del Carmen, Tulum. ${yearsExp} years experience.`,
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.es,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.es,
    keywords: locale === 'es'
      ? 'transporte privado cancun, traslados aeropuerto cancun, transporte riviera maya, taxi privado cancun, traslados playa del carmen'
      : 'private transportation cancun, cancun airport transfers, riviera maya transport, private taxi cancun, playa del carmen transfers',
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.es,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.es,
      url: `https://www.jetsettransfers.com/${locale}`,
      siteName: 'Jetset Transfers',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.es,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.es,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://www.jetsettransfers.com/${locale}`,
      languages: {
        'es': 'https://www.jetsettransfers.com/es',
        'en': 'https://www.jetsettransfers.com/en',
        'x-default': 'https://www.jetsettransfers.com/en',
      },
    },
  };
}