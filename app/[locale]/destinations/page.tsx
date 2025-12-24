import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import DestinationsContent from './DestinationsContent';

interface DestinationsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DestinationsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    es: 'Destinos de Traslado | Hoteles y Zonas en Riviera Maya | Jetset Transfers',
    en: 'Transfer Destinations | Hotels & Zones in Riviera Maya | Jetset Transfers',
  };

  const descriptions = {
    es: 'Traslados privados desde el Aeropuerto de Cancún a hoteles en Cancún, Playa del Carmen, Tulum, Puerto Morelos y toda la Riviera Maya. Servicio seguro y puntual.',
    en: 'Private transfers from Cancun Airport to hotels in Cancun, Playa del Carmen, Tulum, Puerto Morelos and all Riviera Maya. Safe and punctual service.',
  };

  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: locale === 'es'
      ? 'traslados cancun, transporte aeropuerto cancun, traslado playa del carmen, transporte tulum, shuttle riviera maya'
      : 'cancun transfers, cancun airport transportation, playa del carmen transfer, tulum transport, riviera maya shuttle',
    openGraph: {
      title,
      description,
      url: `https://www.jetsettransfers.com/${locale}/destinations`,
      siteName: 'Jetset Transfers',
      images: [
        {
          url: 'https://www.jetsettransfers.com/images/og/og-image.jpg',
          width: 1200,
          height: 630,
          alt: locale === 'es' ? 'Traslados en Cancún - Jetset Transfers' : 'Cancun Transfers - Jetset Transfers',
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
      canonical: `https://www.jetsettransfers.com/${locale}/destinations`,
      languages: {
        'es': 'https://www.jetsettransfers.com/es/destinations',
        'en': 'https://www.jetsettransfers.com/en/destinations',
        'x-default': 'https://www.jetsettransfers.com/en/destinations',
      },
    },
  };
}

export default async function DestinationsPage({ params }: DestinationsPageProps) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch all active destinations
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return <DestinationsContent locale={locale} destinations={destinations || []} />;
}
