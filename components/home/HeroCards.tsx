'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ClockIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  FireIcon,
} from '@heroicons/react/24/solid';
import { useCurrency } from '@/contexts/CurrencyContext';

interface FeaturedItem {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  price_from: number | null;
  duration: string | null;
  image_url: string | null;
}

interface HeroCardsProps {
  locale: string;
  featuredTour?: FeaturedItem | null;
  featuredDestination?: FeaturedItem | null;
  hasPopularData?: boolean;
}

// Simulated recent bookings for social proof
const recentBookings = {
  es: [
    { name: 'María', city: 'CDMX', service: 'Traslado a Playa del Carmen', time: 'hace 2 horas' },
    { name: 'Carlos', city: 'Guadalajara', service: 'Traslado a Tulum', time: 'hace 4 horas' },
    { name: 'Ana', city: 'Monterrey', service: 'Traslado Hotel Zone', time: 'hace 6 horas' },
    { name: 'Roberto', city: 'Puebla', service: 'Traslado a Puerto Morelos', time: 'ayer' },
  ],
  en: [
    { name: 'John', city: 'Texas', service: 'Transfer to Playa del Carmen', time: '2 hours ago' },
    { name: 'Sarah', city: 'California', service: 'Transfer to Tulum', time: '4 hours ago' },
    { name: 'Mike', city: 'New York', service: 'Transfer Hotel Zone', time: '6 hours ago' },
    { name: 'Emily', city: 'Florida', service: 'Transfer to Puerto Morelos', time: 'yesterday' },
  ],
};

const translations = {
  es: {
    featured: 'Destacado',
    popular: 'Más Popular',
    from: 'Desde',
    bookNow: 'Reservar',
    viewMore: 'Ver más',
    spotsLeft: 'lugares disponibles hoy',
    socialProof: 'reservó',
    certified: 'Operador Certificado',
    certifiedDesc: 'TAI & TAN',
    availableToday: 'Disponible hoy',
  },
  en: {
    featured: 'Featured',
    popular: 'Most Popular',
    from: 'From',
    bookNow: 'Book Now',
    viewMore: 'View more',
    spotsLeft: 'spots available today',
    socialProof: 'booked',
    certified: 'Certified Operator',
    certifiedDesc: 'TAI & TAN',
    availableToday: 'Available today',
  },
};

export default function HeroCards({ locale, featuredTour, featuredDestination, hasPopularData }: HeroCardsProps) {
  const t = translations[locale as keyof typeof translations] || translations.es;
  const bookings = recentBookings[locale as keyof typeof recentBookings] || recentBookings.es;
  const { formatPrice } = useCurrency();

  // Rotate through social proof messages
  const [currentBooking, setCurrentBooking] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Delay animation start to not affect LCP
  useEffect(() => {
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentBooking((prev) => (prev + 1) % bookings.length);
          setIsVisible(true);
        }, 300);
      }, 4000);

      return () => clearInterval(interval);
    }, 3000); // Wait 3s before starting animations

    return () => clearTimeout(startDelay);
  }, [bookings.length]);

  // Use featured destination
  const featured = featuredDestination || featuredTour;
  const featuredType = locale === 'es' ? 'destinos' : 'destinations';
  const featuredName = featured
    ? (locale === 'es' ? featured.name_es : featured.name_en)
    : null;

  return (
    <div className="grid gap-3">
      {/* Featured Destination Card */}
      {featured && (
        <Link
          href={`/${locale}/${featuredType}/${featured.slug}`}
          className="group card p-0 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white dark:bg-navy-900"
        >
          <div className="relative">
            {/* Image - Fixed aspect ratio to prevent CLS */}
            <div className="relative aspect-[16/9] overflow-hidden">
              {featured.image_url ? (
                <Image
                  src={featured.image_url}
                  alt={featuredName || (locale === 'es' ? 'Destino destacado - Jetset Transfers' : 'Featured destination - Jetset Transfers')}
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEQA/ANF6Y1a+1DTnku0jRo5WjXaOGIGcH+0v11ySJM7dZllY/piilJ9Fs/o//9k="
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Badge - shows "Most Popular" if based on real data, "Featured" otherwise */}
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-brand-600 text-white text-xs font-medium">
                <FireIcon className="w-3 h-3" />
                {hasPopularData ? t.popular : t.featured}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-brand-600 transition-colors">
                    {featuredName}
                  </h3>
                  {featured.duration && (
                    <div className="flex items-center gap-1 text-sm text-muted mt-1">
                      <ClockIcon className="w-4 h-4" />
                      {featured.duration}
                    </div>
                  )}
                </div>
                {featured.price_from && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-muted">{t.from}</div>
                    <div className="font-bold text-brand-600">
                      {formatPrice(featured.price_from)}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-brand-600 font-medium group-hover:underline">
                  {t.viewMore} →
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Social Proof Card - Rotating - Fixed height to prevent CLS */}
      <div className="rounded-2xl p-4 overflow-hidden bg-white/90 dark:bg-white/[0.15] backdrop-blur-lg border border-white/30 shadow-lg h-[76px]">
        <div
          className={`flex items-center gap-3 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        >
          <div className="w-11 h-11 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <UserGroupIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              <span className="font-semibold">{bookings[currentBooking].name}</span>
              <span className="text-gray-600 dark:text-gray-200"> de {bookings[currentBooking].city}</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {t.socialProof} <span className="text-brand-600 dark:text-brand-300 font-medium">{bookings[currentBooking].service}</span> · {bookings[currentBooking].time}
            </div>
          </div>
        </div>
      </div>

      {/* Certification Badge - Links to TripAdvisor */}
      <a
        href="https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl p-4 bg-white/90 dark:bg-white/[0.15] backdrop-blur-lg border border-white/30 hover:bg-white dark:hover:bg-white/[0.25] hover:shadow-xl transition-all cursor-pointer group shadow-lg"
        aria-label="Ver certificaciones en TripAdvisor"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{t.certified}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">{t.certifiedDesc}</div>
          </div>
        </div>
      </a>

      {/* TripAdvisor Rating Widget - Direct link, no wrapper */}
      <a
        href="https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl p-4 bg-white/90 dark:bg-white/[0.15] backdrop-blur-lg border border-white/30 hover:bg-white dark:hover:bg-white/[0.25] transition-all cursor-pointer group shadow-lg"
        aria-label="Ver reseñas en TripAdvisor"
      >
        {/* TripAdvisor owl icon - white background in both modes */}
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
          <svg className="w-6 h-6 text-[#00AA6C]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-3c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3zm-4-1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm8 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM12 6c2.76 0 5 2.24 5 5h-2c0-1.65-1.35-3-3-3s-3 1.35-3 3H7c0-2.76 2.24-5 5-5z"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-[#00AA6C]"
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {locale === 'es' ? '9 reseñas' : '9 reviews'}
          </span>
        </div>
      </a>
    </div>
  );
}
