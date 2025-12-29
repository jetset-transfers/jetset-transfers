'use client';

import { trackTripAdvisorClick, trackOutboundLink } from '@/lib/analytics';

interface HeroTripAdvisorCardProps {
  locale: string;
}

export default function HeroTripAdvisorCard({ locale }: HeroTripAdvisorCardProps) {
  const tripAdvisorUrl = 'https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html';

  const handleClick = () => {
    trackTripAdvisorClick();
    trackOutboundLink(tripAdvisorUrl, 'TripAdvisor Hero Card');
  };

  return (
    <a
      href={tripAdvisorUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white dark:bg-navy-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-navy-800 hover:border-[#00AA6C] hover:shadow-xl transition-all duration-300 cursor-pointer group"
      aria-label={locale === 'es' ? 'Ver reseñas en TripAdvisor' : 'View reviews on TripAdvisor'}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 mb-1">
        {/* TripAdvisor logo - white circle background for visibility */}
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
          <img
            src="https://static.tacdn.com/img2/brand_refresh_2025/logos/logo.svg"
            alt="TripAdvisor"
            width={28}
            height={28}
            className="w-7 h-7"
          />
        </div>
      </div>
      <div className="text-sm font-semibold text-[#00AA6C] group-hover:text-[#008558] transition-colors">4.6/5.0</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#00AA6C] transition-colors">
        9 {locale === 'es' ? 'reseñas' : 'reviews'}
      </div>
    </a>
  );
}
