'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TruckIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { trackViewItemList } from '@/lib/analytics';
import LazySection from '@/components/ui/LazySection';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  luggage_capacity: number;
  description_es: string;
  description_en: string;
  features: string[];
  images: string[];
  display_order: number;
  is_active: boolean;
}

interface VehiclesContentProps {
  locale: string;
  vehicles: Vehicle[];
}

const translations = {
  es: {
    title: 'Nuestra Flota',
    subtitle: 'Vehículos modernos, cómodos y seguros para tu traslado',
    description: 'Contamos con una flota de vehículos de última generación, equipados con aire acondicionado, asientos cómodos y todo lo necesario para que tu viaje sea placentero.',
    backToHome: 'Volver al inicio',
    passengers: 'pasajeros',
    luggage: 'maletas',
    features: 'Características',
    noVehicles: 'No hay vehículos disponibles',
    ctaTitle: '¿Listo para reservar tu traslado?',
    ctaDesc: 'Contáctanos ahora y obtén una cotización personalizada para tu viaje',
    contactUs: 'Contáctanos',
    upTo: 'Hasta',
  },
  en: {
    title: 'Our Fleet',
    subtitle: 'Modern, comfortable and safe vehicles for your transfer',
    description: 'We have a fleet of latest generation vehicles, equipped with air conditioning, comfortable seats and everything you need to make your trip pleasant.',
    backToHome: 'Back to home',
    passengers: 'passengers',
    luggage: 'luggage',
    features: 'Features',
    noVehicles: 'No vehicles available',
    ctaTitle: 'Ready to book your transfer?',
    ctaDesc: 'Contact us now and get a personalized quote for your trip',
    contactUs: 'Contact us',
    upTo: 'Up to',
  },
};

const VEHICLE_TYPE_LABELS = {
  sedan: { es: 'Sedán', en: 'Sedan' },
  suv: { es: 'SUV', en: 'SUV' },
  van: { es: 'Van', en: 'Van' },
  sprinter: { es: 'Sprinter', en: 'Sprinter' },
  luxury: { es: 'Lujo', en: 'Luxury' },
};

export default function VehiclesContent({ locale, vehicles }: VehiclesContentProps) {
  const t = translations[locale as keyof typeof translations] || translations.es;

  // Track view_item_list event when page loads
  useEffect(() => {
    trackViewItemList('vehicles', vehicles.length);
  }, [vehicles.length]);

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-navy-50 to-white dark:from-navy-950 dark:to-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy-600 dark:hover:text-navy-300 transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {t.backToHome}
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-navy-100 dark:bg-navy-800">
              <TruckIcon className="w-8 h-8 text-navy-600 dark:text-navy-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{t.title}</h1>
              <p className="text-lg text-muted mt-2">{t.subtitle}</p>
            </div>
          </div>

          <p className="text-muted max-w-3xl">
            {t.description}
          </p>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {vehicles.map((vehicle, index) => {
              const typeLabel = VEHICLE_TYPE_LABELS[vehicle.type as keyof typeof VEHICLE_TYPE_LABELS];
              const displayType = typeLabel ? typeLabel[locale as keyof typeof typeLabel] : vehicle.type;
              const description = locale === 'es' ? vehicle.description_es : vehicle.description_en;
              const mainImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null;

              return (
                <LazySection
                  key={vehicle.id}
                  animation="slide-up"
                  delay={index * 100}
                >
                  <article className="h-full bg-white dark:bg-navy-900 rounded-3xl border border-navy-200 dark:border-navy-700 overflow-hidden hover:border-navy-400 dark:hover:border-navy-500 hover:shadow-xl hover:shadow-navy-100 dark:hover:shadow-navy-900/50 transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={`${vehicle.name} - Jetset Transfers`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                          <TruckIcon className="w-16 h-16 text-navy-300 dark:text-navy-600" />
                        </div>
                      )}
                      {/* Type badge */}
                      <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/95 dark:bg-navy-900/95 backdrop-blur-sm shadow-lg">
                        <div className="font-bold text-sm text-navy-600 dark:text-navy-400 capitalize">
                          {displayType}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3">
                        {vehicle.name}
                      </h3>

                      {description && (
                        <p className="text-muted mb-6 line-clamp-3">
                          {description}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="flex items-center gap-6 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-muted">
                          <UserGroupIcon className="w-5 h-5 text-navy-400" />
                          <span className="font-medium">{t.upTo} {vehicle.capacity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted">
                          <ShoppingBagIcon className="w-5 h-5 text-navy-400" />
                          <span className="font-medium">{vehicle.luggage_capacity} {t.luggage}</span>
                        </div>
                      </div>

                      {/* Features */}
                      {vehicle.features && vehicle.features.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-navy-600 dark:text-navy-400">
                            {t.features}
                          </h4>
                          <ul className="space-y-1">
                            {vehicle.features.slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted">
                                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </article>
                </LazySection>
              );
            })}
          </div>

          {vehicles.length === 0 && (
            <div className="text-center py-20">
              <TruckIcon className="w-16 h-16 text-navy-300 dark:text-navy-600 mx-auto mb-4" />
              <p className="text-xl text-muted">
                {t.noVehicles}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <LazySection animation="fade" className="py-16 md:py-20 bg-gradient-to-r from-navy-900 to-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            {t.ctaTitle}
          </h2>
          <p className="text-lg text-navy-300 mb-8">
            {t.ctaDesc}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 font-bold rounded-xl hover:bg-brand-500 hover:text-white transition-all duration-300"
          >
            {t.contactUs}
          </Link>
        </div>
      </LazySection>
    </main>
  );
}
