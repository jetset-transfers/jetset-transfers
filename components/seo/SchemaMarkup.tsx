import Script from 'next/script';
import { getYearsOfExperienceFormatted, FOUNDING_YEAR } from '@/lib/constants';

interface LocalBusinessSchemaProps {
  locale: string;
  heroImageUrl?: string | null;
  fleetImageUrl?: string | null;
}

export function LocalBusinessSchema({ locale, heroImageUrl, fleetImageUrl }: LocalBusinessSchemaProps) {
  // Use dynamic images if available, fallback to static
  const heroImg = heroImageUrl || '/images/hero/hero-cancun-transfer.jpg';
  const fleetImg = fleetImageUrl || '/images/vehicles/suburban.jpg';

  // Ensure URLs are absolute
  const getAbsoluteUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `https://jetsettransfers.com${url}`;
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://jetsettransfers.com',
    name: 'Jetset Transfers',
    alternateName: locale === 'es' ? 'Jetset Transfers Cancún' : 'Jetset Transfers Cancun',
    description: locale === 'es'
      ? `Transporte privado seguro y puntual desde el Aeropuerto de Cancún a hoteles y destinos turísticos en la Riviera Maya. ${getYearsOfExperienceFormatted()} años de experiencia.`
      : `Safe and punctual private transportation from Cancun Airport to hotels and tourist destinations in the Riviera Maya. ${getYearsOfExperienceFormatted()} years of experience.`,
    url: 'https://jetsettransfers.com',
    telephone: '+52-998-123-4567',
    email: 'info@jetsettransfers.com',
    logo: {
      '@type': 'ImageObject',
      '@id': 'https://jetsettransfers.com/#logo',
      url: 'https://jetsettransfers.com/images/logo/jetset-logo.png',
      contentUrl: 'https://jetsettransfers.com/images/logo/jetset-logo.png',
      caption: locale === 'es'
        ? 'Jetset Transfers - Transporte privado en Cancún y Riviera Maya'
        : 'Jetset Transfers - Private transportation in Cancún and Riviera Maya',
      width: 150,
      height: 40,
      inLanguage: locale === 'es' ? 'es-MX' : 'en-US',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Aeropuerto Internacional de Cancún',
      addressLocality: 'Cancún',
      addressRegion: 'Quintana Roo',
      postalCode: '77569',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.0367,
      longitude: -86.8770,
    },
    image: [
      {
        '@type': 'ImageObject',
        url: 'https://jetsettransfers.com/images/logo/jetset-logo.png',
        caption: locale === 'es' ? 'Logo de Jetset Transfers' : 'Jetset Transfers Logo',
        width: 150,
        height: 40,
      },
      getAbsoluteUrl(heroImg),
      getAbsoluteUrl(fleetImg),
    ],
    priceRange: '$50 - $200 USD',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '9',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      'https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html',
    ],
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  locale: string;
}

export function ServiceSchema({ locale }: ServiceSchemaProps) {
  const services = [
    {
      '@type': 'Service',
      name: locale === 'es' ? 'Traslado Privado' : 'Private Transfer',
      description: locale === 'es'
        ? 'Transporte privado desde el Aeropuerto de Cancún a tu hotel o destino'
        : 'Private transportation from Cancun Airport to your hotel or destination',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Jetset Transfers',
      },
      areaServed: {
        '@type': 'Place',
        name: 'Riviera Maya, Mexico',
      },
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '50',
        },
      },
    },
    {
      '@type': 'Service',
      name: locale === 'es' ? 'Traslado Compartido' : 'Shared Transfer',
      description: locale === 'es'
        ? 'Traslado compartido económico desde el aeropuerto a tu destino'
        : 'Affordable shared transfer from the airport to your destination',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Jetset Transfers',
      },
      areaServed: {
        '@type': 'Place',
        name: 'Cancún, Quintana Roo',
      },
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '25',
        },
      },
    },
    {
      '@type': 'Service',
      name: locale === 'es' ? 'Traslado VIP' : 'VIP Transfer',
      description: locale === 'es'
        ? 'Servicio de transporte premium con vehículos de lujo y amenidades especiales'
        : 'Premium transportation service with luxury vehicles and special amenities',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Jetset Transfers',
      },
      areaServed: {
        '@type': 'Place',
        name: 'Riviera Maya, Mexico',
      },
      offers: {
        '@type': 'Offer',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '100',
        },
      },
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': services,
  };

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface TransferSchemaProps {
  transfer: {
    name: string;
    description: string;
    image: string;
    price: string;
    duration: string;
  };
  locale: string;
}

