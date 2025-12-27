'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface FleetSectionProps {
  locale: string;
}

export default function FleetSection({ locale }: FleetSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = {
    es: ['SUV', 'Van', 'Sprinter', 'Premium'],
    en: ['SUV', 'Van', 'Sprinter', 'Premium'],
  };

  const vehicles = {
    es: [
      {
        type: 'SUV',
        name: 'Suburban / Escalade',
        capacity: '6 pasajeros',
        luggage: '6 maletas',
        features: ['Aire acondicionado', 'Asientos de cuero', 'Wi-Fi gratis'],
        image: '/images/hero/hero-aerial-cancun.jpg',
      },
      {
        type: 'Van',
        name: 'Crafter / Transporter',
        capacity: '10 pasajeros',
        luggage: '10 maletas',
        features: ['Aire acondicionado', 'Asientos cómodos', 'Amplio espacio'],
        image: '/images/hero/hero-aerial-cancun.jpg',
      },
      {
        type: 'Sprinter',
        name: 'Mercedes Sprinter',
        capacity: '14 pasajeros',
        luggage: '14 maletas',
        features: ['Máximo confort', 'Aire acondicionado', 'TV y audio'],
        image: '/images/hero/hero-aerial-cancun.jpg',
      },
      {
        type: 'Premium',
        name: 'Vehículos de Lujo',
        capacity: '4 pasajeros',
        luggage: '4 maletas',
        features: ['Servicio VIP', 'Bebidas incluidas', 'Conductor bilingüe'],
        image: '/images/hero/hero-aerial-cancun.jpg',
      },
    ],
    en: [
      {
        type: 'SUV',
        name: 'Suburban / Escalade',
        capacity: '6 passengers',
        luggage: '6 suitcases',
        features: ['Air conditioning', 'Leather seats', 'Free Wi-Fi'],
        image: '/images/hero/hero-aerial-cancun.jpg',
      },
      {
        type: 'Van',
        name: 'Crafter / Transporter',
        capacity: '10 passengers',
        luggage: '10 suitcases',
        features: ['Air conditioning', 'Comfortable seats', 'Ample space'],
        image: '/images/hero/hero-aerial-cancun.jpg',
      },
      {
        type: 'Sprinter',
        name: 'Mercedes Sprinter',
        capacity: '14 passengers',
        luggage: '14 suitcases',
        features: ['Maximum comfort', 'Air conditioning', 'TV and audio'],
        image: '/images/hero/hero-aerial-cancun.jpg',
      },
      {
        type: 'Premium',
        name: 'Luxury Vehicles',
        capacity: '4 passengers',
        luggage: '4 suitcases',
        features: ['VIP service', 'Drinks included', 'Bilingual driver'],
        image: '/images/hero/hero-aerial-cancun.jpg',
      },
    ],
  };

  const currentVehicles = vehicles[locale as keyof typeof vehicles] || vehicles.es;
  const currentTabs = tabs[locale as keyof typeof tabs] || tabs.es;
  const currentVehicle = currentVehicles[activeTab];

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
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {currentTabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === index
                  ? 'bg-brand-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-navy-950 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 border border-gray-200 dark:border-navy-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Vehicle Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden bg-gray-200 dark:bg-navy-800 shadow-2xl">
              <Image
                src={currentVehicle.image}
                alt={currentVehicle.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority={activeTab === 0}
              />
              {/* Overlay Badge */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                <div className="text-sm font-bold text-brand-600">{currentVehicle.type}</div>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {currentVehicle.name}
            </h3>

            {/* Capacity */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-800">
                <div className="flex items-center gap-2 mb-1">
                  <UserGroupIcon className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-medium text-muted">
                    {locale === 'es' ? 'Capacidad' : 'Capacity'}
                  </span>
                </div>
                <div className="text-xl font-bold">{currentVehicle.capacity}</div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-800">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheckIcon className="w-5 h-5 text-brand-600" />
                  <span className="text-sm font-medium text-muted">
                    {locale === 'es' ? 'Equipaje' : 'Luggage'}
                  </span>
                </div>
                <div className="text-xl font-bold">{currentVehicle.luggage}</div>
              </div>
            </div>

            {/* Features */}
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
