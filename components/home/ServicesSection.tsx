'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {
  TruckIcon,
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

interface ServicesSectionProps {
  locale: string;
  destinations: Destination[];
  zones: Zone[];
}

const MAX_ITEMS = 3;

export default function ServicesSection({ locale, destinations, zones }: ServicesSectionProps) {
  const t = useTranslations('services');
  const { formatPrice } = useCurrency();

  // Safely slice arrays with fallback to empty array
  const displayedDestinations = (destinations || []).slice(0, MAX_ITEMS);
  const displayedZones = (zones || []).slice(0, MAX_ITEMS);

  const hasMoreDestinations = (destinations || []).length > MAX_ITEMS;
  const hasMoreZones = (zones || []).length > MAX_ITEMS;

  return (
    <section id="services" className="py-20 md:py-28 bg-gradient-to-b from-transparent via-navy-50/30 to-transparent dark:via-navy-900/20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 mb-4">
            {locale === 'es' ? 'Traslados Seguros' : 'Safe Transfers'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            {t('title')}
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column - Popular Destinations */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-navy-100 dark:bg-navy-800">
                <MapPinIcon className="w-6 h-6 text-navy-600 dark:text-navy-300" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{t('private.title')}</h3>
                <p className="text-sm text-muted">{t('private.subtitle')}</p>
              </div>
            </div>

            {/* Destinations Cards */}
            <div className="space-y-4">
              {displayedDestinations.length > 0 ? (
                displayedDestinations.map((dest) => (
                  <Link
                    key={dest.id}
                    href={`/${locale}/destinations/${dest.slug}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 hover:border-navy-400 dark:hover:border-navy-500 hover:shadow-lg hover:shadow-navy-100 dark:hover:shadow-navy-900/50 transition-all duration-300">
                      <div className="flex">
                        {/* Image */}
                        <div className="relative w-24 sm:w-32 flex-shrink-0">
                          <div className="aspect-square sm:aspect-[4/3] relative">
                            {dest.image_url ? (
                              <Image
                                src={dest.image_url}
                                alt={locale === 'es'
                                  ? `Traslado a ${dest.name_es} - Jetset Transfers`
                                  : `Transfer to ${dest.name_en} - Jetset Transfers`}
                                fill
                                sizes="(max-width: 640px) 96px, 128px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                                <MapPinIcon className="w-8 h-8 text-navy-300 dark:text-navy-600" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg truncate group-hover:text-navy-600 dark:group-hover:text-navy-300 transition-colors mb-1">
                            {locale === 'es' ? dest.name_es : dest.name_en}
                          </h4>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted">
                              <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>{dest.travel_time || '-'}</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-bold text-sm sm:text-base text-navy-600 dark:text-navy-400">
                                {dest.price_from ? formatPrice(dest.price_from) : '-'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Arrow indicator - hidden on small mobile */}
                        <div className="hidden sm:flex items-center pr-3">
                          <div className="w-8 h-8 rounded-full bg-navy-100 dark:bg-navy-800 flex items-center justify-center group-hover:bg-navy-600 dark:group-hover:bg-navy-600 transition-colors">
                            <ArrowRightIcon className="w-4 h-4 text-navy-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 text-muted rounded-2xl border border-dashed border-navy-200 dark:border-navy-700">
                  {locale === 'es' ? 'Próximamente destinos disponibles' : 'Destinations coming soon'}
                </div>
              )}
            </div>

            {/* Destinations CTA */}
            <Link
              href={`/${locale}/destinations`}
              className="group flex items-center justify-center gap-2 w-full mt-6 py-4 text-sm font-semibold text-navy-700 dark:text-navy-200 bg-navy-100 dark:bg-navy-800 hover:bg-navy-600 hover:text-white dark:hover:bg-navy-600 rounded-xl transition-all duration-300"
            >
              {hasMoreDestinations
                ? (locale === 'es' ? `Ver los ${destinations.length} destinos` : `View all ${destinations.length} destinations`)
                : t('private.viewAll')
              }
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column - Zones */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900/50">
                <TruckIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{locale === 'es' ? 'Zonas de Servicio' : 'Service Areas'}</h3>
                <p className="text-sm text-muted">{locale === 'es' ? 'Cobertura en toda la Riviera Maya' : 'Coverage across the Riviera Maya'}</p>
              </div>
            </div>

            {/* Zones Cards */}
            <div className="space-y-4">
              {displayedZones.length > 0 ? (
                displayedZones.map((zone) => (
                  <Link
                    key={zone.id}
                    href={`/${locale}/destinations?zone=${zone.slug}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-navy-900 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-lg hover:shadow-brand-100 dark:hover:shadow-brand-900/30 transition-all duration-300">
                      <div className="flex">
                        {/* Image */}
                        <div className="relative w-24 sm:w-32 flex-shrink-0">
                          <div className="aspect-square sm:aspect-[4/3] relative">
                            {zone.image_url ? (
                              <Image
                                src={zone.image_url}
                                alt={locale === 'es'
                                  ? `Traslados a ${zone.name_es} - Jetset Transfers`
                                  : `Transfers to ${zone.name_en} - Jetset Transfers`}
                                fill
                                sizes="(max-width: 640px) 96px, 128px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
                                <TruckIcon className="w-8 h-8 text-brand-300 dark:text-brand-700" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                            {locale === 'es' ? zone.name_es : zone.name_en}
                          </h4>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted">
                              <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>{zone.travel_time || '-'}</span>
                            </div>
                            {zone.distance_km && (
                              <div className="text-right flex-shrink-0">
                                <div className="text-sm text-muted">
                                  {zone.distance_km} km
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Arrow indicator - hidden on small mobile */}
                        <div className="hidden sm:flex items-center pr-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                            <ArrowRightIcon className="w-4 h-4 text-brand-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 text-muted rounded-2xl border border-dashed border-brand-200 dark:border-brand-800">
                  {locale === 'es' ? 'Próximamente zonas disponibles' : 'Service areas coming soon'}
                </div>
              )}
            </div>

            {/* Zones CTA */}
            <Link
              href={`/${locale}/destinations`}
              className="group flex items-center justify-center gap-2 w-full mt-6 py-4 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all duration-300"
            >
              {hasMoreZones
                ? (locale === 'es' ? `Ver las ${zones.length} zonas` : `View all ${zones.length} areas`)
                : (locale === 'es' ? 'Ver todas las zonas' : 'View all areas')
              }
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 md:mt-20 p-8 rounded-3xl bg-gradient-to-r from-navy-900 to-navy-800 dark:from-navy-800 dark:to-navy-900 border border-navy-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-white mb-2">{t('custom.title')}</h4>
              <p className="text-navy-300">{t('custom.description')}</p>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="group flex items-center gap-2 px-8 py-4 bg-white text-navy-900 font-semibold rounded-xl hover:bg-brand-500 hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              {t('custom.cta')}
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
