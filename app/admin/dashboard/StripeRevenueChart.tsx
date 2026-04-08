'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CurrencyDollarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface RevenueData {
  chartData: { date: string; amount: number; count: number }[];
  totalRevenue: number;
  totalBookings: number;
  monthlyRevenue: number;
  monthlyBookings: number;
  averageBooking: number;
}

export default function StripeRevenueChart() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/stripe-revenue');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRevenue(); }, [fetchRevenue]);

  if (loading) {
    return (
      <div className="bg-navy-900 rounded-xl border border-navy-800 p-6" style={{ minHeight: '320px' }}>
        <div className="flex items-center gap-3 mb-4">
          <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
          <h2 className="text-lg font-medium text-white">Ingresos Stripe</h2>
        </div>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
          <h2 className="text-lg font-medium text-white">Ingresos Stripe</h2>
        </div>
        <p className="text-navy-400 text-sm">No se pudieron cargar los datos de Stripe.</p>
        <button onClick={fetchRevenue} className="text-brand-400 text-sm mt-2 hover:underline">Reintentar</button>
      </div>
    );
  }

  const maxAmount = Math.max(...data.chartData.map(d => d.amount), 1);

  return (
    <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
          <h2 className="text-lg font-medium text-white">Ingresos Stripe</h2>
        </div>
        <button
          onClick={fetchRevenue}
          className="p-1.5 rounded-lg hover:bg-navy-800 text-navy-400 hover:text-white transition-colors"
          title="Actualizar"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-navy-800 rounded-lg">
          <p className="text-xs text-navy-400">Este mes</p>
          <p className="text-lg font-bold text-green-400">${data.monthlyRevenue.toFixed(2)}</p>
          <p className="text-xs text-navy-500">{data.monthlyBookings} reservas</p>
        </div>
        <div className="p-3 bg-navy-800 rounded-lg">
          <p className="text-xs text-navy-400">Últimos 30 días</p>
          <p className="text-lg font-bold text-white">${data.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-navy-500">{data.totalBookings} reservas</p>
        </div>
        <div className="p-3 bg-navy-800 rounded-lg">
          <p className="text-xs text-navy-400">Promedio</p>
          <p className="text-lg font-bold text-brand-400">${data.averageBooking.toFixed(2)}</p>
          <p className="text-xs text-navy-500">por reserva</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="relative">
        <p className="text-xs text-navy-500 mb-2">Ingresos diarios (últimos 30 días) — USD</p>
        <div className="flex items-end gap-[2px]" style={{ height: '128px' }}>
          {data.chartData.map((day) => {
            const heightPx = maxAmount > 0 ? Math.round((day.amount / maxAmount) * 120) : 0;
            const date = new Date(day.date + 'T12:00:00');
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <div
                key={day.date}
                className="flex-1 group relative flex items-end"
                style={{ height: '128px' }}
              >
                <div
                  className={`w-full rounded-t-sm transition-all cursor-pointer ${
                    day.amount > 0
                      ? isToday ? 'bg-green-400' : 'bg-green-500/70 hover:bg-green-400'
                      : 'bg-navy-800/50'
                  }`}
                  style={{ height: `${day.amount > 0 ? Math.max(heightPx, 4) : 2}px` }}
                />
                {/* Tooltip */}
                {day.amount > 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                      <p className="text-white font-medium">${day.amount.toFixed(2)} USD</p>
                      <p className="text-navy-400">{day.count} reserva{day.count !== 1 ? 's' : ''}</p>
                      <p className="text-navy-500">{date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* X-axis labels */}
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-navy-600">
            {new Date(data.chartData[0]?.date + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
          </span>
          <span className="text-[10px] text-navy-600">
            {new Date(data.chartData[Math.floor(data.chartData.length / 2)]?.date + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
          </span>
          <span className="text-[10px] text-navy-600">Hoy</span>
        </div>
      </div>
    </div>
  );
}
