'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircleIcon, ExclamationCircleIcon, TruckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { trackContactFormSubmit, trackBookingClick } from '@/lib/analytics';

interface SearchParams {
  destination?: string;
  price?: string;
}

interface ContactFormProps {
  locale: string;
  searchParams?: SearchParams;
}

interface Destination {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
}

const TIME_OPTIONS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export default function ContactForm({ locale, searchParams }: ContactFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);

  // Extract pre-selection info from URL params
  const preSelectedDestination = searchParams?.destination;
  const preSelectedPrice = searchParams?.price;
  const hasPreSelection = !!preSelectedDestination;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: preSelectedDestination ? 'transfer' : '',
    destination: preSelectedDestination || '',
    message: '',
    travel_date: '',
    departure_time: '',
    return_date: '',
    return_time: '',
    number_of_passengers: '2',
    pickup_location: '',
    flight_number: '',
  });

  // Load destinations from database
  useEffect(() => {
    const loadData = async () => {
      const { data: destData } = await supabase
        .from('destinations')
        .select('id, slug, name_es, name_en')
        .eq('is_active', true)
        .order('display_order');

      if (destData) setDestinations(destData);
    };

    loadData();
  }, [supabase]);

  // Update form when searchParams change
  useEffect(() => {
    if (preSelectedDestination) {
      setFormData(prev => ({
        ...prev,
        service_type: 'transfer',
        destination: preSelectedDestination,
      }));
    }
  }, [preSelectedDestination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Find destination_id based on slug
      let destination_id = null;

      if (formData.destination) {
        const dest = destinations.find(d => d.slug === formData.destination);
        destination_id = dest?.id || null;
      }

      const { error: insertError } = await supabase
        .from('contact_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          request_type: 'quote',
          service_type: formData.service_type || null,
          message: formData.message || null,
          status: 'pending',
          travel_date: formData.travel_date || null,
          travel_time: formData.departure_time || null,
          return_date: formData.return_date || null,
          return_time: formData.return_time || null,
          num_passengers: formData.number_of_passengers ? parseInt(formData.number_of_passengers) : null,
          pickup_location: formData.pickup_location || null,
          destination_id,
        }]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      // Track successful form submission
      const formType = formData.service_type === 'transfer' ? 'transfer_quote' : 'contact';
      trackContactFormSubmit(formType);

      // Track booking click if it's a quote request
      if (formData.destination) {
        trackBookingClick('destination', formData.destination);
      }

      // Send email notification to Jetset Transfers team
      try {
        await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            service_type: formData.service_type,
            destination: formData.destination,
            departure_location: formData.pickup_location,
            travel_date: formData.travel_date,
            departure_time: formData.departure_time,
            return_date: formData.return_date,
            return_time: formData.return_time,
            number_of_passengers: parseInt(formData.number_of_passengers) || null,
            flight_number: formData.flight_number,
            preSelectedPrice: preSelectedPrice,
          }),
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        destination: '',
        message: '',
        travel_date: '',
        departure_time: '',
        return_date: '',
        return_time: '',
        number_of_passengers: '2',
        pickup_location: '',
        flight_number: '',
      });
    } catch (err: any) {
      console.error('Form submission error:', err);
      const errorMessage = locale === 'es'
        ? `Error al enviar el mensaje: ${err.message || 'Por favor intenta de nuevo.'}`
        : `Error sending message: ${err.message || 'Please try again.'}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const labels = {
    name: locale === 'es' ? 'Nombre completo' : 'Full Name',
    email: locale === 'es' ? 'Correo electrónico' : 'Email Address',
    phone: locale === 'es' ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp',
    service: locale === 'es' ? 'Tipo de servicio' : 'Service Type',
    destination: locale === 'es' ? 'Destino' : 'Destination',
    message: locale === 'es' ? 'Mensaje o comentarios adicionales' : 'Message or additional comments',
    submit: locale === 'es' ? 'Solicitar cotización' : 'Request Quote',
    sending: locale === 'es' ? 'Enviando...' : 'Sending...',
    selectService: locale === 'es' ? 'Selecciona un servicio' : 'Select a service',
    transfer: locale === 'es' ? 'Traslado Privado' : 'Private Transfer',
    roundTrip: locale === 'es' ? 'Viaje Redondo' : 'Round Trip',
    general: locale === 'es' ? 'Consulta General' : 'General Inquiry',
    successTitle: locale === 'es' ? '¡Solicitud enviada!' : 'Request sent!',
    successMessage: locale === 'es'
      ? 'Gracias por contactarnos. Te responderemos en menos de 24 horas con tu cotización.'
      : 'Thank you for contacting us. We will respond within 24 hours with your quote.',
    sendAnother: locale === 'es' ? 'Enviar otra solicitud' : 'Send another request',
    preSelectionTitle: locale === 'es' ? 'Tu selección' : 'Your selection',
    preSelectionDestination: locale === 'es' ? 'Destino' : 'Destination',
    preSelectionPrice: locale === 'es' ? 'Precio estimado' : 'Estimated price',
    clearSelection: locale === 'es' ? 'Cambiar' : 'Change',
    transferTitle: locale === 'es' ? 'Cotiza tu Traslado' : 'Get a Transfer Quote',
    transferSubtitle: locale === 'es'
      ? 'Completa el formulario y te enviaremos una cotización sin compromiso en menos de 24 horas.'
      : 'Complete the form and we will send you a non-binding quote within 24 hours.',
    travelDate: locale === 'es' ? 'Fecha de llegada' : 'Arrival Date',
    departureTime: locale === 'es' ? 'Hora de llegada' : 'Arrival Time',
    returnDate: locale === 'es' ? 'Fecha de regreso (opcional)' : 'Return Date (optional)',
    returnTime: locale === 'es' ? 'Hora de regreso' : 'Return Time',
    numberOfPassengers: locale === 'es' ? 'Número de pasajeros' : 'Number of Passengers',
    selectOption: locale === 'es' ? '— Selecciona —' : '— Select —',
    selectDestination: locale === 'es' ? 'Selecciona tu destino' : 'Select your destination',
    pickupLocation: locale === 'es' ? 'Nombre del hotel o dirección' : 'Hotel name or address',
    flightNumber: locale === 'es' ? 'Info adicional (opcional)' : 'Additional info (optional)',
  };

  // Format slug to display name
  const formatSlug = (slug: string) => {
    return slug.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{labels.successTitle}</h3>
        <p className="text-muted mb-6">{labels.successMessage}</p>
        <a
          href={`/${locale}/contact`}
          className="inline-block text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          {labels.sendAnother}
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Title for transfer quote */}
      {hasPreSelection && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {labels.transferTitle}
          </h2>
          <p className="text-muted text-sm">
            {labels.transferSubtitle}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Pre-selection Card */}
        {hasPreSelection && (
          <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/50">
                  <TruckIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mb-1">
                    {labels.preSelectionTitle}
                  </p>
                  <p className="font-semibold text-foreground">
                    {preSelectedDestination && formatSlug(preSelectedDestination)}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted">
                    {preSelectedPrice && (
                      <span>{labels.preSelectionPrice}: <strong className="text-brand-600 dark:text-brand-400">{locale === 'es' ? 'Desde' : 'From'} ${preSelectedPrice} USD</strong></span>
                    )}
                  </div>
                </div>
              </div>
              <a
                href={`/${locale}/contact`}
                className="text-xs text-muted hover:text-brand-600 transition-colors flex items-center gap-1"
              >
                <XMarkIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{labels.clearSelection}</span>
              </a>
            </div>
          </div>
        )}

        {/* SERVICE TYPE */}
        <div>
          <label htmlFor="service_type" className="block text-sm font-medium mb-2">
            {labels.service} *
          </label>
          <select
            id="service_type"
            name="service_type"
            value={formData.service_type}
            onChange={handleChange}
            required
            disabled={!!hasPreSelection}
            className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <option value="">{labels.selectService}</option>
            <option value="transfer">{labels.transfer}</option>
            <option value="roundtrip">{labels.roundTrip}</option>
            <option value="general">{labels.general}</option>
          </select>
        </div>

        {/* TRANSFER SPECIFIC FIELDS */}
        {(formData.service_type === 'transfer' || formData.service_type === 'roundtrip') && (
          <>
            {/* Destination Selection */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium mb-2">
                {labels.destination} *
              </label>
              <select
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                disabled={!!preSelectedDestination}
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all disabled:opacity-50"
              >
                <option value="">{labels.selectDestination}</option>
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.slug}>
                    {locale === 'es' ? dest.name_es : dest.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Location (Hotel) */}
            <div>
              <label htmlFor="pickup_location" className="block text-sm font-medium mb-2">
                {labels.pickupLocation} *
              </label>
              <input
                type="text"
                id="pickup_location"
                name="pickup_location"
                value={formData.pickup_location}
                onChange={handleChange}
                required
                placeholder={locale === 'es' ? 'Ej: Hotel Xcaret Arte' : 'E.g.: Hotel Xcaret Arte'}
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Number of Passengers */}
            <div>
              <label htmlFor="number_of_passengers" className="block text-sm font-medium mb-2">
                {labels.numberOfPassengers} *
              </label>
              <input
                type="number"
                id="number_of_passengers"
                name="number_of_passengers"
                value={formData.number_of_passengers}
                onChange={handleChange}
                min="1"
                max="20"
                required
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Travel Date */}
            <div>
              <label htmlFor="travel_date" className="block text-sm font-medium mb-2">
                {labels.travelDate} *
              </label>
              <input
                type="date"
                id="travel_date"
                name="travel_date"
                value={formData.travel_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Departure Time */}
            <div>
              <label htmlFor="departure_time" className="block text-sm font-medium mb-2">
                {labels.departureTime} *
              </label>
              <select
                id="departure_time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              >
                <option value="">{labels.selectOption}</option>
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* Flight Number */}
            <div>
              <label htmlFor="flight_number" className="block text-sm font-medium mb-2">
                {labels.flightNumber}
              </label>
              <input
                type="text"
                id="flight_number"
                name="flight_number"
                value={formData.flight_number}
                onChange={handleChange}
                placeholder={locale === 'es' ? 'Ej: AA1234' : 'E.g.: AA1234'}
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Round Trip Fields */}
            {formData.service_type === 'roundtrip' && (
              <>
                {/* Return Date */}
                <div>
                  <label htmlFor="return_date" className="block text-sm font-medium mb-2">
                    {labels.returnDate}
                  </label>
                  <input
                    type="date"
                    id="return_date"
                    name="return_date"
                    value={formData.return_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Return Time */}
                {formData.return_date && (
                  <div>
                    <label htmlFor="return_time" className="block text-sm font-medium mb-2">
                      {labels.returnTime}
                    </label>
                    <select
                      id="return_time"
                      name="return_time"
                      value={formData.return_time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    >
                      <option value="">{labels.selectOption}</option>
                      {TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* COMMON FIELDS - APPEAR AFTER SERVICE-SPECIFIC FIELDS */}
        {formData.service_type && (
          <>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {labels.name} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {labels.email} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                {labels.phone} *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+52 998 123 4567"
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                {labels.message}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder={locale === 'es' ? 'Cuéntanos más sobre tu viaje...' : 'Tell us more about your trip...'}
                className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <ExclamationCircleIcon className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.service_type}
          className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? labels.sending : labels.submit}
        </button>
      </form>
    </div>
  );
}
