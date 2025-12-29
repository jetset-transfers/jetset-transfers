'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LazySection from '@/components/ui/LazySection';
import { trackTripAdvisorClick } from '@/lib/analytics';

interface TripAdvisorSectionProps {
  locale: string;
}

interface Review {
  name: string;
  location: string;
  title: string;
  text: string;
}

const reviews: { es: Review[]; en: Review[] } = {
  es: [
    {
      name: 'Forrest R',
      location: 'Julio 2025',
      title: '¡Nunca decepciona!',
      text: '¡Gran compañía! Siempre llega a tiempo, nunca hay problemas sobre a dónde vamos. Conductores seguros. Siempre los usaré.',
    },
    {
      name: 'Mariana B',
      location: 'Julio 2025',
      title: 'Increíble viaje',
      text: 'Fue una mezcla de buena plática y un paisaje hermoso. Fernando fue la persona que nos llevó y fue muy amable en todo momento, se aprecia mucho eso.',
    },
    {
      name: 'Dana F',
      location: 'Cancún • Familia',
      title: 'Súper buen servicio',
      text: 'Muy amable y alegre el muchacho, estuvimos todos muy cómodos y bien en el camino. Súper atento Fernando.',
    },
    {
      name: 'Marian F',
      location: 'Julio 2025',
      title: 'Digno de 5 estrellas',
      text: 'Me encantó completamente, el muchacho muy agradable y lindo. El viaje al hotel muy tranquilo y agusto, la camioneta es amplia y la plática muy placentera.',
    },
    {
      name: 'Ana Lucía R',
      location: 'Familia',
      title: 'Excelente servicio del conductor',
      text: 'Tuve un excelente servicio por parte de Fernando, muy ameno mi viaje y muy servicial. Un servicio de calidad desde que pasan por ti hasta que llegas a tu destino.',
    },
    {
      name: 'Maria C',
      location: 'Familia',
      title: 'Cancun trip',
      text: 'Excelente servicio. Buen precio. El conductor es amable y dio mucha información de tours y de restaurantes. Se los recomiendo.',
    },
    {
      name: 'Ricardo C',
      location: 'Negocios',
      title: 'Buen servicio',
      text: 'Muy buen servicio, todo fue rápido y con gente profesional, camionetas de transporte en muy buen estado.',
    },
    {
      name: 'Fernando Amado C',
      location: 'Amigos',
      title: 'Muy buen servicio',
      text: 'Servicio de 10/10 muy amable el chofer y atento en todo momento, apoyándonos durante el trayecto desde que nos recogió hasta la llegada a nuestro destino.',
    },
  ],
  en: [
    {
      name: 'Forrest R',
      location: 'July 2025',
      title: 'Never disappoints!',
      text: 'Great company! Always on time, never any issues about where we\'re going. Safe drivers. Will always use them.',
    },
    {
      name: 'Mariana B',
      location: 'July 2025',
      title: 'Incredible trip',
      text: 'It was a mix of good conversation and beautiful scenery. Fernando was the person who took us and was very kind at all times, really appreciated.',
    },
    {
      name: 'Dana F',
      location: 'Cancún • Family',
      title: 'Super good service',
      text: 'Very friendly and cheerful guy, we were all very comfortable on the way. Fernando was super attentive.',
    },
    {
      name: 'Marian F',
      location: 'July 2025',
      title: 'Worthy of 5 stars',
      text: 'I completely loved it, the guy was very nice and kind. The trip to the hotel was very calm and pleasant, the van is spacious and the conversation was very enjoyable.',
    },
    {
      name: 'Ana Lucía R',
      location: 'Family',
      title: 'Excellent driver service',
      text: 'I had excellent service from Fernando, my trip was very pleasant and he was very helpful. Quality service from pickup to destination.',
    },
    {
      name: 'Maria C',
      location: 'Family',
      title: 'Cancun trip',
      text: 'Excellent service. Good price. The driver is friendly and gave a lot of information about tours and restaurants. Highly recommended.',
    },
    {
      name: 'Ricardo C',
      location: 'Business',
      title: 'Good service',
      text: 'Very good service, everything was fast and with professional people, transport vans in very good condition.',
    },
    {
      name: 'Fernando Amado C',
      location: 'Friends',
      title: 'Very good service',
      text: '10/10 service, very friendly driver and attentive at all times, supporting us during the journey from pickup to arrival at our destination.',
    },
  ],
};

