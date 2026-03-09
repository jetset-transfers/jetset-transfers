'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  TruckIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface SuccessContentProps {
  locale: string;
  sessionId?: string;
  bookingId?: string;
}

interface BookingDetails {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  return_date: string | null;
  return_time: string | null;
  num_passengers: number;
  pickup_flight_number: string | null;
  vehicle_name: string;
  price_usd: number;
  status: string;
}

const translations = {
  es: {
    title: 'Reserva Confirmada',
    subtitle: 'Tu pago ha sido procesado exitosamente',
    confirmationCode: 'Código de confirmación',
    bookingDetails: 'Detalles de la reserva',
    tripInfo: 'Información del viaje',
    destination: 'Destino',
    date: 'Fecha',
    time: 'Hora',
    returnDate: 'Fecha de regreso',
    returnTime: 'Hora de regreso',
    passengers: 'Pasajeros',
    vehicle: 'Vehículo',
    flightNumber: 'Número de vuelo',
    contactInfo: 'Información de contacto',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    total: 'Total pagado',
    emailSent: 'Hemos enviado un correo de confirmación a',
    whatNext: '¿Qué sigue?',
    nextSteps: [
      'Recibirás un correo de confirmación con todos los detalles',
      'Un día antes de tu viaje recibirás un recordatorio',
      'Nuestro conductor te contactará el día de tu transfer',
      'Presenta tu código de confirmación al momento de la recogida',
    ],
    backToHome: 'Volver al inicio',
    viewDestinations: 'Ver más destinos',
    loading: 'Cargando detalles...',
    error: 'No se pudo cargar la reserva',
  },
  en: {
    title: 'Booking Confirmed',
    subtitle: 'Your payment has been processed successfully',
    confirmationCode: 'Confirmation code',
    bookingDetails: 'Booking details',
    tripInfo: 'Trip information',
    destination: 'Destination',
    date: 'Date',
    time: 'Time',
    returnDate: 'Return date',
    returnTime: 'Return time',
    passengers: 'Passengers',
    vehicle: 'Vehicle',
    flightNumber: 'Flight number',
    contactInfo: 'Contact information',
    email: 'Email',
    phone: 'Phone',
    total: 'Total paid',
    emailSent: "We've sent a confirmation email to",
    whatNext: "What's next?",
    nextSteps: [
      "You'll receive a confirmation email with all the details",
      "You'll receive a reminder the day before your trip",
      'Our driver will contact you on the day of your transfer',
      'Present your confirmation code at pickup',
    ],
    backToHome: 'Back to home',
    viewDestinations: 'View more destinations',
    loading: 'Loading details...',
    error: 'Could not load booking',
  },
};

export default function SuccessContent({
  locale,
  sessionId,
  bookingId,
}: SuccessContentProps) {
  const supabase = createClient();
  const t = translations[locale as keyof typeof translations] || translations.es;

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        setError(true);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError || !data) {
        setError(true);
      } else {
        setBooking(data);
      }
      setLoading(false);
    };

    loadBooking();
  }, [bookingId]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center py-8">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <DocumentTextIcon className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t.error}
          </h1>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors mt-4"
          >
            {t.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 sm:pt-28 pb-12 sm:pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </div>

        {/* Confirmation Code */}
        <div className="bg-brand-500 text-white rounded-xl p-6 text-center mb-6">
          <p className="text-sm opacity-90 mb-1">{t.confirmationCode}</p>
          <p className="text-3xl font-bold tracking-wider">
            {booking.booking_number}
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-navy-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.tripInfo}
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Destination */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.destination}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.pickup_location}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.date}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(booking.pickup_date)}
                </p>
              </div>
            </div>
            {booking.pickup_time && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.time}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.pickup_time}
                  </p>
                </div>
              </div>
            )}

            {/* Return info if round trip */}
            {booking.return_date && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-navy-700">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.returnDate}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(booking.return_date)}
                    </p>
                  </div>
                </div>
                {booking.return_time && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t.returnTime}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.return_time}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Vehicle & Passengers */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-navy-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.vehicle}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.vehicle_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.passengers}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.num_passengers}
                  </p>
                </div>
              </div>
            </div>

            {/* Flight Number */}
            {booking.pickup_flight_number && (
              <div className="pt-4 border-t border-gray-200 dark:border-navy-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.flightNumber}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.pickup_flight_number}
                </p>
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t border-gray-200 dark:border-navy-700 flex justify-between items-center">
              <span className="font-semibold text-gray-900 dark:text-white">
                {t.total}
              </span>
              <span className="text-2xl font-bold text-brand-500">
                {formatPrice(booking.price_usd)}
              </span>
            </div>
          </div>
        </div>

        {/* Email notification */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <EnvelopeIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {t.emailSent}{' '}
              <span className="font-medium">{booking.customer_email}</span>
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-200 dark:border-navy-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t.whatNext}
          </h2>
          <ul className="space-y-3">
            {t.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-brand-500">
                    {index + 1}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
          >
            {t.backToHome}
          </Link>
          <Link
            href={`/${locale}/destinations`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-navy-800 hover:bg-gray-300 dark:hover:bg-navy-700 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            {t.viewDestinations}
          </Link>
        </div>
      </div>
    </div>
  );
}
