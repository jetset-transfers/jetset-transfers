'use client';

import { useTranslations } from 'next-intl';
import { BriefcaseIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function JetsetBanner() {
  const t = useTranslations('jetset');

  return (
    <section className="relative py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600"></div>
        {/* Placeholder for beach with hammock background */}
      </div>

      <div className="relative container mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Jetset Info */}
            <div className="p-8 md:p-12 space-y-6">
              {/* Jetset Logo */}
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-accent-blue">Jetset</div>
                <div className="text-xl text-gray-500">TRANSPORTES</div>
              </div>

              <div className="text-3xl font-bold text-primary-red">
                {t('from')}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-lg">
                  <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                  <span>{t('services.airport')}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                  <span>{t('services.resort')}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                  <span>{t('services.shopping')}</span>
                </div>
              </div>

              <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
                {t('badge')}
              </div>
            </div>

            {/* Right Side - CTA */}
            <div className="bg-gradient-to-br from-primary-red to-red-600 p-8 md:p-12 flex flex-col justify-center items-center text-white text-center space-y-6">
              <BriefcaseIcon className="w-24 h-24" />
              <h3 className="text-3xl md:text-4xl font-bold">{t('title')}</h3>

              <button className="bg-white text-primary-red px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                {t('button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
