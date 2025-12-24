'use client';

import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'none';
  delay?: number;
}

export default function LazySection({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
  placeholder,
  animation = 'fade',
  delay = 0,
}: LazySectionProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const getAnimationClasses = () => {
    if (animation === 'none') return '';

    const baseClasses = 'transition-all duration-700 ease-out';
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : '';

    if (!isVisible) {
      switch (animation) {
        case 'fade':
          return `${baseClasses} ${delayClass} opacity-0`;
        case 'slide-up':
          return `${baseClasses} ${delayClass} opacity-0 translate-y-8`;
        case 'slide-left':
          return `${baseClasses} ${delayClass} opacity-0 translate-x-8`;
        case 'slide-right':
          return `${baseClasses} ${delayClass} opacity-0 -translate-x-8`;
        case 'scale':
          return `${baseClasses} ${delayClass} opacity-0 scale-95`;
        default:
          return `${baseClasses} ${delayClass} opacity-0`;
      }
    }

    return `${baseClasses} ${delayClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
  };

  return (
    <div
      ref={ref}
      className={`${className} ${getAnimationClasses()}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {isVisible ? children : (placeholder || <div className="min-h-[200px]" />)}
    </div>
  );
}
