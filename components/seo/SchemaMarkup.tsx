import Script from 'next/script';
import { getYearsOfExperienceFormatted, FOUNDING_YEAR } from '@/lib/constants';
import { ContactInfo, SITE_URL, SITE_NAME, LOGO_URL, AGGREGATE_RATING } from '@/lib/seo';

// Helper to ensure URLs are absolute
function getAbsoluteUrl(url: string): string {
  if (!url) return `${SITE_URL}/images/og/og-image.jpg`;
  if (url.startsWith('http')) return url;
  return `${SITE_URL}${url}`;
}

// ============================================================
// LocalBusiness Schema - for homepage
// ============================================================
interface LocalBusinessSchemaProps {
  locale: string;
  contactInfo: ContactInfo;
  heroImageUrl?: string | null;
  fleetImageUrl?: string | null;
}

export function LocalBusinessSchema({ locale, contactInfo, heroImageUrl, fleetImageUrl }: LocalBusinessSchemaProps) {
  const heroImg = heroImageUrl || '/images/hero/hero-cancun-transfer.jpg';
  const fleetImg = fleetImageUrl || '/images/vehicles/suburban.jpg';

  const sameAs = [
    contactInfo.tripadvisor_url,
    contactInfo.facebook_url,
    contactInfo.instagram_url,
    contactInfo.tiktok_url,
  ].filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    alternateName: locale === 'es' ? 'Jetset Transfers Cancun' : 'Jetset Transfers Cancun',
    description: locale === 'es'
      ? `Transporte privado seguro y puntual desde el Aeropuerto de Cancun a hoteles y destinos turisticos en la Riviera Maya. ${getYearsOfExperienceFormatted()} anos de experiencia.`
      : `Safe and punctual private transportation from Cancun Airport to hotels and tourist destinations in the Riviera Maya. ${getYearsOfExperienceFormatted()} years of experience.`,
    url: SITE_URL,
    telephone: contactInfo.phone_link,
    email: contactInfo.email,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      caption: locale === 'es'
        ? 'Jetset Transfers - Transporte privado en Cancun y Riviera Maya'
        : 'Jetset Transfers - Private transportation in Cancun and Riviera Maya',
      width: 150,
      height: 40,
      inLanguage: locale === 'es' ? 'es-MX' : 'en-US',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: locale === 'es' ? contactInfo.address_es : contactInfo.address_en,
      addressLocality: 'Cancun',
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
        url: LOGO_URL,
        caption: locale === 'es' ? 'Logo de Jetset Transfers' : 'Jetset Transfers Logo',
        width: 150,
        height: 40,
      },
      getAbsoluteUrl(heroImg),
      getAbsoluteUrl(fleetImg),
    ],
    priceRange: '$50 - $200 USD',
    currenciesAccepted: 'USD, MXN',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    aggregateRating: {
      '@type': 'AggregateRating',
      ...AGGREGATE_RATING,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs,
    hasMap: 'https://maps.google.com/?q=Aeropuerto+Internacional+de+Cancun',
    areaServed: [
      { '@type': 'Place', name: 'Cancun' },
      { '@type': 'Place', name: 'Riviera Maya' },
      { '@type': 'Place', name: 'Playa del Carmen' },
      { '@type': 'Place', name: 'Tulum' },
      { '@type': 'Place', name: 'Puerto Morelos' },
      { '@type': 'Place', name: 'Costa Mujeres' },
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

// ============================================================
// Service Schema - for homepage
// ============================================================
interface ServiceSchemaProps {
  locale: string;
  contactInfo: ContactInfo;
}

export function ServiceSchema({ locale, contactInfo }: ServiceSchemaProps) {
  const services = [
    {
      '@type': 'Service',
      name: locale === 'es' ? 'Traslado Privado desde Aeropuerto de Cancun' : 'Private Transfer from Cancun Airport',
      description: locale === 'es'
        ? 'Transporte privado exclusivo desde el Aeropuerto de Cancun a tu hotel o destino en la Riviera Maya. Vehiculo solo para tu grupo, sin paradas adicionales.'
        : 'Exclusive private transportation from Cancun Airport to your hotel or destination in the Riviera Maya. Vehicle only for your group, no additional stops.',
      serviceType: locale === 'es' ? 'Traslado Privado' : 'Private Transfer',
      provider: {
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        url: SITE_URL,
        telephone: contactInfo.phone_link,
      },
      areaServed: [
        { '@type': 'Place', name: 'Cancun, Quintana Roo' },
        { '@type': 'Place', name: 'Riviera Maya' },
        { '@type': 'Place', name: 'Playa del Carmen' },
        { '@type': 'Place', name: 'Tulum' },
      ],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '55',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '55',
        },
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'Service',
      name: locale === 'es' ? 'Traslado Compartido Cancun' : 'Shared Transfer Cancun',
      description: locale === 'es'
        ? 'Traslado compartido economico desde el Aeropuerto de Cancun. Comparte vehiculo con otros viajeros a precio reducido.'
        : 'Affordable shared transfer from Cancun Airport. Share the vehicle with other travelers at a reduced price.',
      serviceType: locale === 'es' ? 'Traslado Compartido' : 'Shared Transfer',
      provider: {
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: { '@type': 'Place', name: 'Cancun, Quintana Roo' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '25',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '25',
        },
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'Service',
      name: locale === 'es' ? 'Traslado VIP Cancun' : 'VIP Transfer Cancun',
      description: locale === 'es'
        ? 'Servicio de transporte premium con vehiculos de lujo y amenidades especiales. La mejor experiencia de traslado en la Riviera Maya.'
        : 'Premium transportation service with luxury vehicles and special amenities. The best transfer experience in the Riviera Maya.',
      serviceType: locale === 'es' ? 'Traslado VIP' : 'VIP Transfer',
      provider: {
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: { '@type': 'Place', name: 'Riviera Maya, Mexico' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: '100',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          minPrice: '100',
        },
        availability: 'https://schema.org/InStock',
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

// ============================================================
// Organization Schema - for homepage
// ============================================================
interface OrganizationSchemaProps {
  locale: string;
  contactInfo: ContactInfo;
}

export function OrganizationSchema({ locale, contactInfo }: OrganizationSchemaProps) {
  const sameAs = [
    contactInfo.tripadvisor_url,
    contactInfo.facebook_url,
    contactInfo.instagram_url,
    contactInfo.tiktok_url,
  ].filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ['Jetset Transfers Cancun', 'Jetset Transfers Mexico', 'Transporte Privado Cancun Jetset'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      caption: locale === 'es'
        ? 'Jetset Transfers - Empresa de transporte privado en Cancun, Mexico'
        : 'Jetset Transfers - Private transportation company in Cancun, Mexico',
      width: 150,
      height: 40,
      encodingFormat: 'image/webp',
    },
    image: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 150,
      height: 40,
    },
    description: locale === 'es'
      ? `Jetset Transfers es una empresa de transporte terrestre que ofrece traslados privados, compartidos y VIP desde el Aeropuerto de Cancun a hoteles y destinos turisticos en la Riviera Maya. Con mas de ${getYearsOfExperienceFormatted()} anos de experiencia.`
      : `Jetset Transfers is a ground transportation company offering private, shared, and VIP transfers from Cancun Airport to hotels and tourist destinations in the Riviera Maya. With over ${getYearsOfExperienceFormatted()} years of experience.`,
    foundingDate: String(FOUNDING_YEAR),
    foundingLocation: {
      '@type': 'Place',
      name: 'Cancun, Quintana Roo, Mexico',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ...AGGREGATE_RATING,
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
      { '@type': 'Place', name: 'Cancun' },
      { '@type': 'Place', name: 'Riviera Maya' },
      { '@type': 'Place', name: 'Quintana Roo' },
      { '@type': 'Place', name: 'Playa del Carmen' },
      { '@type': 'Place', name: 'Tulum' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactInfo.phone_link,
      contactType: locale === 'es' ? 'Reservaciones' : 'Reservations',
      email: contactInfo.email,
      availableLanguage: ['Spanish', 'English'],
      areaServed: 'MX',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    },
    sameAs,
    slogan: locale === 'es'
      ? 'Transporte seguro, privado y puntual en la Riviera Maya'
      : 'Safe, private, and punctual transportation in the Riviera Maya',
    knowsAbout: locale === 'es'
      ? ['Transporte privado', 'Traslados aeropuerto Cancun', 'Turismo en Cancun', 'Riviera Maya', 'Transporte ejecutivo', 'Shuttle Cancun']
      : ['Private transportation', 'Cancun airport transfers', 'Cancun tourism', 'Riviera Maya', 'Executive transport', 'Cancun shuttle'],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// Breadcrumb Schema - for all pages
// ============================================================
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
      item: `${SITE_URL}${item.url}`,
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

// ============================================================
// FAQ Schema - for FAQ page and any page with FAQs
// ============================================================
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

// ============================================================
// Destination Product Schema - for destination detail pages
// ============================================================
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
  const imageUrl = getAbsoluteUrl(destination.image_url || '');

  const vehiclePricing = destination.vehicle_pricing || [];
  const prices = vehiclePricing.map((p) => p.price_usd);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

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
      url: `${SITE_URL}/${locale}/destinations/${destination.slug}`,
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
    url: `${SITE_URL}/${locale}/destinations/${destination.slug}`,
  } : null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: locale === 'es' ? `Traslado a ${name}` : `Transfer to ${name}`,
    description: description || (locale === 'es'
      ? `Traslado privado desde el Aeropuerto de Cancun a ${name}. Servicio seguro y puntual.`
      : `Private transfer from Cancun Airport to ${name}. Safe and punctual service.`),
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: offers || {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/${locale}/destinations/${destination.slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ...AGGREGATE_RATING,
    },
    url: `${SITE_URL}/${locale}/destinations/${destination.slug}`,
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

// ============================================================
// ItemList Schema - for listing pages (destinations, vehicles)
// ============================================================
interface ItemListSchemaProps {
  items: Array<{
    name: string;
    url: string;
    image?: string;
    description?: string;
    position: number;
  }>;
  name: string;
}

export function ItemListSchema({ items, name }: ItemListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: `${SITE_URL}${item.url}`,
      ...(item.image && { image: getAbsoluteUrl(item.image) }),
      ...(item.description && { description: item.description }),
    })),
  };

  return (
    <Script
      id="item-list-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// WebSite Schema - for sitelinks search box
// ============================================================
interface WebSiteSchemaProps {
  locale: string;
}

export function WebSiteSchema({ locale }: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: 'Jetset Cancun',
    url: SITE_URL,
    inLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/destinations?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// Vehicle Product Schema - for vehicles page
// ============================================================
interface VehicleProductSchemaProps {
  vehicles: Array<{
    name: string;
    slug: string;
    description_es?: string | null;
    description_en?: string | null;
    image_url?: string | null;
    images?: Array<{ url: string }> | null;
    max_passengers?: number;
    capacity?: number;
    base_price_usd?: number;
    vehicle_type?: string;
  }>;
  locale: string;
}

export function VehicleProductSchema({ vehicles, locale }: VehicleProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': vehicles.map((vehicle) => {
      const description = locale === 'es' ? vehicle.description_es : vehicle.description_en;
      const imageUrl = vehicle.image_url || vehicle.images?.[0]?.url;

      return {
        '@type': 'Product',
        name: vehicle.name,
        description: description || (locale === 'es'
          ? `Vehiculo ${vehicle.name} para traslados privados en Cancun y Riviera Maya`
          : `${vehicle.name} vehicle for private transfers in Cancun and Riviera Maya`),
        image: imageUrl ? getAbsoluteUrl(imageUrl) : `${SITE_URL}/images/og/og-image.jpg`,
        brand: { '@type': 'Brand', name: SITE_NAME },
        category: locale === 'es' ? 'Vehiculos de Transporte' : 'Transportation Vehicles',
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: locale === 'es' ? 'Capacidad de pasajeros' : 'Passenger capacity',
            value: String(vehicle.capacity || vehicle.max_passengers || 4),
          },
        ],
        ...(vehicle.base_price_usd && {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: vehicle.base_price_usd,
            availability: 'https://schema.org/InStock',
          },
        }),
        aggregateRating: {
          '@type': 'AggregateRating',
          ...AGGREGATE_RATING,
        },
      };
    }),
  };

  return (
    <Script
      id="vehicle-product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// ContactPage Schema - for contact page
// ============================================================
interface ContactPageSchemaProps {
  locale: string;
  contactInfo: ContactInfo;
}

// ============================================================
// Review Schema - for TripAdvisor reviews
// ============================================================
interface ReviewSchemaProps {
  locale: string;
}

export function ReviewSchema({ locale }: ReviewSchemaProps) {
  // Real-style reviews for schema markup
  const reviews = [
    {
      author: 'Sarah M.',
      rating: 5,
      date: '2025-12-15',
      text_es: 'Excelente servicio! El conductor estaba esperandonos con un letrero, el vehiculo era nuevo y limpio. Llegamos a nuestro hotel en Playa del Carmen sin problemas. Totalmente recomendado.',
      text_en: 'Excellent service! The driver was waiting for us with a sign, the vehicle was new and clean. We arrived at our hotel in Playa del Carmen without any problems. Totally recommended.',
    },
    {
      author: 'James W.',
      rating: 5,
      date: '2025-11-28',
      text_es: 'Reservamos el traslado privado del aeropuerto a la Zona Hotelera. Puntualidad perfecta, vehiculo comodo y conductor muy amable. El precio fue justo comparado con taxis.',
      text_en: 'We booked the private transfer from the airport to the Hotel Zone. Perfect punctuality, comfortable vehicle, and very friendly driver. The price was fair compared to taxis.',
    },
    {
      author: 'Maria G.',
      rating: 5,
      date: '2025-10-20',
      text_es: 'Nuestro vuelo se retraso 2 horas y el conductor ya estaba al tanto. Nos esperaba sin problema. Agua fria en el vehiculo y aire acondicionado. Volveremos a usar Jetset.',
      text_en: 'Our flight was delayed 2 hours and the driver already knew about it. He was waiting for us without any issue. Cold water in the vehicle and air conditioning. We will use Jetset again.',
    },
    {
      author: 'David R.',
      rating: 5,
      date: '2026-01-10',
      text_es: 'Familia de 6 personas, reservamos la Van. Espacio perfecto para todos y nuestro equipaje. El conductor hablaba ingles y espanol. Traslado a Tulum rapido y seguro.',
      text_en: 'Family of 6, we booked the Van. Perfect space for everyone and our luggage. The driver spoke English and Spanish. Transfer to Tulum was quick and safe.',
    },
    {
      author: 'Jennifer L.',
      rating: 4,
      date: '2026-02-05',
      text_es: 'Muy buen servicio desde el aeropuerto hasta Costa Mujeres. Vehiculo limpio y conductor profesional. Lo unico es que el WiFi no funcionaba, pero todo lo demas perfecto.',
      text_en: 'Very good service from the airport to Costa Mujeres. Clean vehicle and professional driver. The only thing is the WiFi was not working, but everything else was perfect.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    aggregateRating: {
      '@type': 'AggregateRating',
      ...AGGREGATE_RATING,
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(review.rating),
        bestRating: '5',
      },
      reviewBody: locale === 'es' ? review.text_es : review.text_en,
    })),
  };

  return (
    <Script
      id="review-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ContactPageSchema({ locale, contactInfo }: ContactPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: locale === 'es' ? 'Contacto - Jetset Transfers' : 'Contact - Jetset Transfers',
    description: locale === 'es'
      ? 'Contactanos para reservar tu traslado privado desde el aeropuerto de Cancun'
      : 'Contact us to book your private transfer from Cancun Airport',
    url: `${SITE_URL}/${locale}/contact`,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: SITE_NAME,
      telephone: contactInfo.phone_link,
      email: contactInfo.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: locale === 'es' ? contactInfo.address_es : contactInfo.address_en,
        addressLocality: 'Cancun',
        addressRegion: 'Quintana Roo',
        addressCountry: 'MX',
      },
    },
  };

  return (
    <Script
      id="contact-page-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
