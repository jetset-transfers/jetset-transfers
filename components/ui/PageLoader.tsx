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

  const altText = locale === 'es'
    ? 'Jetset Transfers - Camioneta de traslado privado en Cancún'
    : 'Jetset Transfers - Private transfer van in Cancun';

  const ariaLabel = locale === 'es' ? 'Cargando contenido' : 'Loading content';
  const finalMessage = message || defaultMessage;

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-navy-950"
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        <img
          src="/images/loading/van-jetset.webp"
          alt={altText}
          width={256}
          height={256}
          loading="eager"
          decoding="async"
          aria-hidden="true"
          className="w-48 h-48 md:w-64 md:h-64 object-contain animate-float"
        />
        <p className="mt-4 text-lg font-medium text-navy-600 dark:text-navy-300 animate-pulse">
          {finalMessage}
        </p>
        <span className="sr-only">{finalMessage}</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center py-12"
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <img
        src="/images/loading/van-jetset.webp"
        alt={altText}
        width={160}
        height={160}
        loading="eager"
        decoding="async"
        aria-hidden="true"
        className="w-32 h-32 md:w-40 md:h-40 object-contain animate-float"
      />
      <p className="mt-2 text-sm font-medium text-navy-600 dark:text-navy-300 animate-pulse">
        {finalMessage}
      </p>
      <span className="sr-only">{finalMessage}</span>
    </div>
  );
}
