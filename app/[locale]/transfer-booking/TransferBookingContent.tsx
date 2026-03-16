'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  TruckIcon,
  UserIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import CountryCodeSelect from '@/components/ui/CountryCodeSelect';
import RouteMap from '@/components/maps/RouteMap';

interface VehiclePricing {
  vehicle_name: string;
  max_passengers: number;
  max_passengers_no_luggage?: number;
  price_usd: number;
}

interface TransferBookingContentProps {
  locale: string;
  searchParams: { [key: string]: string | undefined };
}

type BookingStep = 'vehicle' | 'details' | 'payment';

const labels = {
  es: {
    title: 'Reservar Transfer',
    subtitle: 'Selecciona tu vehículo y completa la reserva',
    routeDetails: 'Detalles de la ruta',
    origin: 'Origen',
    destination: 'Destino',
    date: 'Fecha',
    time: 'Hora',
    passengers: 'Pasajeros',
    duration: 'Duración aprox.',
    distance: 'Distancia',
    minutes: 'min',
    // Steps
    step1: 'Vehículo',
    step2: 'Datos',
    step3: 'Pago',
    // Vehicle selection
    selectVehicle: 'Selecciona tu vehículo',
    maxPassengers: 'Máx. pasajeros',
    maxPassengersNoLuggage: 'sin equipaje',
    perTrip: 'por viaje',
    select: 'Seleccionar',
    selected: 'Seleccionado',
    continueToDetails: 'Continuar',
    noVehicles: 'No hay vehículos disponibles para esta ruta',
    contactUs: 'Contáctanos para una cotización personalizada',
    // Passenger details
    passengerDetails: 'Datos del pasajero',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    flightNumber: 'Número de vuelo (opcional)',
    specialRequests: 'Solicitudes especiales',
    specialRequestsPlaceholder: 'Silla de bebé, equipaje extra, etc.',
    continueToPayment: 'Continuar al pago',
    // Payment
    paymentTitle: 'Confirmar y Pagar',
    orderSummary: 'Resumen de la reserva',
    vehicle: 'Vehículo',
    total: 'Total',
    securePayment: 'Pago seguro',
    paymentDescription: 'Serás redirigido a Stripe para completar el pago de forma segura.',
    processing: 'Procesando...',
    payNow: 'Pagar ahora',
    // Common
    back: 'Volver',
    required: 'Requerido',
    // Sidebar
    tripDetails: 'Detalles del viaje',
    serviceType: 'Tipo de servicio',
    privateTransfer: 'Transfer Privado',
    roundTrip: 'Viaje Redondo',
    travelTime: 'Tiempo de traslado',
    distanceLabel: 'Distancia',
    bookingSummary: 'Resumen de reserva',
    discount: 'Descuento',
    basePrice: 'Precio base (×2)',
  },
  en: {
    title: 'Book Transfer',
    subtitle: 'Select your vehicle and complete your booking',
    routeDetails: 'Route details',
    origin: 'Origin',
    destination: 'Destination',
    date: 'Date',
    time: 'Time',
    passengers: 'Passengers',
    duration: 'Est. duration',
    distance: 'Distance',
    minutes: 'min',
    // Steps
    step1: 'Vehicle',
    step2: 'Details',
    step3: 'Payment',
    // Vehicle selection
    selectVehicle: 'Select your vehicle',
    maxPassengers: 'Max. passengers',
    maxPassengersNoLuggage: 'no luggage',
    perTrip: 'per trip',
    select: 'Select',
    selected: 'Selected',
    continueToDetails: 'Continue',
    noVehicles: 'No vehicles available for this route',
    contactUs: 'Contact us for a custom quote',
    // Passenger details
    passengerDetails: 'Passenger details',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone',
    flightNumber: 'Flight number (optional)',
    specialRequests: 'Special requests',
    specialRequestsPlaceholder: 'Baby seat, extra luggage, etc.',
    continueToPayment: 'Continue to payment',
    // Payment
    paymentTitle: 'Confirm and Pay',
    orderSummary: 'Booking summary',
    vehicle: 'Vehicle',
    total: 'Total',
    securePayment: 'Secure payment',
    paymentDescription: 'You will be redirected to Stripe to complete your secure payment.',
    processing: 'Processing...',
    payNow: 'Pay now',
    // Common
    back: 'Back',
    required: 'Required',
    // Sidebar
    tripDetails: 'Trip details',
    serviceType: 'Service type',
    privateTransfer: 'Private Transfer',
    roundTrip: 'Round Trip',
    travelTime: 'Travel time',
    distanceLabel: 'Distance',
    bookingSummary: 'Booking summary',
    discount: 'Discount',
    basePrice: 'Base price (×2)',
  },
};


