'use client';

import { useLocale } from 'next-intl';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function PageLoader({ message, fullScreen = true }: PageLoaderProps) {
  const locale = useLocale();

  const defaultMessage = locale === 'es'
    ? 'Preparando tu traslado...'
    : 'Preparing your transfer...';

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-navy-950">
        <img
          src="/images/loading/van-jetset.svg"
          alt="Jetset Transfers"
          className="w-48 h-48 md:w-64 md:h-64 object-contain animate-float"
        />
        <p className="mt-4 text-lg font-medium text-navy-600 dark:text-navy-300 animate-pulse">
          {message || defaultMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img
        src="/images/loading/van-jetset.svg"
        alt="Jetset Transfers"
        className="w-32 h-32 md:w-40 md:h-40 object-contain animate-float"
      />
      <p className="mt-2 text-sm font-medium text-navy-600 dark:text-navy-300 animate-pulse">
        {message || defaultMessage}
      </p>
    </div>
  );
}
