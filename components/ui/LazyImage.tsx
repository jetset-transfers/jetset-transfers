'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  rootMargin?: string;
  showSkeleton?: boolean;
}

export default function LazyImage({
  rootMargin = '200px',
  showSkeleton = true,
  className = '',
  alt,
  ...props
}: LazyImageProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    triggerOnce: true,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {showSkeleton && !isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-navy-800 animate-pulse rounded-inherit" />
      )}
      {isVisible && (
        <Image
          {...props}
          alt={alt}
          className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
