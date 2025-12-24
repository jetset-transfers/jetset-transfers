'use client';

import { useTranslations } from 'next-intl';
import { HomeModernIcon, RocketLaunchIcon, StarIcon } from '@heroicons/react/24/solid';

export default function WhyChooseSection() {
  const t = useTranslations('whyChoose');

  const reasons = [
    {
      icon: HomeModernIcon,
      title: t('reason1.title'),
      description: t('reason1.description'),
    },
    {
      icon: RocketLaunchIcon,
      title: t('reason2.title'),
      description: t('reason2.description'),
    },
    {
      icon: StarIcon,
      title: t('reason3.title'),
      description: t('reason3.description'),
    },
  ];

  return (
    <section className="relative py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90">
        {/* Placeholder for beach background image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-400 opacity-50"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 md:mb-16">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-8 hover:bg-white transition-all hover:scale-105 shadow-xl"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-red rounded-full flex items-center justify-center">
                  <reason.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary-dark">
                  {reason.title}
                </h3>
                <p className="text-primary-gray leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
