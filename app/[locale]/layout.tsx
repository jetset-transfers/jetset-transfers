import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/components/layout/Header';
import FooterWrapper from '@/components/layout/FooterWrapper';
import { LazyCookieBanner } from '@/components/layout/LazyComponents';
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';
import ScrollTracker from '@/components/analytics/ScrollTracker';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { createClient } from '@/lib/supabase/server';
import '../globals.css';

// Optimized font loading with preload
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const locales = ['es', 'en'];

// Global metadata base URL for all pages
export const metadata: Metadata = {
  metadataBase: new URL('https://www.jetsettransfers.com'),
  icons: {
    icon: '/images/logo/logo-jetset.webp',
    shortcut: '/images/logo/logo-jetset.webp',
    apple: '/images/logo/logo-jetset.webp',
  },
  verification: {
    google: '3UhDMhU9C27y23Rp894AukC-IrR-6RylxMUrjk8s75w',
  },
  other: {
    'msapplication-TileColor': '#102a43',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#102a43' },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  // Check if there are any vehicles in the database
  let hasVehicles = false;
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    hasVehicles = (count ?? 0) > 0;
  } catch {
    // If query fails, default to hiding vehicles
    hasVehicles = false;
  }

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://static.tacdn.com" />
        {gaId && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          </>
        )}
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Theme detection script - must be inline to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(s==='dark'||(!s&&d))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />

        {/* Google Analytics 4 - Deferred loading for better LCP */}
        {gaId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
                gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied'});
                gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});
              `,
            }}
          />
        )}
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <LoadingProvider>
              <AnalyticsProvider>
                <ScrollTracker />
                <Header hasVehicles={hasVehicles} />
                <main>{children}</main>
                <FooterWrapper />
                <LazyCookieBanner />
              </AnalyticsProvider>
            </LoadingProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
        {/* Load GA script after page content */}
        {gaId && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
