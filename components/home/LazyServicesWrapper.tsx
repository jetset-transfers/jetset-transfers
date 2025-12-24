'use client';

import LazySection from '@/components/ui/LazySection';
import ServicesSection from './ServicesSection';

interface Destination {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  travel_time: string | null;
  price_from: number | null;
  image_url: string | null;
}

interface Zone {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  travel_time: string | null;
  distance_km: number | null;
  image_url: string | null;
}

interface LazyServicesWrapperProps {
  locale: string;
  destinations: Destination[];
  zones: Zone[];
}

export default function LazyServicesWrapper({ locale, destinations, zones }: LazyServicesWrapperProps) {
  return (
    <LazySection
      animation="slide-up"
      delay={100}
      className="transition-all duration-700"
    >
      <ServicesSection
        locale={locale}
        destinations={destinations || []}
        zones={zones || []}
      />
    </LazySection>
  );
}
