import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false // Siempre inglés por defecto
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle admin routes with Supabase auth
  if (pathname.startsWith('/admin')) {
    return updateSession(request);
  }

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // files with extensions (images, etc)
  ) {
    return NextResponse.next();
  }

  // Redirect unknown paths without locale prefix to home
  // Valid paths start with /es, /en, /admin, or are just /
  const isValidPath =
    pathname === '/' ||
    pathname.startsWith('/es') ||
    pathname.startsWith('/en') ||
    pathname.startsWith('/admin');

  if (!isValidPath) {
    // Redirect to English home page
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  // Handle internationalized routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(es|en)/:path*', '/admin/:path*', '/:path*']
};
