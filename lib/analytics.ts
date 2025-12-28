// Google Analytics 4 utilities

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Check if analytics consent was given
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const consent = localStorage.getItem('jetset_cookie_consent');
    if (consent) {
      const parsed = JSON.parse(consent);
      return parsed.analytics === true;
    }
  } catch {
    // Invalid consent data
  }
  return false;
}

// Initialize GA4 (called when consent is given)
export function initializeAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;

  // Load gtag script if not already loaded
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    script.defer = true; // Defer execution for better performance
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    // Performance optimization: send minimal data on initial load
    send_page_view: true,
  });
}

// Track page views (for SPA navigation)
export function trackPageView(url: string, title?: string): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (!hasAnalyticsConsent()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}

// Generic event tracking
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  if (!hasAnalyticsConsent()) return;

  window.gtag('event', eventName, parameters);
}

// ============================================
// CONVERSION EVENTS
// ============================================

// Track WhatsApp button clicks
export function trackWhatsAppClick(source: string, itemName?: string): void {
  trackEvent('whatsapp_click', {
    event_category: 'conversion',
    event_label: source,
    item_name: itemName || 'general',
  });
}

// Track contact form submission
export function trackContactFormSubmit(formType: string = 'contact'): void {
  trackEvent('form_submit', {
    event_category: 'conversion',
    event_label: formType,
    form_name: formType,
  });
}

// Track "Reserve Now" / "Book Now" button clicks
export function trackBookingClick(itemType: 'destination' | 'tour', itemName: string): void {
  trackEvent('begin_checkout', {
    event_category: 'conversion',
    item_category: itemType,
    item_name: itemName,
  });
}

// ============================================
// ENGAGEMENT EVENTS
// ============================================

// Track destination/tour detail page views
export function trackItemView(itemType: 'destination' | 'tour', itemName: string, itemId: string): void {
  trackEvent('view_item', {
    event_category: 'engagement',
    item_category: itemType,
    item_name: itemName,
    item_id: itemId,
  });
}

// Track "View Details" clicks from listing pages
export function trackViewDetailsClick(itemType: 'destination' | 'tour', itemName: string): void {
  trackEvent('select_item', {
    event_category: 'engagement',
    item_category: itemType,
    item_name: itemName,
  });
}

// Track language change
export function trackLanguageChange(newLocale: string): void {
  trackEvent('language_change', {
    event_category: 'engagement',
    new_language: newLocale,
  });
}

// Track currency change
export function trackCurrencyChange(newCurrency: string): void {
  trackEvent('currency_change', {
    event_category: 'engagement',
    new_currency: newCurrency,
  });
}

// Track phone call clicks
export function trackPhoneClick(source: string): void {
  trackEvent('phone_click', {
    event_category: 'conversion',
    event_label: source,
  });
}

// Track email clicks
export function trackEmailClick(source: string): void {
  trackEvent('email_click', {
    event_category: 'conversion',
    event_label: source,
  });
}

// Track TripAdvisor link clicks
export function trackTripAdvisorClick(): void {
  trackEvent('tripadvisor_click', {
    event_category: 'engagement',
    event_label: 'reviews_section',
  });
}

// Track scroll depth (for long pages)
export function trackScrollDepth(percentage: number): void {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    depth_percentage: percentage,
  });
}

// Track when users view a list of items (destinations, tours, or vehicles listing page)
export function trackViewItemList(listType: 'destinations' | 'tours' | 'vehicles', itemCount: number): void {
  const listNames = {
    destinations: 'Destinations',
    tours: 'Zones',
    vehicles: 'Vehicles',
  };

  trackEvent('view_item_list', {
    event_category: 'engagement',
    item_list_id: listType,
    item_list_name: listNames[listType],
    item_count: itemCount,
  });
}

// Track navigation menu clicks
export function trackNavigation(linkName: string, location: 'header' | 'footer'): void {
  trackEvent('navigation_click', {
    event_category: 'navigation',
    link_name: linkName,
    location: location,
  });
}

// ============================================
// CAROUSEL & MEDIA EVENTS
// ============================================

// Track carousel slide changes
export function trackCarouselSlide(slideIndex: number, slideName?: string): void {
  trackEvent('carousel_slide', {
    event_category: 'engagement',
    slide_index: slideIndex,
    slide_name: slideName || `slide_${slideIndex}`,
  });
}

// ============================================
// OUTBOUND LINKS
// ============================================

// Track clicks on external links
export function trackOutboundLink(url: string, linkText?: string): void {
  trackEvent('outbound_link', {
    event_category: 'engagement',
    link_url: url,
    link_text: linkText || 'unknown',
  });
}

// ============================================
// TIME ON PAGE
// ============================================

// Track time spent on a specific page/section
export function trackTimeOnPage(pageName: string, timeSeconds: number): void {
  trackEvent('time_on_page', {
    event_category: 'engagement',
    page_name: pageName,
    time_seconds: timeSeconds,
  });
}

// Track engaged time (when user is actively interacting)
export function trackEngagedTime(pageName: string, engagedSeconds: number): void {
  trackEvent('engaged_time', {
    event_category: 'engagement',
    page_name: pageName,
    engaged_seconds: engagedSeconds,
  });
}

// ============================================
// CTA TRACKING
// ============================================

// Track all CTA button clicks with detailed info
export function trackCTAClick(
  ctaType: 'primary' | 'secondary' | 'hero' | 'floating' | 'card',
  ctaText: string,
  location: string,
  destinationUrl?: string
): void {
  trackEvent('cta_click', {
    event_category: 'conversion',
    cta_type: ctaType,
    cta_text: ctaText,
    cta_location: location,
    destination_url: destinationUrl || 'internal',
  });
}

// Track hero section CTA clicks specifically
export function trackHeroCTA(buttonType: 'book_transfer' | 'view_destinations'): void {
  trackEvent('hero_cta_click', {
    event_category: 'conversion',
    button_type: buttonType,
  });
}

// ============================================
// USER BEHAVIOR
// ============================================

// Track when user copies content (phone, email, etc.)
export function trackCopyToClipboard(contentType: 'phone' | 'email' | 'address' | 'other', value?: string): void {
  trackEvent('copy_to_clipboard', {
    event_category: 'engagement',
    content_type: contentType,
    content_value: value || 'unknown',
  });
}

// Track social share attempts
export function trackSocialShare(platform: string, contentType: string): void {
  trackEvent('social_share', {
    event_category: 'engagement',
    platform: platform,
    content_type: contentType,
  });
}
