'use client';

import { useTranslations } from 'next-intl';
import {
  CheckCircleIcon,
  GlobeAmericasIcon,
  RocketLaunchIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function CharterFlightsSection() {
  const t = useTranslations('charterFlights');

  const features = [
    {
      icon: CheckCircleIcon,
      text: t('features.safe'),
    },
    {
      icon: GlobeAmericasIcon,
      text: t('features.national'),
    },
    {
      icon: RocketLaunchIcon,
      text: t('features.fleet'),
    },
    {
      icon: UserGroupIcon,
      text: t('features.capacity'),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 - Information */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-dark">
              {t('title')}
            </h2>
            <p className="text-lg text-primary-gray leading-relaxed">
              {t('description')}
            </p>

            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <feature.icon className="w-6 h-6 text-primary-red flex-shrink-0 mt-1" />
                  <p className="text-primary-gray">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 - Map */}
          <div className="relative">
            <div className="w-full h-full min-h-[400px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
              {/* Placeholder for interactive map */}
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                <GlobeAmericasIcon className="w-24 h-24 mb-4" />
                <p className="text-xl font-semibold">{t('map.title')}</p>
                <p className="text-sm mt-2 px-4 text-center">
                  Maya Peninsula + USA Destinations
                </p>
              </div>
            </div>
          </div>

          {/* Column 3 - CTA */}
          <div className="bg-primary-dark text-white rounded-2xl p-8 flex flex-col justify-center space-y-6">
            <h3 className="text-3xl font-bold">{t('cta.title')}</h3>
            <p className="text-gray-300 leading-relaxed">{t('cta.description')}</p>

            <button className="bg-primary-red text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-center">
              {t('cta.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
