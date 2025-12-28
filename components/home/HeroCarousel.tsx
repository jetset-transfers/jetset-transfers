'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { trackCarouselSlide } from '@/lib/analytics';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasTrackedSlide = useRef<Set<number>>(new Set([0])); // Track which slides have been viewed

  // Track slide view
  const trackSlideView = (index: number, isManual: boolean = false) => {
    const image = images[index];
    const slideName = locale === 'es'
      ? (image?.title_es || image?.alt_es || `slide_${index}`)
      : (image?.title_en || image?.alt_en || `slide_${index}`);

    // Only track unique views or manual navigation
    if (isManual || !hasTrackedSlide.current.has(index)) {
      trackCarouselSlide(index, slideName);
      hasTrackedSlide.current.add(index);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const newIndex = (prev + 1) % images.length;
          trackSlideView(newIndex);
          return newIndex;
        });
        setIsTransitioning(false);
      }, 300); // Half of transition duration for smoother effect
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval, isHovered, locale]);

  const goToPrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const newIndex = (prev - 1 + images.length) % images.length;
        trackSlideView(newIndex, true);
        return newIndex;
      });
      setIsTransitioning(false);
    }, 300);
  };

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const newIndex = (prev + 1) % images.length;
        trackSlideView(newIndex, true);
        return newIndex;
      });
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    trackSlideView(index, true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
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
      {/* Main Image Container with Smooth Transitions */}
      <div className="relative w-full h-full">
        {/* Current Image */}
        <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={currentImage.url}
            alt={locale === 'es' ? (currentImage.alt_es || '') : (currentImage.alt_en || '')}
            fill
            priority={currentIndex === 0}
            quality={90}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            unoptimized={currentImage.url.startsWith('http')}
          />
        </div>
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-700" />
      </div>

      {/* Content Overlay with Smooth Transition */}
      {(currentImage.title_es || currentImage.title_en || currentImage.price) && (
        <div className={`absolute top-6 left-6 right-6 transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
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
