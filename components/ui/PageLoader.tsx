'use client';

import Lottie from 'lottie-react';
import { useLocale } from 'next-intl';
import airplaneAnimation from '@/public/animations/airplane-animation.json';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function PageLoader({ message, fullScreen = true }: PageLoaderProps) {
  const locale = useLocale();

  const defaultMessage = locale === 'es'
    ? 'Preparando tu vuelo...'
    : 'Preparing your flight...';

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-navy-950">
        <div className="w-48 h-48 md:w-64 md:h-64">
          <Lottie
            animationData={airplaneAnimation}
            loop
            autoplay
          />
        </div>
        <p className="mt-4 text-lg font-medium text-navy-600 dark:text-navy-300 animate-pulse">
          {message || defaultMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-32 h-32 md:w-40 md:h-40">
        <Lottie
          animationData={airplaneAnimation}
          loop
          autoplay
        />
      </div>
      <p className="mt-2 text-sm font-medium text-navy-600 dark:text-navy-300 animate-pulse">
        {message || defaultMessage}
      </p>
    </div>
  );
}