export function TransferSchema({ transfer, locale }: TransferSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: transfer.name,
    description: transfer.description,
    image: `https://jetsettransfers.com${transfer.image}`,
    offers: {
      '@type': 'Offer',
      price: transfer.price.replace('$', '').replace(',', ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'LocalBusiness',
      name: 'Jetset Transfers',
      url: 'https://jetsettransfers.com',
    },
  };

  return (
    <Script
      id={`transfer-schema-${transfer.name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface OrganizationSchemaProps {
  locale: string;
}

export function OrganizationSchema({ locale }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://jetsettransfers.com/#organization',
    name: 'Jetset Transfers',
    alternateName: ['Jetset Transfers Cancún', 'Jetset Transfers Mexico', 'Transporte Privado Cancún'],
    url: 'https://jetsettransfers.com',
    logo: {
      '@type': 'ImageObject',
      '@id': 'https://jetsettransfers.com/#logo',
      url: 'https://jetsettransfers.com/images/logo/jetset-logo.png',
      contentUrl: 'https://jetsettransfers.com/images/logo/jetset-logo.png',
      caption: locale === 'es'
        ? 'Jetset Transfers - Empresa de transporte privado en Cancún, México'
        : 'Jetset Transfers - Private transportation company in Cancún, Mexico',
      width: 150,
      height: 40,
      encodingFormat: 'image/png',
    },
    image: {
      '@type': 'ImageObject',
      url: 'https://jetsettransfers.com/images/logo/jetset-logo.png',
      width: 150,
      height: 40,
    },
    description: locale === 'es'
      ? `Jetset Transfers es una empresa de transporte terrestre que ofrece traslados privados, compartidos y VIP desde el Aeropuerto de Cancún a hoteles y destinos turísticos en la Riviera Maya. Con más de ${getYearsOfExperienceFormatted()} años de experiencia.`
      : `Jetset Transfers is a ground transportation company offering private, shared, and VIP transfers from Cancun Airport to hotels and tourist destinations in the Riviera Maya. With over ${getYearsOfExperienceFormatted()} years of experience.`,
    foundingDate: String(FOUNDING_YEAR),
    foundingLocation: {
      '@type': 'Place',
      name: 'Cancún, Quintana Roo, México',
    },
    areaServed: [
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 21.0367,
          longitude: -86.8770,
        },
        geoRadius: '200 km',
      },
      {
        '@type': 'Place',
        name: 'Cancún',
      },
      {
        '@type': 'Place',
        name: 'Riviera Maya',
      },
      {
        '@type': 'Place',
        name: 'Quintana Roo',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+52-998-123-4567',
      contactType: locale === 'es' ? 'Reservaciones' : 'Reservations',
      email: 'info@jetsettransfers.com',
      availableLanguage: ['Spanish', 'English'],
      areaServed: 'MX',
    },
    sameAs: [
      'https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html',
    ],
    slogan: locale === 'es'
      ? 'Transporte seguro, privado y puntual en la Riviera Maya'
      : 'Safe, private, and punctual transportation in the Riviera Maya',
    knowsAbout: locale === 'es'
      ? ['Transporte privado', 'Traslados aeropuerto', 'Turismo en Cancún', 'Riviera Maya', 'Transporte ejecutivo']
      : ['Private transportation', 'Airport transfers', 'Cancún tourism', 'Riviera Maya', 'Executive transport'],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://jetsettransfers.com${item.url}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface VehiclePricing {
  vehicle_name: string;
  max_passengers: number;
  price_usd: number;
  notes_es?: string;
  notes_en?: string;
}

interface DestinationProductSchemaProps {
  destination: {
    name_es: string;
    name_en: string;
    description_es?: string | null;
    description_en?: string | null;
    slug: string;
    image_url?: string | null;
    travel_time?: string | null;
    vehicle_pricing?: VehiclePricing[] | null;
  };
  locale: string;
}

export function DestinationProductSchema({ destination, locale }: DestinationProductSchemaProps) {
  const name = locale === 'es' ? destination.name_es : destination.name_en;
  const description = locale === 'es' ? destination.description_es : destination.description_en;

  // Get absolute image URL
  const getAbsoluteUrl = (url: string) => {
    if (!url) return 'https://www.jetsettransfers.com/images/og/og-image.jpg';
    if (url.startsWith('http')) return url;
    return `https://www.jetsettransfers.com${url}`;
  };

  const imageUrl = getAbsoluteUrl(destination.image_url || '');

  // Get pricing information
  const vehiclePricing = destination.vehicle_pricing || [];
  const prices = vehiclePricing.map((p) => p.price_usd);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  // If multiple pricing options, use AggregateOffer, otherwise use single Offer
  const offers = vehiclePricing.length > 1 ? {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: minPrice,
    highPrice: maxPrice,
    offerCount: vehiclePricing.length,
    offers: vehiclePricing.map((pricing) => ({
      '@type': 'Offer',
      name: `${name} - ${pricing.vehicle_name}`,
      price: pricing.price_usd,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      url: `https://www.jetsettransfers.com/${locale}/destinations/${destination.slug}`,
      description: locale === 'es'
        ? `Hasta ${pricing.max_passengers} pasajeros - ${pricing.vehicle_name}`
        : `Up to ${pricing.max_passengers} passengers - ${pricing.vehicle_name}`,
    })),
  } : vehiclePricing.length === 1 ? {
    '@type': 'Offer',
    price: vehiclePricing[0].price_usd,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    url: `https://www.jetsettransfers.com/${locale}/destinations/${destination.slug}`,
  } : null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: locale === 'es' ? `Traslado a ${name}` : `Transfer to ${name}`,
    description: description || (locale === 'es'
      ? `Traslado privado desde el Aeropuerto de Cancún a ${name}. Servicio seguro y puntual.`
      : `Private transfer from Cancún Airport to ${name}. Safe and punctual service.`),
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: 'Jetset Transfers',
    },
    offers: offers || {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://www.jetsettransfers.com/${locale}/destinations/${destination.slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '9',
    },
    url: `https://www.jetsettransfers.com/${locale}/destinations/${destination.slug}`,
    category: locale === 'es' ? 'Traslados Privados' : 'Private Transfers',
  };

  return (
    <Script
      id="destination-product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
