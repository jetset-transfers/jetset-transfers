'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  TicketIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  TruckIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  GlobeAltIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface DestinationData {
  name_es: string;
  name_en: string;
  slug: string;
}

interface Booking {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  destination_id: string | null;
  pickup_location: string | null;
  pickup_date: string;
  pickup_time: string | null;
  return_date: string | null;
  return_time: string | null;
  num_passengers: number;
  pickup_flight_number: string | null;
  vehicle_name: string | null;
  price_usd: number;
  total_usd: number;
  payment_status: string;
  payment_method: string | null;
  payment_reference: string | null;
  status: string;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  destinations: DestinationData | null;
}

interface BookingsContentProps {
  user: User;
  bookings: Booking[];
}

// Status configurations
const bookingStatusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400', icon: ClockIcon },
  confirmed: { label: 'Confirmado', color: 'bg-green-500/20 text-green-400', icon: CheckCircleIcon },
  completed: { label: 'Completado', color: 'bg-blue-500/20 text-blue-400', icon: CheckCircleIcon },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', icon: XCircleIcon },
};

const paymentStatusConfig = {
  pending: { label: 'Pago pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
  paid: { label: 'Pagado', color: 'bg-green-500/20 text-green-400' },
  failed: { label: 'Fallido', color: 'bg-red-500/20 text-red-400' },
  refunded: { label: 'Reembolsado', color: 'bg-purple-500/20 text-purple-400' },
};

const serviceTypes: Record<string, string> = {
  transfer: 'Transfer Privado',
  roundtrip: 'Viaje Redondo',
  private: 'Transfer Privado',
};

export default function BookingsContent({ user, bookings: initialBookings }: BookingsContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  // Determine booking source
  const getBookingSource = (booking: Booking): { label: string; color: string; icon: typeof MapPinIcon } => {
    if (booking.destination_id) {
      return {
        label: 'Destino',
        color: 'bg-purple-500/20 text-purple-400',
        icon: MapPinIcon,
      };
    }
    return {
      label: 'Zonas',
      color: 'bg-cyan-500/20 text-cyan-400',
      icon: GlobeAltIcon,
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          destinations:destination_id(name_es, name_en, slug)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBookings(data || []);
      toast.success('Reservas actualizadas');
    } catch {
      toast.error('Error al actualizar reservas');
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      setBookings(bookings.map(b =>
        b.id === id ? { ...b, status: newStatus } : b
      ));
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
      toast.success('Estado actualizado');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatTravelDate = (dateString: string | null) => {
    if (!dateString) return null;
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Parse route from pickup_location for zone transfers
  const parseRoute = (pickupLocation: string | null): { origin: string; destination: string } | null => {
    if (!pickupLocation || !pickupLocation.includes('→')) return null;
    const parts = pickupLocation.split('→').map(p => p.trim());
    return { origin: parts[0], destination: parts[1] };
  };

  // Extract full addresses from special_requests field
  const parseAddresses = (specialRequests: string | null): { origin: string | null; destination: string | null; userNotes: string | null } => {
    if (!specialRequests) return { origin: null, destination: null, userNotes: null };

    let userNotes: string | null = null;
    let originAddress: string | null = null;
    let destinationAddress: string | null = null;

    if (specialRequests.includes('---')) {
      const parts = specialRequests.split('---');
      userNotes = parts[0].trim() || null;

      const addressPart = parts[1] || '';
      const originMatch = addressPart.match(/ORIGEN:\s*(.+?)(?=\nDESTINO:|$)/s);
      const destMatch = addressPart.match(/DESTINO:\s*(.+?)$/s);

      if (originMatch) originAddress = originMatch[1].trim();
      if (destMatch) destinationAddress = destMatch[1].trim();
    } else {
      userNotes = specialRequests;
    }

    return { origin: originAddress, destination: destinationAddress, userNotes };
  };

  // Generate Google Maps link
  const getGoogleMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (filterPayment !== 'all' && b.payment_status !== filterPayment) return false;
    return true;
  });

  // Count by payment status
  const paidCount = bookings.filter(b => b.payment_status === 'paid').length;
  const pendingCount = bookings.filter(b => b.payment_status === 'pending').length;

  return (
    <AdminLayout userEmail={user.email || ''}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">Reservas</h1>
            {paidCount > 0 && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                {paidCount} pagada{paidCount > 1 ? 's' : ''}
              </span>
            )}
            {pendingCount > 0 && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-navy-800 hover:bg-navy-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
        <p className="text-navy-400 mt-1">Reservas realizadas desde el sitio web</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        {/* Payment Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-navy-500 text-sm">Pago:</span>
          <button
            onClick={() => setFilterPayment('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterPayment === 'all'
                ? 'bg-brand-500 text-white'
                : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
            }`}
          >
            Todos ({bookings.length})
          </button>
          {Object.entries(paymentStatusConfig).map(([key, config]) => {
            const count = bookings.filter(b => b.payment_status === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setFilterPayment(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterPayment === key
                    ? 'bg-brand-500 text-white'
                    : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Booking Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-navy-500 text-sm">Estado:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-brand-500 text-white'
                : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
            }`}
          >
            Todos
          </button>
          {Object.entries(bookingStatusConfig).map(([key, config]) => {
            const count = bookings.filter(b => b.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === key
                    ? 'bg-brand-500 text-white'
                    : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List */}
        <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-navy-500 bg-navy-900 rounded-xl border border-navy-800">
              No hay reservas
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const status = bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig] || bookingStatusConfig.pending;
              const paymentStatus = paymentStatusConfig[booking.payment_status as keyof typeof paymentStatusConfig] || paymentStatusConfig.pending;
              const source = getBookingSource(booking);
              const isSelected = selectedBooking?.id === booking.id;

              return (
                <button
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-navy-800 border-brand-500'
                      : 'bg-navy-900 border-navy-800 hover:border-navy-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-brand-400 font-mono font-bold text-sm">{booking.booking_number}</p>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${source.color}`}>
                          {source.label}
                        </span>
                      </div>
                      <p className="text-white font-medium truncate mt-1">{booking.customer_name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${paymentStatus.color}`}>
                      {paymentStatus.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-navy-400 text-sm mb-2">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{formatTravelDate(booking.pickup_date)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-green-400 font-semibold text-sm">
                      ${booking.total_usd} USD
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Booking Detail */}
        <div className="lg:col-span-2">
          {selectedBooking ? (
            <div className="bg-navy-900 rounded-xl border border-navy-800 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-navy-800">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-brand-400 font-mono font-bold text-xl">{selectedBooking.booking_number}</p>
                      {(() => {
                        const source = getBookingSource(selectedBooking);
                        const SourceIcon = source.icon;
                        return (
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${source.color}`}>
                            <SourceIcon className="w-3 h-3" />
                            {source.label}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-navy-400 text-sm mt-1">
                      Creada: {formatDate(selectedBooking.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="lg:hidden p-2 text-navy-400 hover:text-white rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-380px)] overflow-y-auto">
                {/* Payment & Status Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-navy-800 rounded-lg">
                    <p className="text-navy-500 text-xs font-semibold uppercase mb-2">Estado del Pago</p>
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        paymentStatusConfig[selectedBooking.payment_status as keyof typeof paymentStatusConfig]?.color || ''
                      }`}>
                        {paymentStatusConfig[selectedBooking.payment_status as keyof typeof paymentStatusConfig]?.label || selectedBooking.payment_status}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-400 mt-2">
                      ${selectedBooking.total_usd} USD
                    </p>
                    {selectedBooking.payment_reference && (
                      <p className="text-navy-500 text-xs mt-1 truncate">
                        Ref: {selectedBooking.payment_reference}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-navy-800 rounded-lg">
                    <p className="text-navy-500 text-xs font-semibold uppercase mb-2">Tipo de Servicio</p>
                    <div className="flex items-center gap-2">
                      {selectedBooking.service_type === 'roundtrip' ? (
                        <ArrowPathIcon className="w-5 h-5 text-brand-400" />
                      ) : (
                        <TruckIcon className="w-5 h-5 text-brand-400" />
                      )}
                      <span className="text-white font-medium">
                        {serviceTypes[selectedBooking.service_type] || selectedBooking.service_type}
                      </span>
                    </div>
                    {selectedBooking.vehicle_name && (
                      <p className="text-navy-300 mt-2">
                        <TruckIcon className="w-4 h-4 inline mr-1" />
                        {selectedBooking.vehicle_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 bg-navy-800 rounded-lg">
                  <p className="text-navy-400 text-xs font-semibold uppercase mb-3">Información del Cliente</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-white">
                      <UserGroupIcon className="w-4 h-4 text-navy-500" />
                      <span className="font-medium">{selectedBooking.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-navy-300">
                      <EnvelopeIcon className="w-4 h-4 text-navy-500" />
                      <a href={`mailto:${selectedBooking.customer_email}`} className="hover:text-brand-400 truncate">
                        {selectedBooking.customer_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-navy-300">
                      <PhoneIcon className="w-4 h-4 text-navy-500" />
                      <a href={`tel:${selectedBooking.customer_phone}`} className="hover:text-brand-400">
                        {selectedBooking.customer_phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-navy-300">
                      <UserGroupIcon className="w-4 h-4 text-navy-500" />
                      <span>{selectedBooking.num_passengers} pasajero{selectedBooking.num_passengers > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Route/Destination Info */}
                <div className="p-4 bg-navy-800 rounded-lg">
                  <p className="text-navy-400 text-xs font-semibold uppercase mb-3">Ruta del Traslado</p>

                  {selectedBooking.destinations ? (
                    // Predefined destination
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <MapPinIcon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedBooking.destinations.name_es}</p>
                        <p className="text-navy-500 text-sm">Destino predefinido</p>
                      </div>
                    </div>
                  ) : (
                    // Zone transfer with route and full addresses
                    (() => {
                      const route = parseRoute(selectedBooking.pickup_location);
                      const addresses = parseAddresses(selectedBooking.special_requests);

                      if (route) {
                        return (
                          <div className="space-y-4">
                            {/* Route names */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 flex-1">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                  <MapPinIcon className="w-4 h-4 text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-navy-500 text-xs">Origen</p>
                                  <p className="text-white text-sm font-medium">{route.origin}</p>
                                </div>
                              </div>
                              <ArrowRightIcon className="w-5 h-5 text-navy-600 flex-shrink-0" />
                              <div className="flex items-center gap-2 flex-1">
                                <div className="p-2 bg-brand-500/20 rounded-lg">
                                  <MapPinIcon className="w-4 h-4 text-brand-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-navy-500 text-xs">Destino</p>
                                  <p className="text-white text-sm font-medium">{route.destination}</p>
                                </div>
                              </div>
                            </div>

                            {/* Full addresses with Google Maps links */}
                            {(addresses.origin || addresses.destination) && (
                              <div className="pt-3 border-t border-navy-700 space-y-3">
                                <p className="text-navy-500 text-xs font-semibold uppercase">Direcciones completas</p>

                                {addresses.origin && (
                                  <div>
                                    <p className="text-navy-500 text-xs mb-1">📍 Origen:</p>
                                    <a
                                      href={getGoogleMapsLink(addresses.origin)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-brand-400 hover:text-brand-300 text-sm underline break-words"
                                    >
                                      {addresses.origin} 🗺️
                                    </a>
                                  </div>
                                )}

                                {addresses.destination && (
                                  <div>
                                    <p className="text-navy-500 text-xs mb-1">📍 Destino:</p>
                                    <a
                                      href={getGoogleMapsLink(addresses.destination)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-brand-400 hover:text-brand-300 text-sm underline break-words"
                                    >
                                      {addresses.destination} 🗺️
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return (
                        <p className="text-white">{selectedBooking.pickup_location || 'No especificado'}</p>
                      );
                    })()
                  )}
                </div>

                {/* Travel Dates */}
                <div className="p-4 bg-navy-800 rounded-lg">
                  <p className="text-navy-400 text-xs font-semibold uppercase mb-3">Fechas del Viaje</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-navy-500 text-xs mb-1">Fecha de pickup</p>
                      <div className="flex items-center gap-2 text-white">
                        <CalendarIcon className="w-4 h-4 text-navy-500" />
                        <span>{formatTravelDate(selectedBooking.pickup_date)}</span>
                      </div>
                      {selectedBooking.pickup_time && selectedBooking.pickup_time !== '00:00' && (
                        <div className="flex items-center gap-2 text-navy-300 mt-1">
                          <ClockIcon className="w-4 h-4 text-navy-500" />
                          <span>{selectedBooking.pickup_time}</span>
                        </div>
                      )}
                    </div>

                    {selectedBooking.service_type === 'roundtrip' && selectedBooking.return_date && (
                      <div>
                        <p className="text-navy-500 text-xs mb-1">Fecha de regreso</p>
                        <div className="flex items-center gap-2 text-white">
                          <ArrowPathIcon className="w-4 h-4 text-navy-500" />
                          <span>{formatTravelDate(selectedBooking.return_date)}</span>
                        </div>
                        {selectedBooking.return_time && (
                          <div className="flex items-center gap-2 text-navy-300 mt-1">
                            <ClockIcon className="w-4 h-4 text-navy-500" />
                            <span>{selectedBooking.return_time}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Flight Info */}
                {selectedBooking.pickup_flight_number && (
                  <div className="p-4 bg-navy-800 rounded-lg">
                    <p className="text-navy-400 text-xs font-semibold uppercase mb-2">Vuelo</p>
                    <div className="flex items-center gap-2 text-white">
                      <PaperAirplaneIcon className="w-4 h-4 text-navy-500" />
                      <span className="font-medium">{selectedBooking.pickup_flight_number}</span>
                    </div>
                  </div>
                )}

                {/* Special Requests / User Notes */}
                {(() => {
                  const { userNotes } = parseAddresses(selectedBooking.special_requests);
                  if (userNotes) {
                    return (
                      <div className="p-4 bg-navy-800 rounded-lg">
                        <p className="text-navy-400 text-xs font-semibold uppercase mb-2">Notas / Solicitudes especiales</p>
                        <p className="text-white whitespace-pre-wrap">{userNotes}</p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Status Change Actions */}
                <div className="pt-4 border-t border-navy-800">
                  <p className="text-navy-500 text-sm mb-3">Cambiar estado de la reserva:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(bookingStatusConfig).map(([key, config]) => {
                      const StatusIcon = config.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => handleStatusChange(selectedBooking.id, key)}
                          disabled={loading || selectedBooking.status === key}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedBooking.status === key
                              ? config.color + ' cursor-default'
                              : 'bg-navy-800 text-navy-400 hover:bg-navy-700 hover:text-white'
                          }`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* WhatsApp Contact Button */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${selectedBooking.customer_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center bg-navy-900 rounded-xl border border-navy-800">
              <div className="text-center">
                <TicketIcon className="w-12 h-12 text-navy-700 mx-auto mb-3" />
                <p className="text-navy-500">Selecciona una reserva para ver los detalles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
