// Destination zones/categories for filtering
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Zone {
  key: string;
  name_es: string;
  name_en: string;
  description_es?: string;
  description_en?: string;
  icon?: string;
}

// Default zones (used as fallback)
export const DEFAULT_ZONES: Zone[] = [
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

// Legacy export for backwards compatibility
export const ZONES = DEFAULT_ZONES;

/**
 * Get zones from database with fallback to DEFAULT_ZONES
 * Server component only - requires Supabase client to be passed
 */
export async function getZones(supabase: SupabaseClient): Promise<Zone[]> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'destination_zones')
      .single();

    if (error) {
      // No zones in database, use defaults
      return DEFAULT_ZONES;
    }

    if (data?.value) {
      const zones = JSON.parse(data.value) as Zone[];
      return zones;
    }
  } catch (err) {
    console.error('[getZones] Error loading zones from database:', err);
  }

  // Fallback to default zones
  return DEFAULT_ZONES;
}

export function getZoneByKey(key: string, zones: Zone[] = DEFAULT_ZONES): Zone | undefined {
  return zones.find(zone => zone.key === key);
}

export function getZoneName(key: string, locale: string, zones: Zone[] = DEFAULT_ZONES): string {
  const zone = getZoneByKey(key, zones);
  if (!zone) return key;
  return locale === 'es' ? zone.name_es : zone.name_en;
}
