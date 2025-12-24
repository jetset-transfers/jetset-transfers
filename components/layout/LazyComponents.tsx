'use client';

import dynamic from 'next/dynamic';

// Lazy load CookieBanner - it's not critical for initial render
export const LazyCookieBanner = dynamic(
  () => import('@/components/cookies/CookieBanner'),
  {
    ssr: false, // Only render on client
    loading: () => null, // No loading state needed
  }
);

// Lazy load Footer - can be deferred since it's below the fold
export const LazyFooter = dynamic(
  () => import('@/components/layout/Footer'),
  {
    ssr: true,
    loading: () => (
      <footer className="bg-navy-900 py-12">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-8 bg-navy-800 rounded w-32 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-navy-800 rounded w-20" />
                <div className="h-3 bg-navy-800 rounded w-full" />
                <div className="h-3 bg-navy-800 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    ),
  }
);

// Lazy load ServicesSection - below the hero fold
export const LazyServicesSection = dynamic(
  () => import('@/components/home/ServicesSection'),
  {
    ssr: true,
    loading: () => (
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header Skeleton */}
          <div className="text-center mb-14 md:mb-20 animate-pulse">
            <div className="inline-block h-8 bg-gray-200 dark:bg-navy-800 rounded-full w-48 mb-4" />
            <div className="h-10 bg-gray-200 dark:bg-navy-800 rounded w-64 mx-auto mb-5" />
            <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-full max-w-96 mx-auto" />
          </div>

          {/* Two Column Layout Skeleton */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {[0, 1].map((col) => (
              <div key={col} className="animate-pulse">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-navy-800 rounded-xl" />
                  <div>
                    <div className="h-6 bg-gray-200 dark:bg-navy-800 rounded w-40 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-32" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[0, 1, 2].map((card) => (
                    <div key={card} className="rounded-2xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 p-4">
                      <div className="flex gap-4">
                        <div className="w-28 sm:w-36 h-24 bg-gray-200 dark:bg-navy-800 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 dark:bg-navy-800 rounded w-3/4" />
                          <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

// Lazy load ContactForm - only needed when user scrolls to it
export const LazyContactForm = dynamic(
  () => import('@/components/contact/ContactForm'),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-5 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-24 mb-2" />
            <div className="h-12 bg-gray-200 dark:bg-navy-800 rounded-lg w-full" />
          </div>
        ))}
        <div className="h-12 bg-brand-500/50 rounded-lg w-full" />
      </div>
    ),
  }
);
