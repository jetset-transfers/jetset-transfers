// Destination zones/categories for filtering

export interface Zone {
  key: string;
  name_es: string;
  name_en: string;
  description_es?: string;
  description_en?: string;
  icon?: string;
}

export const ZONES: Zone[] = [
  {
    key: 'hotel-zone',
    name_es: 'Zona Hotelera',
    name_en: 'Hotel Zone',
    description_es: 'Hoteles en la zona hotelera de Cancún',
    description_en: 'Hotels in Cancun Hotel Zone',
    icon: 'MapPinIcon',
  },
  {
    key: 'playa-carmen',
    name_es: 'Playa del Carmen',
    name_en: 'Playa del Carmen',
    description_es: 'Hoteles y destinos en Playa del Carmen',
    description_en: 'Hotels and destinations in Playa del Carmen',
    icon: 'MapPinIcon',
  },
  {
    key: 'tulum',
    name_es: 'Tulum',
    name_en: 'Tulum',
    description_es: 'Hoteles y destinos en Tulum',
    description_en: 'Hotels and destinations in Tulum',
    icon: 'MapPinIcon',
  },
  {
    key: 'theme-parks',
    name_es: 'Parques Temáticos',
    name_en: 'Theme Parks',
    description_es: 'Parques como Xel-Há, Xcaret, Xplor',
    description_en: 'Parks like Xel-Há, Xcaret, Xplor',
    icon: 'SparklesIcon',
  },
  {
    key: 'puerto-morelos',
    name_es: 'Puerto Morelos',
    name_en: 'Puerto Morelos',
    description_es: 'Hoteles en Puerto Morelos',
    description_en: 'Hotels in Puerto Morelos',
    icon: 'MapPinIcon',
  },
  {
    key: 'puerto-aventuras',
    name_es: 'Puerto Aventuras',
    name_en: 'Puerto Aventuras',
    description_es: 'Hoteles en Puerto Aventuras',
    description_en: 'Hotels in Puerto Aventuras',
    icon: 'MapPinIcon',
  },
  {
    key: 'akumal',
    name_es: 'Akumal',
    name_en: 'Akumal',
    description_es: 'Hoteles en Akumal',
    description_en: 'Hotels in Akumal',
    icon: 'MapPinIcon',
  },
  {
    key: 'other',
    name_es: 'Otros Destinos',
    name_en: 'Other Destinations',
    description_es: 'Otros destinos en la Riviera Maya',
    description_en: 'Other destinations in Riviera Maya',
    icon: 'MapPinIcon',
  },
];

export function getZoneByKey(key: string): Zone | undefined {
  return ZONES.find(zone => zone.key === key);
}

export function getZoneName(key: string, locale: string): string {
  const zone = getZoneByKey(key);
  if (!zone) return key;
  return locale === 'es' ? zone.name_es : zone.name_en;
}
