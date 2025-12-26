import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import VehiclesContent from './VehiclesContent';

interface VehiclesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: VehiclesPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    es: 'Nuestra Flota de Vehículos | Transporte Seguro y Cómodo | Jetset Transfers',
    en: 'Our Vehicle Fleet | Safe and Comfortable Transportation | Jetset Transfers',
  };

  const descriptions = {
    es: 'Conoce nuestra flota de vehículos modernos y cómodos para traslados en Cancún y Riviera Maya. Desde sedanes hasta vans de lujo, tenemos el vehículo perfecto para tu grupo.',
    en: 'Discover our fleet of modern and comfortable vehicles for transfers in Cancun and Riviera Maya. From sedans to luxury vans, we have the perfect vehicle for your group.',
  };

  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: locale === 'es'
      ? 'vehiculos cancun, transporte seguro, suv cancun, van cancun, sprinter riviera maya'
      : 'cancun vehicles, safe transportation, suv cancun, van cancun, sprinter riviera maya',
    openGraph: {
      title,
      description,
      url: `https://www.jetsettransfers.com/${locale}/vehicles`,
      siteName: 'Jetset Transfers',
      images: [
        {
          url: 'https://www.jetsettransfers.com/images/og/og-image.jpg',
          width: 1200,
          height: 630,
          alt: locale === 'es' ? 'Vehículos Jetset Transfers' : 'Jetset Transfers Vehicles',
        },
      ],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.jetsettransfers.com/images/og/og-image.jpg'],
    },
    alternates: {
      canonical: `https://www.jetsettransfers.com/${locale}/vehicles`,
      languages: {
        'es': 'https://www.jetsettransfers.com/es/vehicles',
        'en': 'https://www.jetsettransfers.com/en/vehicles',
        'x-default': 'https://www.jetsettransfers.com/en/vehicles',
      },
    },
  };
}

export default async function VehiclesPage({ params }: VehiclesPageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch all active vehicles
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return <VehiclesContent locale={locale} vehicles={vehicles || []} />;
}
