'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface HeroCarouselImage {
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

interface HeroCarouselProps {
  locale: string;
  images: HeroCarouselImage[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({ locale, images, autoPlayInterval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval, isHovered]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30 aspect-[4/5] lg:aspect-[3/4] bg-gray-200 dark:bg-navy-800 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          {locale === 'es' ? 'No hay imágenes disponibles' : 'No images available'}
        </p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30 aspect-[4/5] lg:aspect-[3/4]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={currentImage.url}
          alt={locale === 'es' ? (currentImage.alt_es || '') : (currentImage.alt_en || '')}
          fill
          priority={currentIndex === 0}
          quality={90}
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover transition-opacity duration-500"
          unoptimized={currentImage.url.startsWith('http')}
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content Overlay */}
      {(currentImage.title_es || currentImage.title_en || currentImage.price) && (
        <div className="absolute top-6 left-6 right-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              {(currentImage.title_es || currentImage.title_en) && (
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 line-clamp-2">
                    {locale === 'es' ? currentImage.title_es : currentImage.title_en}
                  </div>
                </div>
              )}
              {currentImage.price && (
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-gray-500">{locale === 'es' ? 'Desde' : 'From'}</div>
                  <div className="text-lg font-bold text-brand-600">${currentImage.price}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows (show on hover if more than 1 image) */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label={locale === 'es' ? 'Imagen anterior' : 'Previous image'}
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label={locale === 'es' ? 'Siguiente imagen' : 'Next image'}
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-900" />
          </button>
        </>
      )}

      {/* Dots Indicator (bottom center) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`${locale === 'es' ? 'Ir a imagen' : 'Go to image'} ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Click to view (if link_url exists) */}
      {currentImage.link_url && (
        <Link
          href={currentImage.link_url}
          className="absolute inset-0"
          aria-label={locale === 'es' ? 'Ver detalles' : 'View details'}
        />
      )}
    </div>
  );
}