type ServiceType = 'private' | 'roundtrip' | 'oneway';

export default function TransferBookingContent({ locale, searchParams }: TransferBookingContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const t = labels[locale as keyof typeof labels] || labels.es;

  // Get service type from URL
  const serviceType = (searchParams.type as ServiceType) || 'private';

  // Parse search params
  const transferData = useMemo(() => {
    const vehiclePricing: VehiclePricing[] = searchParams.vehicle_pricing
      ? JSON.parse(searchParams.vehicle_pricing)
      : [];

    return {
      originName: searchParams.origin_name || '',
      originAddress: searchParams.origin_address || '',
      originLat: parseFloat(searchParams.origin_lat || '0'),
      originLng: parseFloat(searchParams.origin_lng || '0'),
      destName: searchParams.dest_name || '',
      destAddress: searchParams.dest_address || '',
      destLat: parseFloat(searchParams.dest_lat || '0'),
      destLng: parseFloat(searchParams.dest_lng || '0'),
      originZoneName: searchParams.origin_zone_name || '',
      destZoneName: searchParams.dest_zone_name || '',
      originZoneId: searchParams.origin_zone_id || '',
      destZoneId: searchParams.dest_zone_id || '',
      date: searchParams.date || '',
      time: searchParams.time || '',
      duration: searchParams.duration ? parseInt(searchParams.duration) : null,
      distance: searchParams.distance ? parseFloat(searchParams.distance) : null,
      vehiclePricing,
      pricingId: searchParams.pricing_id || '',
      withLuggage: searchParams.with_luggage !== 'false', // Default to true unless explicitly false
    };
  }, [searchParams]);

  // State
  const [currentStep, setCurrentStep] = useState<BookingStep>('vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<VehiclePricing | null>(null);
  const [numPassengers, setNumPassengers] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [roundTripDiscount, setRoundTripDiscount] = useState(10); // Default 10%
  const [passengerData, setPassengerData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    flightNumber: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch round trip discount setting
  useEffect(() => {
    const fetchDiscount = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'roundtrip_discount')
        .single();

      if (data?.value) {
        const discount = parseFloat(data.value);
        if (!isNaN(discount) && discount >= 0 && discount <= 50) {
          setRoundTripDiscount(discount);
        }
      }
    };
    fetchDiscount();
  }, [supabase]);

  // Calculate price with round trip discount
  const calculatePrice = () => {
    if (!selectedVehicle) return 0;
    let price = selectedVehicle.price_usd;
    if (serviceType === 'roundtrip') {
      // Apply configurable discount: (price × 2) - discount%
      price = price * 2 * (1 - roundTripDiscount / 100);
    }
    return Math.round(price * 100) / 100; // Round to 2 decimals
  };

  // All available vehicles (no filtering by passengers - user selects after choosing vehicle)
  const availableVehicles = transferData.vehiclePricing;

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Validate passenger details
  const validateDetails = () => {
    const newErrors: Record<string, string> = {};

    if (!passengerData.fullName.trim()) {
      newErrors.fullName = t.required;
    }
    if (!passengerData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passengerData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!passengerData.phone.trim()) {
      newErrors.phone = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle continue from vehicle selection
  const handleContinueToDetails = () => {
    if (selectedVehicle) {
      setCurrentStep('details');
    }
  };

  // Handle continue from details
  const handleContinueToPayment = () => {
    if (validateDetails()) {
      setCurrentStep('payment');
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!selectedVehicle) return;

    setIsProcessing(true);

    try {
      // Call the transfer checkout API
      const response = await fetch('/api/checkout/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Origin
          originName: transferData.originName,
          originAddress: transferData.originAddress,
          originLat: transferData.originLat,
          originLng: transferData.originLng,
          originZoneId: transferData.originZoneId,
          // Destination
          destName: transferData.destName,
          destAddress: transferData.destAddress,
          destLat: transferData.destLat,
          destLng: transferData.destLng,
          destZoneId: transferData.destZoneId,
          // Trip details
          date: transferData.date,
          time: transferData.time,
          passengers: numPassengers,
          // Vehicle
          vehicleName: selectedVehicle.vehicle_name,
          priceUsd: calculatePrice(),
          serviceType,
          pricingId: transferData.pricingId,
          // Customer
          customerName: passengerData.fullName,
          customerEmail: passengerData.email,
          customerPhone: `${passengerData.countryCode} ${passengerData.phone}`,
          flightNumber: passengerData.flightNumber,
          specialRequests: passengerData.specialRequests,
          // Locale
          locale,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      alert(locale === 'es' ? 'Error al procesar el pago' : 'Payment processing error');
    }
  };

  // Steps indicator
  const steps = [
    { id: 'vehicle', label: t.step1, icon: TruckIcon },
    { id: 'details', label: t.step2, icon: UserIcon },
    { id: 'payment', label: t.step3, icon: CreditCardIcon },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => {
              if (currentStep === 'vehicle') {
                router.back();
              } else if (currentStep === 'details') {
                setCurrentStep('vehicle');
              } else {
                setCurrentStep('details');
              }
            }}
            className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
        </div>

        {/* Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-brand-500 text-white'
                          : 'bg-gray-200 dark:bg-navy-700 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 font-medium ${
                        isActive || isCompleted
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        index < currentStepIndex
                          ? 'bg-green-500'
                          : 'bg-gray-200 dark:bg-navy-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid Layout - Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - left column */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Route Summary (always visible) */}
            <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg border border-gray-200 dark:border-navy-800 p-4 mb-6">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">{transferData.originName}</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  <span className="text-gray-600 dark:text-gray-400">{transferData.destName}</span>
                </div>
                {transferData.date && (
                  <>
                    <span className="text-gray-300 dark:text-navy-600">|</span>
                    <span className="text-gray-600 dark:text-gray-400">{formatDate(transferData.date)}</span>
                  </>
                )}
                {transferData.time && (
                  <span className="text-gray-600 dark:text-gray-400">{transferData.time}</span>
                )}
              </div>
            </div>

            {/* Step Content */}
        {currentStep === 'vehicle' && (
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg border border-gray-200 dark:border-navy-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-brand-500" />
              {t.selectVehicle}
            </h2>

            {availableVehicles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">{t.noVehicles}</p>
                <Link
                  href={`/${locale}/contact`}
                  className="text-brand-500 hover:text-brand-600 font-medium"
                >
                  {t.contactUs}
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {availableVehicles.map((vehicle) => {
                    const isSelected = selectedVehicle?.vehicle_name === vehicle.vehicle_name;

                    return (
                      <button
                        key={vehicle.vehicle_name}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                            : 'border-gray-200 dark:border-navy-700 hover:border-brand-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-lg ${
                              isSelected
                                ? 'bg-brand-500 text-white'
                                : 'bg-gray-100 dark:bg-navy-800 text-gray-500'
                            }`}>
                              <TruckIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {vehicle.vehicle_name}
                              </h3>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <p>
                                  {t.maxPassengers}: {vehicle.max_passengers}
                                </p>
                                {!transferData.withLuggage && vehicle.max_passengers_no_luggage && vehicle.max_passengers_no_luggage > vehicle.max_passengers && (
                                  <p className="text-xs text-red-500 dark:text-red-400">
                                    {vehicle.max_passengers_no_luggage} ({t.maxPassengersNoLuggage})
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              ${vehicle.price_usd}
                            </p>
                            <p className="text-xs text-gray-500">USD</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Passengers selector - shown after selecting a vehicle */}
                {selectedVehicle && (() => {
                  // Calculate max capacity based on luggage
                  const maxCapacity = !transferData.withLuggage && selectedVehicle.max_passengers_no_luggage
                    ? selectedVehicle.max_passengers_no_luggage
                    : selectedVehicle.max_passengers;

                  return (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-navy-700">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <UserGroupIcon className="w-4 h-4 inline mr-1" />
                        {t.passengers}
                      </label>
                      <div className="flex items-center gap-3">
                        <select
                          value={numPassengers}
                          onChange={(e) => setNumPassengers(parseInt(e.target.value))}
                          className="flex-1 px-4 py-2.5 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                        >
                          {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1
                                ? (locale === 'es' ? 'pasajero' : 'passenger')
                                : (locale === 'es' ? 'pasajeros' : 'passengers')
                              }
                            </option>
                          ))}
                        </select>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {locale === 'es' ? 'Máx.' : 'Max.'} {maxCapacity}
                          {!transferData.withLuggage && selectedVehicle.max_passengers_no_luggage && (
                            <span className="text-xs text-red-500 dark:text-red-400 block">
                              ({t.maxPassengersNoLuggage})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-navy-700">
                  <button
                    onClick={handleContinueToDetails}
                    disabled={!selectedVehicle}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {t.continueToDetails}
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {currentStep === 'details' && (
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg border border-gray-200 dark:border-navy-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-brand-500" />
              {t.passengerDetails}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  value={passengerData.fullName}
                  onChange={(e) => setPassengerData({ ...passengerData, fullName: e.target.value })}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-navy-700'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.email} *
                </label>
                <input
                  type="email"
                  value={passengerData.email}
                  onChange={(e) => setPassengerData({ ...passengerData, email: e.target.value })}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-navy-700'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.phone} *
                </label>
                <div className="flex gap-2">
                  <CountryCodeSelect
                    value={passengerData.countryCode}
                    onChange={(value) => setPassengerData({ ...passengerData, countryCode: value })}
                    className="w-32 sm:w-36"
                  />
                  <input
                    type="tel"
                    value={passengerData.phone}
                    onChange={(e) => setPassengerData({ ...passengerData, phone: e.target.value })}
                    placeholder="555 123 4567"
                    className={`flex-1 px-4 py-2.5 bg-white dark:bg-navy-800 border rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-navy-700'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.flightNumber}
                </label>
                <input
                  type="text"
                  value={passengerData.flightNumber}
                  onChange={(e) => setPassengerData({ ...passengerData, flightNumber: e.target.value })}
                  placeholder="AA1234"
                  className="w-full px-4 py-2.5 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.specialRequests}
                </label>
                <textarea
                  value={passengerData.specialRequests}
                  onChange={(e) => setPassengerData({ ...passengerData, specialRequests: e.target.value })}
                  placeholder={t.specialRequestsPlaceholder}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-navy-700">
              <button
                onClick={handleContinueToPayment}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {t.continueToPayment}
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 'payment' && selectedVehicle && (
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg border border-gray-200 dark:border-navy-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-brand-500" />
              {t.paymentTitle}
            </h2>

            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-navy-800 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {t.orderSummary}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t.origin}</span>
                  <span className="text-gray-900 dark:text-white">{transferData.originName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t.destination}</span>
                  <span className="text-gray-900 dark:text-white">{transferData.destName}</span>
                </div>
                {transferData.date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t.date}</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(transferData.date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t.vehicle}</span>
                  <span className="text-gray-900 dark:text-white">{selectedVehicle.vehicle_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t.passengers}</span>
                  <span className="text-gray-900 dark:text-white">{numPassengers}</span>
                </div>
                {/* Round trip pricing breakdown */}
                {serviceType === 'roundtrip' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t.basePrice}</span>
                      <span className="text-gray-900 dark:text-white">${selectedVehicle.price_usd * 2}</span>
                    </div>
                    {roundTripDiscount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>{t.discount} ({roundTripDiscount}%)</span>
                        <span>-${(selectedVehicle.price_usd * 2 * roundTripDiscount / 100).toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="border-t border-gray-200 dark:border-navy-700 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">{t.total}</span>
                    <span className="text-brand-500">${calculatePrice()} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secure Payment Notice */}
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6">
              <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">{t.securePayment}</p>
                <p className="text-sm text-green-700 dark:text-green-400">{t.paymentDescription}</p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.processing}
                </>
              ) : (
                <>
                  <CreditCardIcon className="w-5 h-5" />
                  {t.payNow} - ${calculatePrice()} USD
                </>
              )}
            </button>
          </div>
        )}
          </div>

          {/* Sidebar - right column */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-24 space-y-6">
              {/* Trip Details Card with Map */}
              <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-200 dark:border-navy-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t.tripDetails}
                </h3>

                {/* Route Map */}
                <RouteMap
                  originLat={transferData.originLat}
                  originLng={transferData.originLng}
                  originName={transferData.originName}
                  destLat={transferData.destLat}
                  destLng={transferData.destLng}
                  destName={transferData.destName}
                  className="h-40 mb-4"
                />

                <div className="space-y-3">
                  {/* Service type */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-500">
                      <TruckIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.serviceType}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {serviceType === 'roundtrip' ? t.roundTrip : t.privateTransfer}
                      </p>
                    </div>
                  </div>

                  {/* Origin */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.origin}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transferData.originName}
                      </p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-brand-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.destination}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transferData.destName}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  {transferData.duration && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.travelTime}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {transferData.duration} {t.minutes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Distance */}
                  {transferData.distance && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center text-gray-500">
                        <MapPinIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.distanceLabel}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {transferData.distance.toFixed(1)} km
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Summary Card (shown when vehicle selected) */}
              {selectedVehicle && (
                <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-200 dark:border-navy-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {t.bookingSummary}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{selectedVehicle.vehicle_name}</span>
                      <span className="text-gray-900 dark:text-white">${selectedVehicle.price_usd}</span>
                    </div>
                    {/* Round trip pricing breakdown */}
                    {serviceType === 'roundtrip' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">{t.basePrice}</span>
                          <span className="text-gray-900 dark:text-white">${selectedVehicle.price_usd * 2}</span>
                        </div>
                        {roundTripDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-500">
                            <span>{t.discount} ({roundTripDiscount}%)</span>
                            <span>-${(selectedVehicle.price_usd * 2 * roundTripDiscount / 100).toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="border-t border-gray-200 dark:border-navy-700 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900 dark:text-white">{t.total}</span>
                        <span className="text-brand-500">${calculatePrice()} USD</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
