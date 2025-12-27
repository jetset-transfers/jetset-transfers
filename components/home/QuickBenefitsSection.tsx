'use client';

import { useTranslations } from 'next-intl';
import {
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function QuickBenefitsSection() {
  const t = useTranslations('benefits');

  const benefits = [
    {
      icon: ShieldCheckIcon,
      title: t('safety.title'),
      description: t('safety.description'),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: ClockIcon,
      title: t('punctuality.title'),
      description: t('punctuality.description'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: UserGroupIcon,
      title: t('service.title'),
      description: t('service.description'),
      color: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-100 dark:bg-brand-900/30',
    },
    {
      icon: CurrencyDollarIcon,
      title: t('price.title'),
      description: t('price.description'),
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-navy-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-navy-950 border border-gray-200 dark:border-navy-800 hover:border-gray-300 dark:hover:border-navy-700 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
