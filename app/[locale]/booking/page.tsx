import { Metadata } from 'next';
import { Suspense } from 'react';
import BookingContent from './BookingContent';

interface BookingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'es'
      ? 'Reservar Transfer | Jetset Transfers'
      : 'Book Transfer | Jetset Transfers',
    description: locale === 'es'
      ? 'Completa tu reserva de transporte privado desde el Aeropuerto de Cancún. Selecciona tu vehículo y realiza el pago seguro.'
      : 'Complete your private transportation booking from Cancun Airport. Select your vehicle and make a secure payment.',
  };
}

function BookingLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-navy-800 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-1/2" />

          {/* Content skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 bg-gray-200 dark:bg-navy-800 rounded-xl" />
              <div className="h-48 bg-gray-200 dark:bg-navy-800 rounded-xl" />
            </div>
            <div className="h-96 bg-gray-200 dark:bg-navy-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<BookingLoadingSkeleton />}>
      <BookingContent
        locale={locale}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}
