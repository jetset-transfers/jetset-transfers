import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient, createBuildClient } from '@/lib/supabase/server';
import { AGGREGATE_RATING, SITE_URL } from '@/lib/seo';
import DestinationDetailContent from './DestinationDetailContent';

interface DestinationDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: DestinationDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!destination) {
    return {
      title: locale === 'es' ? 'Destino no encontrado' : 'Destination not found',
    };
  }

  const name = locale === 'es' ? destination.name_es : destination.name_en;
  const description = locale === 'es' ? destination.description_es : destination.description_en;

  // Use custom meta fields from database if available, otherwise use fallbacks
  const metaTitle = locale === 'es'
    ? (destination.meta_title_es || `Traslado a ${name} desde Aeropuerto de Cancún | Jetset Transfers`)
    : (destination.meta_title_en || `Transfer to ${name} from Cancun Airport | Jetset Transfers`);

  const metaDescription = locale === 'es'
    ? (destination.meta_description_es || description || `Traslado privado desde el Aeropuerto de Cancún a ${name}. Tiempo de traslado: ${destination.travel_time || '30-60 min'}. Servicio seguro y puntual. Reserva hoy.`)
    : (destination.meta_description_en || description || `Private transfer from Cancun Airport to ${name}. Travel time: ${destination.travel_time || '30-60 min'}. Safe and punctual service. Book today.`);

  // Get image URL - ensure it's absolute
  const imageUrl = destination.image_url
    ? (destination.image_url.startsWith('http') ? destination.image_url : `${SITE_URL}${destination.image_url}`)
    : `${SITE_URL}/images/og/og-image.jpg`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: locale === 'es'
      ? `traslado ${name.toLowerCase()}, transporte ${name.toLowerCase()}, shuttle cancun ${name.toLowerCase()}`
      : `transfer ${name.toLowerCase()}, transportation ${name.toLowerCase()}, cancun shuttle ${name.toLowerCase()}`,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${SITE_URL}/${locale}/destinations/${slug}`,
      siteName: 'Jetset Transfers',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: locale === 'es' ? `Traslado a ${name} - Jetset Transfers` : `Transfer to ${name} - Jetset Transfers`,
        },
      ],
      type: 'website',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/destinations/${slug}`,
      languages: {
        'es': `${SITE_URL}/es/destinations/${slug}`,
        'en': `${SITE_URL}/en/destinations/${slug}`,
        'x-default': `${SITE_URL}/en/destinations/${slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  const supabase = createBuildClient();

  const { data: destinations } = await supabase
    .from('destinations')
    .select('slug')
    .eq('is_active', true);

  const locales = ['es', 'en'];
  const params: { locale: string; slug: string }[] = [];

  destinations?.forEach((destination) => {
    locales.forEach((locale) => {
      params.push({ locale, slug: destination.slug });
    });
  });

  return params;
}

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!destination) {
    notFound();
  }

  // Fetch other destinations for "More destinations" section
  const { data: otherDestinations } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .neq('slug', slug)
    .order('display_order', { ascending: true })
    .limit(3);

  // Fetch available services for display
  const { data: availableServices } = await supabase
    .from('destination_services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const name = locale === 'es' ? destination.name_es : destination.name_en;
  const description = locale === 'es' ? destination.description_es : destination.description_en;
  const imageUrl = destination.image_url
    ? (destination.image_url.startsWith('http') ? destination.image_url : `${SITE_URL}${destination.image_url}`)
    : `${SITE_URL}/images/og/og-image.jpg`;

  // Build schemas for rendering
  const vehiclePricing = destination.vehicle_pricing || [];
  const prices = vehiclePricing.map((p: any) => p.price_usd);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: locale === 'es' ? `Traslado a ${name}` : `Transfer to ${name}`,
    description: description || (locale === 'es'
      ? `Traslado privado desde el Aeropuerto de Cancún a ${name}. Servicio seguro y puntual.`
      : `Private transfer from Cancun Airport to ${name}. Safe and punctual service.`),
    image: imageUrl,
    brand: { '@type': 'Brand', name: 'Jetset Transfers' },
    offers: vehiclePricing.length > 1 ? {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: vehiclePricing.length,
      offers: vehiclePricing.map((pricing: any) => ({
        '@type': 'Offer',
        name: `${name} - ${pricing.vehicle_name}`,
        price: pricing.price_usd,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        url: `${SITE_URL}/${locale}/destinations/${slug}`,
      })),
    } : vehiclePricing.length === 1 ? {
      '@type': 'Offer',
      price: vehiclePricing[0].price_usd,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      url: `${SITE_URL}/${locale}/destinations/${slug}`,
    } : { '@type': 'Offer', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ...AGGREGATE_RATING },
    url: `${SITE_URL}/${locale}/destinations/${slug}`,
    category: locale === 'es' ? 'Traslados Privados' : 'Private Transfers',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'es' ? 'Áreas' : 'Areas', item: `${SITE_URL}/${locale}/destinations` },
      { '@type': 'ListItem', position: 3, name: name, item: `${SITE_URL}/${locale}/destinations/${slug}` },
    ],
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <DestinationDetailContent
        locale={locale}
        destination={destination}
        otherDestinations={otherDestinations || []}
        availableServices={availableServices || []}
      />
    </>
  );
}
