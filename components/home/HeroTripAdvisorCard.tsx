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
        {/* TripAdvisor owl icon - green in light mode, white in dark mode */}
        <svg className="w-7 h-7 text-[#00AA6C] dark:text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-3c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3zm-4-1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm8 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM12 6c2.76 0 5 2.24 5 5h-2c0-1.65-1.35-3-3-3s-3 1.35-3 3H7c0-2.76 2.24-5 5-5z"/>
        </svg>
      </div>
      <div className="text-sm font-semibold text-[#00AA6C] group-hover:text-[#008558] transition-colors">4.6/5.0</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#00AA6C] transition-colors">
        9 {locale === 'es' ? 'reseñas' : 'reviews'}
      </div>
    </a>
  );
}
