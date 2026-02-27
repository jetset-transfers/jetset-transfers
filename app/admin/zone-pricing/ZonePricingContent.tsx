'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase/client';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface ZonePricingContentProps {
  user: User;
}

interface TransferZone {
  id: string;
  zone_number: number;
  name_es: string;
  name_en: string;
  color: string;
  is_active: boolean;
}

interface VehiclePricing {
  vehicle_name: string;
  max_passengers: number;
  price_usd: number;
}

interface ZonePricing {
  id: string;
  origin_zone_id: string;
  destination_zone_id: string;
  vehicle_pricing: VehiclePricing[];
  duration_minutes: number | null;
  distance_km: number | null;
  is_active: boolean;
  origin_zone?: TransferZone;
  destination_zone?: TransferZone;
}

const DEFAULT_VEHICLES: VehiclePricing[] = [
  { vehicle_name: 'Sedan', max_passengers: 3, price_usd: 0 },
  { vehicle_name: 'SUV', max_passengers: 5, price_usd: 0 },
  { vehicle_name: 'Van', max_passengers: 10, price_usd: 0 },
  { vehicle_name: 'Sprinter', max_passengers: 14, price_usd: 0 },
];

export default function ZonePricingContent({ user }: ZonePricingContentProps) {
  const supabase = createClient();
  const [zones, setZones] = useState<TransferZone[]>([]);
  const [pricings, setPricings] = useState<ZonePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingPricing, setEditingPricing] = useState<ZonePricing | null>(null);
  const [formData, setFormData] = useState({
    origin_zone_id: '',
    destination_zone_id: '',
    vehicle_pricing: DEFAULT_VEHICLES,
    duration_minutes: '',
    distance_km: '',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load zones
    const { data: zonesData } = await supabase
      .from('transfer_zones')
      .select('*')
      .eq('is_active', true)
      .order('zone_number');

    // Load pricings with zone info
    const { data: pricingsData } = await supabase
      .from('zone_pricing')
      .select(`
        *,
        origin_zone:transfer_zones!origin_zone_id(*),
        destination_zone:transfer_zones!destination_zone_id(*)
      `)
      .order('origin_zone_id');

    setZones(zonesData || []);
    setPricings(pricingsData || []);
    setLoading(false);
  };

  const handleCreate = () => {
    setFormData({
      origin_zone_id: '',
      destination_zone_id: '',
      vehicle_pricing: DEFAULT_VEHICLES,
      duration_minutes: '',
      distance_km: '',
      is_active: true,
    });
    setEditingPricing(null);
    setIsEditing(true);
  };

  const handleEdit = (pricing: ZonePricing) => {
    setFormData({
      origin_zone_id: pricing.origin_zone_id,
      destination_zone_id: pricing.destination_zone_id,
      vehicle_pricing: pricing.vehicle_pricing || DEFAULT_VEHICLES,
      duration_minutes: pricing.duration_minutes?.toString() || '',
      distance_km: pricing.distance_km?.toString() || '',
      is_active: pricing.is_active,
    });
    setEditingPricing(pricing);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPricing(null);
  };

  const handleVehiclePriceChange = (index: number, field: keyof VehiclePricing, value: string | number) => {
    const updated = [...formData.vehicle_pricing];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, vehicle_pricing: updated });
  };

  const handleSave = async () => {
    if (!formData.origin_zone_id || !formData.destination_zone_id) {
      alert('Selecciona zona de origen y destino');
      return;
    }

    if (formData.origin_zone_id === formData.destination_zone_id) {
      alert('La zona de origen y destino deben ser diferentes');
      return;
    }

    setSaving(true);

    const dataToSave = {
      origin_zone_id: formData.origin_zone_id,
      destination_zone_id: formData.destination_zone_id,
      vehicle_pricing: formData.vehicle_pricing.filter(v => v.price_usd > 0),
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
      is_active: formData.is_active,
    };

    try {
      if (editingPricing) {
        const { error } = await supabase
          .from('zone_pricing')
          .update(dataToSave)
          .eq('id', editingPricing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('zone_pricing')
          .insert([dataToSave]);

        if (error) throw error;
      }

      await loadData();
      handleCancel();
    } catch (error: any) {
      console.error('Error saving:', error);
      if (error.code === '23505') {
        alert('Ya existe un precio para esta ruta. Edita el existente.');
      } else {
        alert('Error al guardar');
      }
    }

    setSaving(false);
  };

  const handleDelete = async (pricing: ZonePricing) => {
    const originName = pricing.origin_zone?.name_es || 'Origen';
    const destName = pricing.destination_zone?.name_es || 'Destino';

    if (!confirm(`¿Eliminar precio de "${originName}" a "${destName}"?`)) return;

    const { error } = await supabase
      .from('zone_pricing')
      .delete()
      .eq('id', pricing.id);

    if (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar');
    } else {
      await loadData();
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name_es : 'Desconocida';
  };

  const getZoneColor = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone?.color || '#666';
  };

  if (loading) {
    return (
      <AdminLayout userEmail={user.email || ''}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout userEmail={user.email || ''}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Precios por Zona</h1>
          <p className="text-gray-400 mt-1">
            Configura los precios de transfer entre zonas
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Ruta
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingPricing ? 'Editar Ruta' : 'Nueva Ruta'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Origin Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Zona de Origen *
              </label>
              <select
                value={formData.origin_zone_id}
                onChange={(e) => setFormData({ ...formData, origin_zone_id: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Seleccionar zona</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.zone_number}. {zone.name_es}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Zona de Destino *
              </label>
              <select
                value={formData.destination_zone_id}
                onChange={(e) => setFormData({ ...formData, destination_zone_id: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Seleccionar zona</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.zone_number}. {zone.name_es}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Duración (minutos)
              </label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                placeholder="Ej: 45"
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Distancia (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.distance_km}
                onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                placeholder="Ej: 35.5"
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Vehicle Pricing */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Precios por Vehículo (USD)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {formData.vehicle_pricing.map((vehicle, index) => (
                <div key={index} className="bg-navy-900/50 rounded-lg p-3">
                  <div className="text-sm font-medium text-white mb-1">
                    {vehicle.vehicle_name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    Máx. {vehicle.max_passengers} pasajeros
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={vehicle.price_usd || ''}
                      onChange={(e) => handleVehiclePriceChange(index, 'price_usd', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3 mb-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-navy-700 peer-focus:ring-2 peer-focus:ring-brand-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
            <span className="text-sm text-gray-300">Ruta activa</span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white rounded-lg transition-colors"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <CheckIcon className="w-4 h-4" />
              )}
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Pricings List */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Ruta
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Precios
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Info
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700">
            {pricings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay rutas configuradas. Crea una nueva ruta.
                </td>
              </tr>
            ) : (
              pricings.map((pricing) => (
                <tr key={pricing.id} className="hover:bg-navy-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pricing.origin_zone?.color || '#666' }}
                      />
                      <span className="text-white font-medium">
                        {pricing.origin_zone?.name_es || 'N/A'}
                      </span>
                      <ArrowRightIcon className="w-4 h-4 text-gray-500" />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pricing.destination_zone?.color || '#666' }}
                      />
                      <span className="text-white font-medium">
                        {pricing.destination_zone?.name_es || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(pricing.vehicle_pricing || []).map((v, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-navy-900 text-gray-300"
                        >
                          {v.vehicle_name}: ${v.price_usd}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {pricing.duration_minutes && <div>{pricing.duration_minutes} min</div>}
                    {pricing.distance_km && <div>{pricing.distance_km} km</div>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      pricing.is_active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {pricing.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(pricing)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pricing)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-navy-700 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Matrix View */}
      {zones.length > 0 && (
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Vista rápida de rutas configuradas</h3>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-1">
              {zones.map((originZone) => (
                <div key={originZone.id} className="flex flex-col gap-1">
                  <div
                    className="w-6 h-6 rounded text-[8px] font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: originZone.color }}
                    title={originZone.name_es}
                  >
                    {originZone.zone_number}
                  </div>
                  {zones.map((destZone) => {
                    if (originZone.id === destZone.id) {
                      return <div key={destZone.id} className="w-6 h-6 bg-navy-900 rounded" />;
                    }
                    const hasRoute = pricings.some(
                      p => p.origin_zone_id === originZone.id && p.destination_zone_id === destZone.id
                    );
                    return (
                      <div
                        key={destZone.id}
                        className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${
                          hasRoute
                            ? 'bg-green-500/30 text-green-400'
                            : 'bg-navy-900 text-gray-600'
                        }`}
                        title={`${originZone.name_es} → ${destZone.name_es}`}
                      >
                        {hasRoute ? '✓' : '-'}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Filas = Origen, Columnas = Destino. ✓ = Ruta configurada
          </p>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
