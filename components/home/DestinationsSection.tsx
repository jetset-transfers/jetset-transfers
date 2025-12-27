'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useCurrency } from '@/contexts/CurrencyContext';

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

interface DestinationsSectionProps {
  locale: string;
  destinations: Destination[];
}

const MAX_ITEMS = 6;

export default function DestinationsSection({ locale, destinations }: DestinationsSectionProps) {
  const t = useTranslations('services');
  const { formatPrice } = useCurrency();

  // Safely slice arrays with fallback to empty array
  const displayedDestinations = (destinations || []).slice(0, MAX_ITEMS);
  const hasMoreDestinations = (destinations || []).length > MAX_ITEMS;

  return (
    <section id="services" className="py-20 md:py-28 bg-white dark:bg-navy-950 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 mb-4">
            {locale === 'es' ? 'Destinos Populares' : 'Popular Destinations'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            {t('title')}
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Three Column Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {displayedDestinations.length > 0 ? (
            displayedDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/${locale}/destinations/${dest.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 hover:border-brand-500 dark:hover:border-brand-600 hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    {dest.image_url ? (
                      <Image
                        src={dest.image_url}
                        alt={locale === 'es'
                          ? `Traslado a ${dest.name_es} - Jetset Transfers`
                          : `Transfer to ${dest.name_en} - Jetset Transfers`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-800 dark:to-navy-900 flex items-center justify-center">
                        <MapPinIcon className="w-16 h-16 text-navy-300 dark:text-navy-600" />
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Price Badge */}
                    {dest.price_from && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                        <div className="text-xs text-gray-600 font-medium">
                          {locale === 'es' ? 'Desde' : 'From'}
                        </div>
                        <div className="text-lg font-bold text-brand-600">
                          {formatPrice(dest.price_from)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-600 transition-colors">
                      {locale === 'es' ? dest.name_es : dest.name_en}
                    </h3>

                    {dest.description_es && (
                      <p className="text-sm text-muted mb-4 line-clamp-2">
                        {locale === 'es' ? dest.description_es : dest.description_en}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {dest.travel_time && (
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <ClockIcon className="w-4 h-4" />
                          <span>{dest.travel_time}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
                        <span>{locale === 'es' ? 'Ver más' : 'View more'}</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted rounded-2xl border border-dashed border-gray-200 dark:border-navy-700">
              {locale === 'es' ? 'Próximamente destinos disponibles' : 'Destinations coming soon'}
            </div>
          )}
        </div>

        {/* View All Button */}
        {displayedDestinations.length > 0 && (
          <div className="text-center">
            <Link
              href={`/${locale}/destinations`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {hasMoreDestinations
                ? (locale === 'es' ? `Ver los ${destinations.length} destinos` : `View all ${destinations.length} destinations`)
                : t('private.viewAll')
              }
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 md:mt-20 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-navy-900 to-navy-800 dark:from-navy-800 dark:to-navy-900 border border-navy-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold text-white mb-2">{t('custom.title')}</h4>
              <p className="text-navy-300 text-lg">{t('custom.description')}</p>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="group flex items-center gap-2 px-8 py-4 bg-white text-navy-900 font-semibold rounded-xl hover:bg-brand-500 hover:text-white transition-all duration-300 whitespace-nowrap shadow-lg"
            >
              {t('custom.cta')}
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
