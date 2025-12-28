'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { trackHeroCTA } from '@/lib/analytics';

interface HeroCTAButtonsProps {
  locale: string;
  primaryText: string;
  secondaryText: string;
}

export default function HeroCTAButtons({ locale, primaryText, secondaryText }: HeroCTAButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <Link
        href={`/${locale}/contact`}
        className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-600/50 hover:shadow-xl hover:shadow-brand-600/60 transition-all duration-300 hover:-translate-y-0.5"
        onClick={() => trackHeroCTA('book_transfer')}
      >
        {primaryText}
        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </Link>
      <a
        href="#services"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-300 hover:shadow-lg"
        onClick={() => trackHeroCTA('view_destinations')}
      >
        {secondaryText}
      </a>
    </div>
  );
}
