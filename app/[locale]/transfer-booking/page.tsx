import { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import TransferBookingContent from './TransferBookingContent';
import QuickBookingSearch from '@/components/home/QuickBookingSearch';

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
      ? 'Reserva tu traslado privado desde el Aeropuerto de Cancun. Selecciona destino, vehiculo y paga en linea de forma segura.'
      : 'Book your private transfer from Cancun Airport. Select destination, vehicle and pay online securely.',
    robots: {
      index: false,
      follow: true,
    },
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

  // Check if we have the essential params to show the booking flow
  const hasBookingData = resolvedSearchParams.vehicle_pricing && resolvedSearchParams.dest_name;

  if (!hasBookingData) {
    // No booking data — show inline search form so user can select destination
    const supabase = await createClient();
    const { data: destinations } = await supabase
      .from('destinations')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    return (
      <main className="min-h-screen pt-24 md:pt-28 pb-16 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {locale === 'es' ? 'Reservar Traslado' : 'Book Your Transfer'}
            </h1>
            <p className="text-muted max-w-lg mx-auto">
              {locale === 'es'
                ? 'Selecciona tu destino, fecha y hora para ver vehiculos disponibles y precios.'
                : 'Select your destination, date and time to see available vehicles and prices.'}
            </p>
          </div>

          {/* Reuse the QuickBookingSearch component - add pt to offset its negative margin */}
          <div className="pt-16 sm:pt-20">
            <QuickBookingSearch locale={locale} destinations={destinations || []} />
          </div>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-muted">
            <div className="flex flex-col items-center gap-1">
              <span className="text-brand-500 font-semibold">24/7</span>
              <span>{locale === 'es' ? 'Servicio disponible' : 'Service available'}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-brand-500 font-semibold">4.9★</span>
              <span>TripAdvisor</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-brand-500 font-semibold">$0</span>
              <span>{locale === 'es' ? 'Cargos ocultos' : 'Hidden fees'}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-brand-500 font-semibold">✓</span>
              <span>{locale === 'es' ? 'Pago seguro' : 'Secure payment'}</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <Suspense fallback={<TransferBookingLoadingSkeleton />}>
      <TransferBookingContent
        locale={locale}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}
