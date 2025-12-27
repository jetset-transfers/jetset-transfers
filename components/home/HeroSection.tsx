import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import HeroCarousel from './HeroCarousel';
import { getYearsOfExperienceFormatted } from '@/lib/constants';

interface ContentMap {
  [key: string]: {
    es: string;
    en: string;
  };
}

interface HeroImage {
  id: string;
  key: string;
  url: string;
  alt_es: string | null;
  alt_en: string | null;
  category: string | null;
  is_primary?: boolean;
}

interface FeaturedItem {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  price_from: number | null;
  duration: string | null;
  image_url: string | null;
}

interface CarouselImage {
  id: string;
  url: string;
  alt_es: string | null;
  alt_en: string | null;
  title_es?: string | null;
  title_en?: string | null;
  price?: number | null;
  link_url?: string | null;
  display_order?: number;
}

interface HeroSectionProps {
  locale: string;
  content: ContentMap;
  heroImage?: HeroImage | null;
  carouselImages?: CarouselImage[];
  featuredTour?: FeaturedItem | null;
  featuredDestination?: FeaturedItem | null;
  hasPopularData?: boolean;
}

export default function HeroSection({ locale, content, heroImage, carouselImages, featuredTour, featuredDestination, hasPopularData }: HeroSectionProps) {
  const t = useTranslations('hero');

  // Helper to get content with fallback to translations
  const getContent = (key: string, fallback: string) => {
    if (content[key]) {
      return locale === 'es' ? content[key].es : content[key].en;
    }
    return fallback;
  };

  // Hero image URL - use dynamic image from admin or fallback to gradient
  const heroImageUrl = heroImage?.url || null;

  // Hero image alt text for SEO - use dynamic alt or fallback
  const heroImageAlt = heroImage
    ? (locale === 'es' ? heroImage.alt_es : heroImage.alt_en) || heroImage.key
    : locale === 'es'
      ? 'Vista aérea de Cancún y la Riviera Maya - Jetset Transfers'
      : 'Aerial view of Cancún and Riviera Maya - Jetset Transfers';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={heroImageAlt}
            fill
            priority
            fetchPriority="high"
            quality={75}
            sizes="100vw"
            className="object-cover"
            unoptimized={heroImageUrl.startsWith('http')}
          />
        ) : (
          /* Fallback gradient if no image */
          <div className="w-full h-full bg-gradient-to-br from-navy-950 via-navy-900 to-brand-900" />
        )}
        {/* Overlay for better readability - Changes based on theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/70 via-navy-900/60 to-navy-950/70 dark:from-navy-950/95 dark:via-navy-900/90 dark:to-navy-950/95 transition-colors duration-500" />
      </div>

      {/* Background Pattern - Subtle */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Content - 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            {/* Trust Badges Row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold border border-green-200 dark:border-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t('badge')}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {locale === 'es' ? 'Certificados' : 'Certified'}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.6/5.0
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]">
                <span className="text-white">
                  {getContent('hero_title', t('titleLine1'))}
                </span>
                <br />
                <span className="text-brand-500">
                  {getContent('hero_subtitle', t('titleLine2'))}
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                {t('subtitle')}
              </p>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-600/50 hover:shadow-xl hover:shadow-brand-600/60 transition-all duration-300 hover:-translate-y-0.5"
              >
                {t('cta.primary')}
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                {t('cta.secondary')}
              </a>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { value: getYearsOfExperienceFormatted() + '+', label: t('stats.years'), icon: '🏆' },
                { value: '1,000+', label: t('stats.transfers'), icon: '✓' },
                { value: '4.6/5', label: t('stats.rating'), icon: '⭐' },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Featured Carousel - 5 columns */}
          <div className="lg:col-span-5 relative group">
            <HeroCarousel
              locale={locale}
              images={carouselImages || []}
            />

            {/* Bottom Cards - Compact */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-navy-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-navy-800">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {locale === 'es' ? 'Certificados' : 'Certified'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">TAI & TAN</div>
              </div>

              <div className="bg-white dark:bg-navy-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-navy-800">
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src="https://static.tacdn.com/img2/brand_refresh_2025/logos/logo.svg"
                    alt="TripAdvisor"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">4.6/5.0</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">9 {locale === 'es' ? 'reseñas' : 'reviews'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
