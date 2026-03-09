'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  TruckIcon,
  ArrowsRightLeftIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BookingContentProps {
  locale: string;
  searchParams: { [key: string]: string | undefined };
}

interface VehiclePricing {
  vehicle_name: string;
  max_passengers: number;
  price_usd: number;
  notes_es?: string;
  notes_en?: string;
}

interface Destination {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  image_url: string;
  travel_time: string;
  distance_km: number;
  vehicle_pricing: VehiclePricing[];
}

type ServiceType = 'private' | 'roundtrip' | 'oneway';
type BookingStep = 'vehicle' | 'details' | 'payment';

const translations = {
  es: {
    backToSearch: 'Volver a buscar',
    bookingTitle: 'Reservar Transfer',
    selectVehicle: 'Selecciona tu vehículo',
    passengerDetails: 'Datos del pasajero',
    payment: 'Pago',
    tripDetails: 'Detalles del viaje',
    serviceType: 'Tipo de servicio',
    private: 'Transfer Privado',
    roundtrip: 'Viaje Redondo',
    oneway: 'Transfer One Way',
    destination: 'Destino',
    date: 'Fecha',
    time: 'Hora',
    returnDate: 'Fecha de regreso',
    returnTime: 'Hora de regreso',
    passengers: 'Pasajeros',
    maxPassengers: 'Máx. {n} pasajeros',
    selectThisVehicle: 'Seleccionar',
    selected: 'Seleccionado',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    flightNumber: 'Número de vuelo',
    flightNumberHint: 'Opcional - Para rastreo y coordinación',
    numPassengers: 'Número de pasajeros',
    specialRequests: 'Solicitudes especiales',
    specialRequestsPlaceholder: 'Silla de bebé, silla de ruedas, etc.',
    continue: 'Continuar',
    back: 'Atrás',
    proceedToPayment: 'Proceder al pago',
    orderSummary: 'Resumen de la reserva',
    subtotal: 'Subtotal',
    total: 'Total',
    roundTripDiscount: 'Incluye viaje de ida y vuelta',
    securePayment: 'Pago seguro con Stripe',
    processing: 'Procesando...',
    paymentReady: 'Todo listo para pagar',
    paymentReadyDesc: 'Serás redirigido a Stripe para completar el pago de forma segura.',
    noDestination: 'No se encontró el destino',
    noDestinationDesc: 'El destino seleccionado no está disponible.',
    returnToHome: 'Volver al inicio',
    travelTime: 'Tiempo de traslado',
    distance: 'Distancia',
    from: 'Desde',
    requiredField: 'Este campo es requerido',
    invalidEmail: 'Correo electrónico inválido',
    invalidPhone: 'Teléfono inválido',
  },
  en: {
    backToSearch: 'Back to search',
    bookingTitle: 'Book Transfer',
    selectVehicle: 'Select your vehicle',
    passengerDetails: 'Passenger details',
    payment: 'Payment',
    tripDetails: 'Trip details',
    serviceType: 'Service type',
    private: 'Private Transfer',
    roundtrip: 'Round Trip',
    oneway: 'One Way Transfer',
    destination: 'Destination',
    date: 'Date',
    time: 'Time',
    returnDate: 'Return date',
    returnTime: 'Return time',
    passengers: 'Passengers',
    maxPassengers: 'Max. {n} passengers',
    selectThisVehicle: 'Select',
    selected: 'Selected',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Phone',
    flightNumber: 'Flight number',
    flightNumberHint: 'Optional - For tracking and coordination',
    numPassengers: 'Number of passengers',
    specialRequests: 'Special requests',
    specialRequestsPlaceholder: 'Baby seat, wheelchair, etc.',
    continue: 'Continue',
    back: 'Back',
    proceedToPayment: 'Proceed to payment',
    orderSummary: 'Booking summary',
    subtotal: 'Subtotal',
    total: 'Total',
    roundTripDiscount: 'Includes round trip',
    securePayment: 'Secure payment with Stripe',
    processing: 'Processing...',
    paymentReady: 'Ready to pay',
    paymentReadyDesc: "You'll be redirected to Stripe to complete your payment securely.",
    noDestination: 'Destination not found',
    noDestinationDesc: 'The selected destination is not available.',
    returnToHome: 'Return to home',
    travelTime: 'Travel time',
    distance: 'Distance',
    from: 'From',
    requiredField: 'This field is required',
    invalidEmail: 'Invalid email',
    invalidPhone: 'Invalid phone',
  },
};

