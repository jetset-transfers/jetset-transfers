'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  max_passengers: number;
  max_luggage: number;
  description_es: string | null;
  description_en: string | null;
  features: string[];
  images: string[];
  is_active: boolean;
  display_order: number;
}

interface FleetSectionProps {
  locale: string;
  vehicles: Vehicle[];
}

export default function FleetSection({ locale, vehicles }: FleetSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Fallback data if no vehicles in database
  const fallbackVehicles = [
    {
      id: 'fallback-1',
      name: 'Suburban / Escalade',
      category: 'SUV',
      max_passengers: 6,
      max_luggage: 6,
      description_es: 'SUV de lujo ideal para familias pequeñas o parejas con equipaje.',
      description_en: 'Luxury SUV ideal for small families or couples with luggage.',
      features: locale === 'es'
        ? ['Aire acondicionado', 'Asientos de cuero', 'Wi-Fi gratis']
        : ['Air conditioning', 'Leather seats', 'Free Wi-Fi'],
      images: ['data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23334155;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231e293b;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23g)"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial,sans-serif" font-size="24" fill="%23cbd5e1" text-anchor="middle" dominant-baseline="middle"%3EVeh%C3%ADculo%3C/text%3E%3C/svg%3E'],
      is_active: true,
      display_order: 0,
    },
  ];

  const displayVehicles = vehicles.length > 0 ? vehicles : fallbackVehicles;
  const currentVehicle = displayVehicles[activeTab] || displayVehicles[0];

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-navy-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 mb-4">
            {locale === 'es' ? 'Nuestra Flota' : 'Our Fleet'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
            {locale === 'es' ? 'Vehículos Modernos y Cómodos' : 'Modern and Comfortable Vehicles'}
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Contamos con una flota diversa de vehículos para adaptarnos a las necesidades de tu grupo'
              : 'We have a diverse fleet of vehicles to adapt to your group\'s needs'}
          </p>
        </div>

        {/* Tabs */}
        {displayVehicles.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {displayVehicles.map((vehicle, index) => (
              <button
                key={vehicle.id}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-brand-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-navy-950 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 border border-gray-200 dark:border-navy-800'
                }`}
              >
                {vehicle.category || vehicle.name.split(' ')[0] || 'Vehicle'}
              </button>
            ))}
          </div>
        )}

        {/* Vehicle Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden bg-gray-200 dark:bg-navy-800 shadow-2xl">
              {currentVehicle.images && currentVehicle.images.length > 0 ? (
                <Image
                  src={currentVehicle.images[0]}
                  alt={currentVehicle.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={activeTab === 0}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 dark:from-gray-700 to-gray-400 dark:to-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xl">
                    {locale === 'es' ? 'Sin imagen' : 'No image'}
                  </span>
                </div>
              )}
              {/* Overlay Badge */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                <div className="text-sm font-bold text-brand-600">
                  {currentVehicle.category || currentVehicle.name.split(' ')[0] || 'Vehicle'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {currentVehicle.name}
            </h3>

            {/* Description */}
            {currentVehicle.description_es && currentVehicle.description_en && (
              <p className="text-muted mb-6">
                {locale === 'es' ? currentVehicle.description_es : currentVehicle.description_en}
              </p>
            )}

            {/* Capacity */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-800">
                <div className="flex items-center gap-2 mb-1">
                  <UserGroupIcon className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-medium text-muted">
                    {locale === 'es' ? 'Capacidad' : 'Capacity'}
                  </span>
                </div>
                <div className="text-xl font-bold">
                  {currentVehicle.max_passengers} {locale === 'es' ? 'pasajeros' : 'passengers'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-800">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheckIcon className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-medium text-muted">
                    {locale === 'es' ? 'Equipaje' : 'Luggage'}
                  </span>
                </div>
                <div className="text-xl font-bold">
                  {currentVehicle.max_luggage} {locale === 'es' ? 'maletas' : 'suitcases'}
                </div>
              </div>
            </div>

            {/* Features */}
            {currentVehicle.features && currentVehicle.features.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">
                  {locale === 'es' ? 'Características' : 'Features'}
                </h4>
                <div className="space-y-3">
                  {currentVehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <StarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/${locale}/vehicles`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {locale === 'es' ? 'Ver toda la flota' : 'View full fleet'}
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