const translations = {
  es: {
    title: 'Lo que dicen nuestros clientes',
    subtitle: 'Reseñas verificadas en TripAdvisor',
    rating: '4.6',
    ratingText: 'Excelente',
    reviewCount: '9 reseñas',
    cta: 'Ver todas las reseñas en TripAdvisor',
  },
  en: {
    title: 'What our clients say',
    subtitle: 'Verified reviews on TripAdvisor',
    rating: '4.6',
    ratingText: 'Excellent',
    reviewCount: '9 reviews',
    cta: 'See all reviews on TripAdvisor',
  },
};

// 5 green circles for TripAdvisor rating
function TripAdvisorRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full bg-[#00AA6C]"
        />
      ))}
    </div>
  );
}

export default function TripAdvisorSection({ locale }: TripAdvisorSectionProps) {
  const t = translations[locale as keyof typeof translations] || translations.en;
  const localizedReviews = reviews[locale as keyof typeof reviews] || reviews.en;

  // Show 3 reviews at a time, rotating with delayed start
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const visibleReviews = 3;

  // Delay animation start by 5s to not affect initial metrics
  useEffect(() => {
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % localizedReviews.length);
          setIsTransitioning(false);
        }, 300);
      }, 5000);
      return () => clearInterval(interval);
    }, 5000);
    return () => clearTimeout(startDelay);
  }, [localizedReviews.length]);

  const getVisibleReviews = () => {
    const result = [];
    for (let i = 0; i < visibleReviews; i++) {
      const index = (currentIndex + i) % localizedReviews.length;
      result.push(localizedReviews[index]);
    }
    return result;
  };

  return (
    <LazySection animation="fade" className="py-16 md:py-20 bg-gray-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
              <Image
                src="https://static.tacdn.com/img2/brand_refresh_2025/logos/logo.svg"
                alt="TripAdvisor"
                width={36}
                height={36}
                className="w-9 h-9"
              />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-muted mb-4">
            {t.subtitle}
          </p>

          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-3">
            <TripAdvisorRating />
            <span className="text-2xl font-bold">{t.rating}</span>
            <span className="text-muted">({t.reviewCount})</span>
          </div>
        </div>

        {/* Reviews Grid - Fixed height to prevent CLS during rotation */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {getVisibleReviews().map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className={`card p-6 min-h-[220px] transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
              style={{ willChange: 'opacity' }}
            >
              {/* Reviewer Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-navy-700 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm">{review.name}</div>
                  <div className="text-xs text-muted">{review.location}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <TripAdvisorRating />
              </div>

              {/* Review Title */}
              <h3 className="font-semibold mb-2 line-clamp-2">
                {review.title}
              </h3>

              {/* Review Text */}
              <p className="text-sm text-muted line-clamp-4">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="https://www.tripadvisor.com.mx/Attraction_Review-g150807-d27417188-Reviews-Jetset_Transfers-Cancun_Yucatan_Peninsula.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00AA6C] hover:bg-[#009660] text-white font-medium rounded-lg transition-colors"
            onClick={() => trackTripAdvisorClick()}
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <Image
                src="https://static.tacdn.com/img2/brand_refresh_2025/logos/logo.svg"
                alt=""
                width={18}
                height={18}
                className="w-[18px] h-[18px]"
              />
            </div>
            {t.cta}
          </a>
        </div>
      </div>
    </LazySection>
  );
}
