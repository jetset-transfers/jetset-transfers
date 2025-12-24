'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface LazyMapProps {
  src: string;
  height?: number;
  className?: string;
  title?: string;
}

export default function LazyMap({
  src,
  height = 300,
  className = '',
  title = 'Location map',
}: LazyMapProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: '200px',
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {isVisible ? (
        <iframe
          src={src}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          className="grayscale hover:grayscale-0 transition-all duration-300"
        />
      ) : (
        <div
          className="flex items-center justify-center bg-gray-100 dark:bg-navy-800 animate-pulse"
          style={{ height }}
        >
          <div className="text-center text-muted">
            <MapPinIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}
