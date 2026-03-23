import { SupabaseClient } from '@supabase/supabase-js';

export interface ContactInfo {
  phone: string;
  phone_link: string;
  email: string;
  address_es: string;
  address_en: string;
  hours_es: string;
  hours_en: string;
  whatsapp_number: string;
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  tripadvisor_url?: string;
}

const DEFAULT_CONTACT: ContactInfo = {
  phone: '+52 998 740 7149',
  phone_link: '+529987407149',
  email: 'transportesjetset@gmail.com',
  address_es: 'Aeropuerto Internacional de Cancun, Terminal FBO, Cancun, Q.R., Mexico',
  address_en: 'Cancun International Airport, FBO Terminal, Cancun, Q.R., Mexico',
  hours_es: 'Lunes a Domingo: 24 horas',
  hours_en: 'Monday to Sunday: 24 hours',
  whatsapp_number: '529987407149',
  tripadvisor_url: 'https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html',
};

export async function getContactInfo(supabase: SupabaseClient): Promise<ContactInfo> {
  try {
    const { data } = await supabase
      .from('contact_info')
      .select('*')
      .single();

    if (!data) return DEFAULT_CONTACT;

    const phones = data.phones && Array.isArray(data.phones) && data.phones.length > 0
      ? data.phones
      : [{ display: data.phone, link: data.phone_link }];

    return {
      phone: phones[0]?.display || DEFAULT_CONTACT.phone,
      phone_link: phones[0]?.link || DEFAULT_CONTACT.phone_link,
      email: data.email || DEFAULT_CONTACT.email,
      address_es: data.address_es || DEFAULT_CONTACT.address_es,
      address_en: data.address_en || DEFAULT_CONTACT.address_en,
      hours_es: data.hours_es || DEFAULT_CONTACT.hours_es,
      hours_en: data.hours_en || DEFAULT_CONTACT.hours_en,
      whatsapp_number: data.whatsapp_number || DEFAULT_CONTACT.whatsapp_number,
      facebook_url: data.facebook_url || undefined,
      instagram_url: data.instagram_url || undefined,
      tiktok_url: data.tiktok_url || undefined,
      tripadvisor_url: data.tripadvisor_url || DEFAULT_CONTACT.tripadvisor_url,
    };
  } catch {
    return DEFAULT_CONTACT;
  }
}

export const SITE_URL = 'https://www.jetsetcancun.com';
export const SITE_NAME = 'Jetset Transfers';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og/og-image.jpg`;
export const LOGO_URL = `${SITE_URL}/images/logo/logo-jetset.webp`;
export const TRIPADVISOR_URL = 'https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html';

// Consistent rating data across all schemas
export const AGGREGATE_RATING = {
  ratingValue: '4.9',
  reviewCount: '150',
  bestRating: '5',
};
