'use client';

import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/analytics';

export default function ScrollTracker() {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Reset tracked depths when route changes
    trackedDepths.current.clear();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Calculate scroll percentage
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = Math.round((scrollTop / scrollableHeight) * 100);

      // Track at 25%, 50%, 75%, and 100% milestones
      const milestones = [25, 50, 75, 100];

      for (const milestone of milestones) {
        if (scrollPercentage >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          trackScrollDepth(milestone);
        }
      }
    };

    // Throttle scroll events to avoid excessive tracking
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return null;
}
