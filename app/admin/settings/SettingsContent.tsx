'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  KeyIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

interface SettingsContentProps {
  user: User;
  settings: SiteSetting[];
}

export default function SettingsContent({ user, settings: initialSettings }: SettingsContentProps) {
  const router = useRouter();
  const supabase = createClient();

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Currency settings state
  const [siteCurrency, setSiteCurrency] = useState(
    initialSettings.find(s => s.key === 'site_currency')?.value || 'USD'
  );
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currencyError, setCurrencyError] = useState('');
  const [currencySuccess, setCurrencySuccess] = useState('');

  // Round trip discount state
  const [roundTripDiscount, setRoundTripDiscount] = useState(
    initialSettings.find(s => s.key === 'roundtrip_discount')?.value || '10'
  );
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordSuccess('Contraseña actualizada correctamente');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Error al actualizar contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCurrencySettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrencyError('');
    setCurrencySuccess('');
    setCurrencyLoading(true);

    try {
      // Actualizar moneda del sitio
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'site_currency',
          value: siteCurrency,
          description: 'Moneda en la que se muestran los precios del sitio'
        }, { onConflict: 'key' });

      if (error) throw error;

      setCurrencySuccess('Moneda del sitio actualizada');
      router.refresh();
    } catch (err: any) {
      setCurrencyError(err.message || 'Error al guardar configuración');
    } finally {
      setCurrencyLoading(false);
    }
  };

  const handleRoundTripDiscountSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError('');
    setDiscountSuccess('');
    setDiscountLoading(true);

    // Validate discount value
    const discountValue = parseFloat(roundTripDiscount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 50) {
      setDiscountError('El descuento debe ser un número entre 0 y 50');
      setDiscountLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'roundtrip_discount',
          value: roundTripDiscount,
          description: 'Porcentaje de descuento para viajes redondos (round trips)'
        }, { onConflict: 'key' });

      if (error) throw error;

      setDiscountSuccess('Descuento de viajes redondos actualizado');
      toast.success('Descuento actualizado correctamente');
      router.refresh();
    } catch (err: any) {
      setDiscountError(err.message || 'Error al guardar configuración');
    } finally {
      setDiscountLoading(false);
    }
  };

  // Calculate example prices for preview
  const exampleOneWayPrice = 100;
  const discountPercent = parseFloat(roundTripDiscount) || 0;
  const exampleRoundTripPrice = exampleOneWayPrice * 2 * (1 - discountPercent / 100);

  return (
    <AdminLayout userEmail={user.email || ''}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Configuración</h1>
        <p className="text-navy-400 mt-1">Ajustes del sitio y preferencias de cuenta</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Currency Settings */}
        <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-medium text-white">Moneda del sitio</h2>
          </div>

          <p className="text-navy-400 text-sm mb-4">
            Selecciona en qué moneda se mostrarán los precios en el sitio web.
          </p>

          {currencyError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {currencyError}
            </div>
          )}

          {currencySuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              {currencySuccess}
            </div>
          )}

          <form onSubmit={handleCurrencySettingsSave} className="space-y-4">
            <div className="flex gap-4">
              <label
                className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  siteCurrency === 'USD'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-navy-700 hover:border-navy-600'
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  value="USD"
                  checked={siteCurrency === 'USD'}
                  onChange={(e) => setSiteCurrency(e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">$</span>
                  <p className="text-white font-medium mt-1">USD</p>
                  <p className="text-navy-400 text-xs">Dólar estadounidense</p>
                </div>
              </label>

              <label
                className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  siteCurrency === 'MXN'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-navy-700 hover:border-navy-600'
                }`}
              >
                <input
                  type="radio"
                  name="currency"
                  value="MXN"
                  checked={siteCurrency === 'MXN'}
                  onChange={(e) => setSiteCurrency(e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">$</span>
                  <p className="text-white font-medium mt-1">MXN</p>
                  <p className="text-navy-400 text-xs">Peso mexicano</p>
                </div>
              </label>
            </div>

            <p className="text-xs text-navy-500">
              Los precios que ingreses en Tours y Destinos se mostrarán en esta moneda.
            </p>

            <button
              type="submit"
              disabled={currencyLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors"
            >
              {currencyLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>

        {/* Round Trip Discount Settings */}
        <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <ReceiptPercentIcon className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-medium text-white">Descuento de Viaje Redondo</h2>
          </div>

          <p className="text-navy-400 text-sm mb-4">
            Configura el porcentaje de descuento que se aplica automáticamente a todos los viajes redondos (Round Trips).
            La fórmula es: <span className="text-white font-mono">(Precio One-way × 2) - Descuento%</span>
          </p>

          {discountError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {discountError}
            </div>
          )}

          {discountSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              {discountSuccess}
            </div>
          )}

          <form onSubmit={handleRoundTripDiscountSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2">
                Porcentaje de descuento
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={roundTripDiscount}
                    onChange={(e) => setRoundTripDiscount(e.target.value)}
                    className="w-24 px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 font-medium">%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowPathIcon className="w-5 h-5 text-navy-500" />
                  <span className="text-navy-400 text-sm">Se aplica a todas las rutas</span>
                </div>
              </div>
            </div>

            {/* Price Preview */}
            <div className="bg-navy-800/50 rounded-lg p-4 border border-navy-700">
              <p className="text-xs text-navy-400 mb-3 uppercase tracking-wide">Vista previa del cálculo</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-navy-400">Precio One-way (ejemplo)</span>
                  <span className="text-white">${exampleOneWayPrice} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-400">Precio base Round Trip (×2)</span>
                  <span className="text-white">${exampleOneWayPrice * 2} USD</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Descuento ({discountPercent}%)</span>
                  <span>-${(exampleOneWayPrice * 2 * discountPercent / 100).toFixed(2)} USD</span>
                </div>
                <div className="border-t border-navy-600 pt-2 flex justify-between font-semibold">
                  <span className="text-white">Precio final Round Trip</span>
                  <span className="text-brand-500">${exampleRoundTripPrice.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-navy-500">
              Este descuento se aplicará automáticamente cuando los clientes seleccionen &quot;Viaje Redondo&quot; en cualquier ruta.
            </p>

            <button
              type="submit"
              disabled={discountLoading}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white rounded-lg transition-colors"
            >
              {discountLoading ? 'Guardando...' : 'Guardar descuento'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cog6ToothIcon className="w-5 h-5 text-navy-400" />
            <h2 className="text-lg font-medium text-white">Información de la cuenta</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-400 mb-1">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-400 mb-1">ID de usuario</label>
              <p className="text-navy-500 text-sm font-mono">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-400 mb-1">Último inicio de sesión</label>
              <p className="text-navy-300">
                {user.last_sign_in_at
                  ? new Intl.DateTimeFormat('es-MX', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    }).format(new Date(user.last_sign_in_at))
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-navy-900 rounded-xl border border-navy-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <KeyIcon className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-medium text-white">Cambiar contraseña</h2>
          </div>

          {passwordError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-1">
                Nueva contraseña
              </label>
              <p className="text-xs text-navy-500 mb-2">
                Mínimo 6 caracteres. Usa letras, números y símbolos para mayor seguridad.
              </p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="ej: MiContraseña123!"
                required
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-300 mb-1">
                Confirmar nueva contraseña
              </label>
              <p className="text-xs text-navy-500 mb-2">
                Escribe la misma contraseña para confirmar que es correcta.
              </p>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                required
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white rounded-lg transition-colors"
            >
              {passwordLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-navy-900 rounded-xl border border-red-500/30 p-6">
          <h2 className="text-lg font-medium text-red-400 mb-4">Zona de peligro</h2>
          <p className="text-navy-400 text-sm mb-4">
            Estas acciones son irreversibles. Procede con precaución.
          </p>
          <button
            onClick={() => {
              toast('¿Cerrar sesión?', {
                description: 'Se cerrará tu sesión en todos los dispositivos',
                action: {
                  label: 'Cerrar sesión',
                  onClick: async () => {
                    await supabase.auth.signOut();
                    router.push('/admin/login');
                    router.refresh();
                  },
                },
                cancel: {
                  label: 'Cancelar',
                  onClick: () => {},
                },
              });
            }}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
          >
            Cerrar sesión en todos los dispositivos
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