export default function BookingContent({ locale, searchParams }: BookingContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const { formatPrice } = useCurrency();
  const t = translations[locale as keyof typeof translations] || translations.es;

  // URL params (Next.js already decodes searchParams)
  const destinationSlug = searchParams.destination;
  const serviceType = (searchParams.type as ServiceType) || 'private';
  const travelDate = searchParams.date || '';
  const travelTime = searchParams.time || '';
  const returnDate = searchParams.return_date || '';
  const returnTime = searchParams.return_time || '';
  const preSelectedVehicle = searchParams.vehicle || '';

  // State
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>('vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<VehiclePricing | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Country codes for phone dropdown
  const countryCodes = [
    { code: '+1', country: 'US', flag: '🇺🇸', label: 'USA (+1)' },
    { code: '+52', country: 'MX', flag: '🇲🇽', label: 'México (+52)' },
    { code: '+1', country: 'CA', flag: '🇨🇦', label: 'Canadá (+1)' },
    { code: '+44', country: 'GB', flag: '🇬🇧', label: 'UK (+44)' },
    { code: '+34', country: 'ES', flag: '🇪🇸', label: 'España (+34)' },
    { code: '+33', country: 'FR', flag: '🇫🇷', label: 'Francia (+33)' },
    { code: '+49', country: 'DE', flag: '🇩🇪', label: 'Alemania (+49)' },
    { code: '+39', country: 'IT', flag: '🇮🇹', label: 'Italia (+39)' },
    { code: '+55', country: 'BR', flag: '🇧🇷', label: 'Brasil (+55)' },
    { code: '+54', country: 'AR', flag: '🇦🇷', label: 'Argentina (+54)' },
    { code: '+57', country: 'CO', flag: '🇨🇴', label: 'Colombia (+57)' },
    { code: '+56', country: 'CL', flag: '🇨🇱', label: 'Chile (+56)' },
    { code: '+51', country: 'PE', flag: '🇵🇪', label: 'Perú (+51)' },
    { code: '+58', country: 'VE', flag: '🇻🇪', label: 'Venezuela (+58)' },
    { code: '+507', country: 'PA', flag: '🇵🇦', label: 'Panamá (+507)' },
    { code: '+506', country: 'CR', flag: '🇨🇷', label: 'Costa Rica (+506)' },
    { code: '+31', country: 'NL', flag: '🇳🇱', label: 'Países Bajos (+31)' },
    { code: '+41', country: 'CH', flag: '🇨🇭', label: 'Suiza (+41)' },
    { code: '+61', country: 'AU', flag: '🇦🇺', label: 'Australia (+61)' },
  ];

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    flightNumber: '',
    numPassengers: 1,
    specialRequests: '',
    travelDate: travelDate || '', // Pre-fill from URL or empty
    travelTime: travelTime || '', // Pre-fill from URL or empty
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Load destination data
  useEffect(() => {
    const loadDestination = async () => {
      if (!destinationSlug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', destinationSlug)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error loading destination:', error);
      } else {
        setDestination(data);

        // Pre-select vehicle if specified in URL
        if (preSelectedVehicle && data?.vehicle_pricing) {
          const vehicle = data.vehicle_pricing.find(
            (v: VehiclePricing) => v.vehicle_name === preSelectedVehicle
          );
          if (vehicle) {
            setSelectedVehicle(vehicle);
          }
        }
      }
      setLoading(false);
    };

    loadDestination();
  }, [destinationSlug, preSelectedVehicle]);

  // Calculate price
  const calculatePrice = () => {
    if (!selectedVehicle) return 0;
    let price = selectedVehicle.price_usd;
    if (serviceType === 'roundtrip') {
      price = price * 2 * 0.9; // 10% discount for round trip
    }
    return price;
  };

  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errors.fullName = t.requiredField;
    }
    if (!formData.email.trim()) {
      errors.email = t.requiredField;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t.invalidEmail;
    }
    if (!formData.phone.trim()) {
      errors.phone = t.requiredField;
    } else if (!/^[\d\s-()]{7,}$/.test(formData.phone)) {
      errors.phone = t.invalidPhone;
    }
    // Validate travel date (required)
    if (!formData.travelDate.trim()) {
      errors.travelDate = t.requiredField;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle step navigation
  const handleContinue = () => {
    if (currentStep === 'vehicle' && selectedVehicle) {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      if (validateForm()) {
        setCurrentStep('payment');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('vehicle');
    } else if (currentStep === 'payment') {
      setCurrentStep('details');
    }
  };

  // Handle payment with Stripe
  const handlePayment = async () => {
    if (!destination || !selectedVehicle) return;

    setProcessing(true);
    setPaymentError(null);

    try {
      const destinationName = locale === 'es' ? destination.name_es : destination.name_en;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: destination.id,
          destinationName,
          serviceType,
          travelDate: formData.travelDate,
          travelTime: formData.travelTime || undefined,
          returnDate: returnDate || undefined,
          returnTime: returnTime || undefined,
          vehicleName: selectedVehicle.vehicle_name,
          priceUsd: calculatePrice(),
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: `${formData.countryCode} ${formData.phone}`,
          flightNumber: formData.flightNumber || undefined,
          numPassengers: formData.numPassengers,
          specialRequests: formData.specialRequests || undefined,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(
        locale === 'es'
          ? 'Error al procesar el pago. Por favor intenta de nuevo.'
          : 'Error processing payment. Please try again.'
      );
      setProcessing(false);
    }
  };

  // Service type icon
  const getServiceIcon = () => {
    switch (serviceType) {
      case 'private':
        return <PaperAirplaneIcon className="w-5 h-5" />;
      case 'roundtrip':
        return <ArrowsRightLeftIcon className="w-5 h-5" />;
      case 'oneway':
        return <TruckIcon className="w-5 h-5" />;
      default:
        return <PaperAirplaneIcon className="w-5 h-5" />;
    }
  };

  const getServiceLabel = () => {
    switch (serviceType) {
      case 'private':
        return t.private;
      case 'roundtrip':
        return t.roundtrip;
      case 'oneway':
        return t.oneway;
      default:
        return t.private;
    }
  };

  // Format date for display
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-navy-800 rounded w-1/3" />
            <div className="h-4 bg-gray-200 dark:bg-navy-800 rounded w-1/2" />
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

  // No destination found
  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center py-8">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t.noDestination}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t.noDestinationDesc}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {t.returnToHome}
          </Link>
        </div>
      </div>
    );
  }

  const destinationName = locale === 'es' ? destination.name_es : destination.name_en;
  const vehiclePricing = destination.vehicle_pricing || [];

  // Steps indicator
  const steps = [
    { id: 'vehicle', label: t.selectVehicle },
    { id: 'details', label: t.passengerDetails },
    { id: 'payment', label: t.payment },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          {t.backToSearch}
        </button>

        {/* Page title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.bookingTitle}
        </h1>

        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === currentStepIndex
                    ? 'bg-brand-500 text-white'
                    : index < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-navy-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {index < currentStepIndex ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs">
                    {index + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 dark:bg-navy-800 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Vehicle Selection */}
            {currentStep === 'vehicle' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t.selectVehicle}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {vehiclePricing.map((vehicle) => {
                    const isSelected = selectedVehicle?.vehicle_name === vehicle.vehicle_name;
                    const price =
                      serviceType === 'roundtrip'
                        ? vehicle.price_usd * 2 * 0.9
                        : vehicle.price_usd;

                    return (
                      <div
                        key={vehicle.vehicle_name}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/10'
                            : 'border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 hover:border-brand-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <CheckCircleIcon className="w-6 h-6 text-brand-500" />
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                            <TruckIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {vehicle.vehicle_name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t.maxPassengers.replace('{n}', String(vehicle.max_passengers))}
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-brand-500">
                          {formatPrice(price)}
                        </div>
                        {serviceType === 'roundtrip' && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            {t.roundTripDiscount}
                          </p>
                        )}
                        {(vehicle.notes_es || vehicle.notes_en) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {locale === 'es' ? vehicle.notes_es : vehicle.notes_en}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Passenger Details */}
            {currentStep === 'details' && (
              <div className="bg-white dark:bg-navy-900 rounded-xl p-6 border border-gray-200 dark:border-navy-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t.passengerDetails}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.fullName
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-navy-600'
                      } bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.email} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.email
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-navy-600'
                      } bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone with Country Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.phone} *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="w-32 sm:w-40 px-2 py-3 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                      >
                        {countryCodes.map((country) => (
                          <option key={`${country.country}-${country.code}`} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="555 123 4567"
                        className={`flex-1 px-4 py-3 rounded-lg border ${
                          formErrors.phone
                            ? 'border-red-500'
                            : 'border-gray-300 dark:border-navy-600'
                        } bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Flight Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.flightNumber}
                    </label>
                    <input
                      type="text"
                      value={formData.flightNumber}
                      onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                      placeholder="AA1234"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t.flightNumberHint}
                    </p>
                  </div>

                  {/* Number of Passengers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.numPassengers} *
                    </label>
                    <select
                      value={formData.numPassengers}
                      onChange={(e) =>
                        setFormData({ ...formData, numPassengers: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                      {Array.from({ length: selectedVehicle?.max_passengers || 1 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Travel Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.date} *
                    </label>
                    <input
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        formErrors.travelDate
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-navy-600'
                      } bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent`}
                    />
                    {formErrors.travelDate && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.travelDate}</p>
                    )}
                  </div>

                  {/* Travel Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.time}
                    </label>
                    <input
                      type="time"
                      value={formData.travelTime}
                      onChange={(e) => setFormData({ ...formData, travelTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {locale === 'es' ? 'Opcional' : 'Optional'}
                    </p>
                  </div>

                  {/* Special Requests */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.specialRequests}
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      placeholder={t.specialRequestsPlaceholder}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <div className="bg-white dark:bg-navy-900 rounded-xl p-6 border border-gray-200 dark:border-navy-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t.payment}
                </h2>

                {/* Payment ready message */}
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t.paymentReady}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t.paymentReadyDesc}
                  </p>

                  {/* Stripe badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-navy-800 rounded-lg">
                    <svg className="w-5 h-5 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t.securePayment}
                    </span>
                  </div>

                  {/* Error message */}
                  {paymentError && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {paymentError}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between">
              {currentStep !== 'vehicle' ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  {t.back}
                </button>
              ) : (
                <div />
              )}

              {currentStep !== 'payment' ? (
                <button
                  onClick={handleContinue}
                  disabled={currentStep === 'vehicle' && !selectedVehicle}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {t.continue}
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      {t.processing}
                    </>
                  ) : (
                    t.proceedToPayment
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right column - Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Trip Details Card */}
              <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-200 dark:border-navy-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t.tripDetails}
                </h3>

                {/* Destination image */}
                {destination.image_url && (
                  <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={destination.image_url}
                      alt={destinationName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {/* Service type */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-500">
                      {getServiceIcon()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.serviceType}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getServiceLabel()}
                      </p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                      <MapPinIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.destination}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {destinationName}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  {formData.travelDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                        <CalendarIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.date}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(formData.travelDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Time */}
                  {formData.travelTime && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.time}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.travelTime}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Return info for round trip */}
                  {serviceType === 'roundtrip' && returnDate && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t.returnDate}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(returnDate)}
                          </p>
                        </div>
                      </div>
                      {returnTime && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center">
                            <ClockIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.returnTime}</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {returnTime}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Travel time & distance */}
                  <div className="pt-3 border-t border-gray-200 dark:border-navy-700 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.travelTime}</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {destination.travel_time || '~30 min'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.distance}</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {destination.distance_km ? `${destination.distance_km} km` : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              {selectedVehicle && (
                <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-200 dark:border-navy-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {t.orderSummary}
                  </h3>

                  <div className="space-y-3">
                    {/* Selected vehicle */}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {selectedVehicle.vehicle_name}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {formatPrice(selectedVehicle.price_usd)}
                      </span>
                    </div>

                    {/* Round trip multiplier */}
                    {serviceType === 'roundtrip' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">× 2 (ida y vuelta)</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatPrice(selectedVehicle.price_usd * 2)}
                        </span>
                      </div>
                    )}

                    {/* Discount */}
                    {serviceType === 'roundtrip' && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Descuento 10%</span>
                        <span>-{formatPrice(selectedVehicle.price_usd * 2 * 0.1)}</span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-3 border-t border-gray-200 dark:border-navy-700 flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">{t.total}</span>
                      <span className="text-xl font-bold text-brand-500">
                        {formatPrice(calculatePrice())}
                      </span>
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
