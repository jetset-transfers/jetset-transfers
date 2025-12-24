'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [(node: T | null) => void, boolean] {
  const { threshold = 0.1, rootMargin = '100px', triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [element, threshold, rootMargin, triggerOnce]);

  return [setRef, isVisible];
}

export default useIntersectionObserver;
