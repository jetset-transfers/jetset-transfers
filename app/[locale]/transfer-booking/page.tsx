import { Metadata } from 'next';
import { Suspense } from 'react';
import TransferBookingContent from './TransferBookingContent';

interface TransferBookingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ params }: TransferBookingPageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'es'
      ? 'Reservar Transfer | Jetset Transfers'
      : 'Book Transfer | Jetset Transfers',
    description: locale === 'es'
      ? 'Completa tu reserva de transfer privado. Selecciona tu vehículo y realiza el pago seguro.'
      : 'Complete your private transfer booking. Select your vehicle and make a secure payment.',
  };
}

function TransferBookingLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-navy-800 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-1/2" />
          <div className="grid gap-4">
            <div className="h-32 bg-gray-200 dark:bg-navy-800 rounded-xl" />
            <div className="h-32 bg-gray-200 dark:bg-navy-800 rounded-xl" />
            <div className="h-32 bg-gray-200 dark:bg-navy-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function TransferBookingPage({ params, searchParams }: TransferBookingPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<TransferBookingLoadingSkeleton />}>
      <TransferBookingContent
        locale={locale}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}
