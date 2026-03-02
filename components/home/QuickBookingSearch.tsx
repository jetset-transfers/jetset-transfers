'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  ArrowsRightLeftIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

interface Destination {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  vehicle_pricing?: VehiclePricing[];
}

interface VehiclePricing {
  vehicle_name: string;
  max_passengers: number;
  price_usd: number;
}

interface QuickBookingSearchProps {
  locale: string;
  destinations: Destination[];
}

type ServiceType = 'private' | 'roundtrip' | 'oneway';

const TIME_OPTIONS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export default function QuickBookingSearch({ locale, destinations }: QuickBookingSearchProps) {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<ServiceType>('private');
  const [formData, setFormData] = useState({
    pickup_date: '',
    pickup_time: '',
    destination: '',
    return_date: '',
    return_time: '',
  });

  const labels = {
    es: {
      privateTransfer: 'Traslado Privado',
      roundTrip: 'Viaje Redondo',
      oneWay: 'Transfer',
      pickupDate: 'Fecha',
      pickupTime: 'Hora',
      origin: 'Origen',
      destination: 'Destino',
      search: 'Buscar',
      selectDestination: 'Selecciona destino',
      selectTime: 'Hora',
      airportCancun: 'Aeropuerto Cancún',
      comingSoon: 'Próximamente',
      oneWayDescription: 'Traslados entre hoteles y zonas turísticas',
      returnDate: 'Regreso',
      returnTime: 'Hora regreso',
    },
    en: {
      privateTransfer: 'Private Transfer',
      roundTrip: 'Round Trip',
      oneWay: 'Transfer',
      pickupDate: 'Date',
      pickupTime: 'Time',
      origin: 'Origin',
      destination: 'Destination',
      search: 'Search',
      selectDestination: 'Select destination',
      selectTime: 'Time',
      airportCancun: 'Cancun Airport',
      comingSoon: 'Coming soon',
      oneWayDescription: 'Transfers between hotels and tourist areas',
      returnDate: 'Return',
      returnTime: 'Return time',
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.es;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (serviceType === 'oneway') return;
    if (!formData.destination || !formData.pickup_date) return;

    // Build URL params for booking page
    const params = new URLSearchParams({
      destination: formData.destination,
      date: formData.pickup_date,
      type: serviceType,
    });

    if (formData.pickup_time) {
      params.set('time', formData.pickup_time);
    }

    // Add return date/time for round trip
    if (serviceType === 'roundtrip') {
      if (formData.return_date) {
        params.set('return_date', formData.return_date);
      }
      if (formData.return_time) {
        params.set('return_time', formData.return_time);
      }
    }

    router.push(`/${locale}/booking?${params.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const today = new Date().toISOString().split('T')[0];

  const tabs = [
    { id: 'private' as ServiceType, label: t.privateTransfer, icon: PaperAirplaneIcon },
    { id: 'roundtrip' as ServiceType, label: t.roundTrip, icon: ArrowsRightLeftIcon },
    { id: 'oneway' as ServiceType, label: t.oneWay, icon: TruckIcon, isNew: true },
  ];

  return (
    <section id="booking" className="relative z-20 bg-gray-50 dark:bg-navy-900/50 pb-8 pt-4">
      <div className="relative -mt-16 sm:-mt-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-navy-900 rounded-xl shadow-xl border border-gray-200 dark:border-navy-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-navy-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = serviceType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setServiceType(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.isNew && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-white rounded">
                      NEW
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4">
            {(serviceType === 'private' || serviceType === 'roundtrip') && (
              <div className="space-y-3">
                {/* First row: Origin, Destination, Date, Time */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Origin */}
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                      {t.origin}
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-navy-800 rounded-lg">
                      <MapPinIcon className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {t.airportCancun}
                      </span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                      {t.destination}
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">{t.selectDestination}</option>
                        {destinations.map(dest => (
                          <option key={dest.id} value={dest.slug}>
                            {locale === 'es' ? dest.name_es : dest.name_en}
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="w-full sm:w-36">
                    <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                      {t.pickupDate}
                    </label>
                    <div className="relative">
                      <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        name="pickup_date"
                        value={formData.pickup_date}
                        onChange={handleChange}
                        min={today}
                        required
                        className="w-full pl-9 pr-2 py-2.5 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="w-full sm:w-28">
                    <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                      {t.pickupTime}
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="pickup_time"
                        value={formData.pickup_time}
                        onChange={handleChange}
                        className="w-full pl-9 pr-6 py-2.5 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">{t.selectTime}</option>
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Button - Only show on private transfer */}
                  {serviceType === 'private' && (
                    <div className="w-full sm:w-auto flex items-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        <span>{t.search}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Second row: Return Date, Return Time, Button - Only for round trip */}
                {serviceType === 'roundtrip' && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-200 dark:border-navy-700">
                    <div className="flex-1 min-w-0 flex items-center">
                      <ArrowsRightLeftIcon className="w-4 h-4 text-brand-500 mr-2" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {locale === 'es' ? 'Viaje de regreso' : 'Return trip'}
                      </span>
                    </div>

                    {/* Return Date */}
                    <div className="w-full sm:w-36">
                      <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                        {t.returnDate}
                      </label>
                      <div className="relative">
                        <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          name="return_date"
                          value={formData.return_date}
                          onChange={handleChange}
                          min={formData.pickup_date || today}
                          className="w-full pl-9 pr-2 py-2.5 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Return Time */}
                    <div className="w-full sm:w-28">
                      <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
                        {t.returnTime}
                      </label>
                      <div className="relative">
                        <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="return_time"
                          value={formData.return_time}
                          onChange={handleChange}
                          className="w-full pl-9 pr-6 py-2.5 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none cursor-pointer"
                        >
                          <option value="">{t.selectTime}</option>
                          {TIME_OPTIONS.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="w-full sm:w-auto flex items-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        <span>{t.search}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* One Way - Coming Soon */}
            {serviceType === 'oneway' && (
              <div className="text-center py-6">
                <TruckIcon className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t.oneWayDescription}
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-medium">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {t.comingSoon}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
