'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { getYearsOfExperienceFormatted } from '@/lib/constants';

interface WhyChooseSectionProps {
  locale: string;
}

export default function WhyChooseSection({ locale }: WhyChooseSectionProps) {
  const t = useTranslations('whyChoose');

  const reasons = [
    {
      icon: ShieldCheckIcon,
      title: t('reason1.title'),
      description: t('reason1.description'),
    },
    {
      icon: ClockIcon,
      title: t('reason2.title'),
      description: t('reason2.description'),
    },
    {
      icon: UserGroupIcon,
      title: t('reason3.title'),
      description: t('reason3.description'),
    },
    {
      icon: StarIcon,
      title: t('reason4.title'),
      description: t('reason4.description'),
    },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: Image with Stats Overlay */}
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero/hero-aerial-cancun.jpg"
                alt={locale === 'es' ? 'Por qué elegir Jetset Transfers' : 'Why choose Jetset Transfers'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Stats Overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-white">{getYearsOfExperienceFormatted()}+</div>
                    <div className="text-sm text-white/90">
                      {locale === 'es' ? 'Años de experiencia' : 'Years experience'}
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-white">10k+</div>
                    <div className="text-sm text-white/90">
                      {locale === 'es' ? 'Viajes realizados' : 'Trips completed'}
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-white">98%</div>
                    <div className="text-sm text-white/90">
                      {locale === 'es' ? 'Satisfacción' : 'Satisfaction'}
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-sm text-white/90">
                      {locale === 'es' ? 'Disponibilidad' : 'Availability'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 mb-4">
              {locale === 'es' ? 'Nuestra Promesa' : 'Our Promise'}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              {t('title')}
            </h2>

            <p className="text-lg text-muted mb-10 leading-relaxed">
              {locale === 'es'
                ? 'Más de una década conectando viajeros con sus destinos en la Riviera Maya. Nuestra experiencia y compromiso nos convierten en la opción preferida para miles de visitantes cada año.'
                : 'Over a decade connecting travelers with their destinations in the Riviera Maya. Our experience and commitment make us the preferred choice for thousands of visitors each year.'}
            </p>

            {/* Reasons Grid */}
            <div className="space-y-6">
              {reasons.map((reason, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center group-hover:bg-brand-600 group-hover:scale-110 transition-all">
                      <reason.icon className="w-6 h-6 text-brand-600 dark:text-brand-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {reason.title}
                    </h3>
                    <p className="text-muted leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
