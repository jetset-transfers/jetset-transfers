import { Metadata } from 'next';
import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; booking_id?: string }>;
}

export async function generateMetadata({ params }: SuccessPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'es'
      ? 'Reserva Confirmada | Jetset Transfers'
      : 'Booking Confirmed | Jetset Transfers',
    description: locale === 'es'
      ? 'Tu reserva ha sido confirmada exitosamente.'
      : 'Your booking has been successfully confirmed.',
    robots: { index: false, follow: false },
  };
}

function SuccessLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center py-8">
      <div className="animate-pulse text-center">
        <div className="w-20 h-20 bg-gray-200 dark:bg-navy-800 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-navy-800 rounded w-48 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-64 mx-auto" />
      </div>
    </div>
  );
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { locale } = await params;
  const { session_id, booking_id } = await searchParams;

  return (
    <Suspense fallback={<SuccessLoadingSkeleton />}>
      <SuccessContent
        locale={locale}
        sessionId={session_id}
        bookingId={booking_id}
      />
    </Suspense>
  );
}
