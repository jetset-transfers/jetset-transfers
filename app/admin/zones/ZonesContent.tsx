'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase/client';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface ZonesContentProps {
  user: User;
}

interface TransferZone {
  id: string;
  zone_number: number;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  color: string;
  is_active: boolean;
  display_order: number;
  boundaries: number[][];
}

const DEFAULT_ZONE: Omit<TransferZone, 'id'> = {
  zone_number: 0,
  name_es: '',
  name_en: '',
  description_es: '',
  description_en: '',
  color: '#3B82F6',
  is_active: true,
  display_order: 0,
  boundaries: [],
};

const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

export default function ZonesContent({ user }: ZonesContentProps) {
  const supabase = createClient();
  const [zones, setZones] = useState<TransferZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingZone, setEditingZone] = useState<TransferZone | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<TransferZone, 'id'>>(DEFAULT_ZONE);

  // Load zones
  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transfer_zones')
      .select('*')
      .order('zone_number');

    if (error) {
      console.error('Error loading zones:', error);
    } else {
      setZones(data || []);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    const nextNumber = zones.length > 0 ? Math.max(...zones.map(z => z.zone_number)) + 1 : 1;
    setFormData({ ...DEFAULT_ZONE, zone_number: nextNumber, display_order: nextNumber });
    setIsCreating(true);
    setEditingZone(null);
  };

  const handleEdit = (zone: TransferZone) => {
    setFormData({
      zone_number: zone.zone_number,
      name_es: zone.name_es,
      name_en: zone.name_en,
      description_es: zone.description_es || '',
      description_en: zone.description_en || '',
      color: zone.color,
      is_active: zone.is_active,
      display_order: zone.display_order,
      boundaries: zone.boundaries || [],
    });
    setEditingZone(zone);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingZone(null);
    setIsCreating(false);
    setFormData(DEFAULT_ZONE);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('transfer_zones')
          .insert([formData]);

        if (error) throw error;
      } else if (editingZone) {
        const { error } = await supabase
          .from('transfer_zones')
          .update(formData)
          .eq('id', editingZone.id);

        if (error) throw error;
      }

      await loadZones();
      handleCancel();
    } catch (error) {
      console.error('Error saving zone:', error);
      alert('Error al guardar la zona');
    }

    setSaving(false);
  };

  const handleDelete = async (zone: TransferZone) => {
    if (!confirm(`¿Eliminar la zona "${zone.name_es}"?`)) return;

    const { error } = await supabase
      .from('transfer_zones')
      .delete()
      .eq('id', zone.id);

    if (error) {
      console.error('Error deleting zone:', error);
      alert('Error al eliminar la zona');
    } else {
      await loadZones();
    }
  };

  const handleToggleActive = async (zone: TransferZone) => {
    const { error } = await supabase
      .from('transfer_zones')
      .update({ is_active: !zone.is_active })
      .eq('id', zone.id);

    if (error) {
      console.error('Error toggling zone:', error);
    } else {
      await loadZones();
    }
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
          <h1 className="text-2xl font-bold text-white">Zonas de Transfer</h1>
          <p className="text-gray-400 mt-1">
            Gestiona las zonas geográficas para el servicio Transfer One Way
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Zona
        </button>
      </div>

      {/* Form Modal/Panel */}
      {(isCreating || editingZone) && (
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Nueva Zona' : 'Editar Zona'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Zone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Número de Zona *
              </label>
              <input
                type="number"
                value={formData.zone_number}
                onChange={(e) => setFormData({ ...formData, zone_number: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Color
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        formData.color === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Name ES */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre (Español) *
              </label>
              <input
                type="text"
                value={formData.name_es}
                onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                placeholder="Ej: Zona Hotelera Cancún"
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Name EN */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre (Inglés) *
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="E.g.: Cancun Hotel Zone"
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Description ES */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descripción (Español)
              </label>
              <textarea
                value={formData.description_es || ''}
                onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            {/* Description EN */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descripción (Inglés)
              </label>
              <textarea
                value={formData.description_en || ''}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-navy-700 peer-focus:ring-2 peer-focus:ring-brand-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
              <span className="text-sm text-gray-300">Zona activa</span>
            </div>
          </div>

          {/* Map Editor Placeholder */}
          <div className="mt-4 p-4 bg-navy-900/50 rounded-lg border border-dashed border-navy-700">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPinIcon className="w-5 h-5" />
              <span className="text-sm">
                Editor de mapa para definir límites de zona (requiere API key de Google Maps)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.name_es || !formData.name_en}
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

      {/* Zones List */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Zona
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Descripción
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
            {zones.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay zonas creadas. Ejecuta la migración SQL y recarga.
                </td>
              </tr>
            ) : (
              zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-navy-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: zone.color }}
                    >
                      {zone.zone_number}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{zone.name_es}</div>
                    <div className="text-sm text-gray-400">{zone.name_en}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {zone.description_es || '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(zone)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        zone.is_active
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                    >
                      {zone.is_active ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(zone)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(zone)}
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

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <h3 className="font-medium text-blue-400 mb-2">Próximos pasos</h3>
        <ul className="text-sm text-blue-300/80 space-y-1">
          <li>1. Ejecuta el SQL de migración en Supabase para crear las tablas</li>
          <li>2. Define los límites geográficos de cada zona (cuando tengas la API key de Google)</li>
          <li>3. Configura los precios entre zonas en la sección de "Precios por Zona"</li>
        </ul>
      </div>
      </div>
    </AdminLayout>
  );
}
