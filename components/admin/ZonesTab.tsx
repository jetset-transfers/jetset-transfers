'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  MapPinIcon,
  SparklesIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export interface Zone {
  key: string;
  name_es: string;
  name_en: string;
  description_es?: string;
  description_en?: string;
  icon?: string;
}

interface ZonesTabProps {
  zones: Zone[];
  onUpdate: (zones: Zone[]) => Promise<void>;
}

const ICON_OPTIONS = [
  { value: 'MapPinIcon', label: 'Pin de Mapa', icon: MapPinIcon },
  { value: 'SparklesIcon', label: 'Estrellas', icon: SparklesIcon },
];

export default function ZonesTab({ zones: initialZones, onUpdate }: ZonesTabProps) {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const addZone = () => {
    const newZone: Zone = {
      key: '',
      name_es: '',
      name_en: '',
      description_es: '',
      description_en: '',
      icon: 'MapPinIcon',
    };
    const newZones = [...zones, newZone];
    setZones(newZones);
    setEditingIndex(newZones.length - 1);
  };

  const removeZone = (index: number) => {
    if (zones.length <= 1) {
      toast.error('Debe haber al menos una zona');
      return;
    }
    const newZones = zones.filter((_, i) => i !== index);
    setZones(newZones);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const updateZone = (index: number, field: keyof Zone, value: string) => {
    const newZones = [...zones];
    newZones[index] = { ...newZones[index], [field]: value };

    // Auto-generate key from name_es if key is empty
    if (field === 'name_es' && !newZones[index].key) {
      newZones[index].key = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    setZones(newZones);
  };

  const moveZone = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= zones.length) return;

    const newZones = [...zones];
    [newZones[index], newZones[newIndex]] = [newZones[newIndex], newZones[index]];
    setZones(newZones);

    // Update editing index if needed
    if (editingIndex === index) {
      setEditingIndex(newIndex);
    } else if (editingIndex === newIndex) {
      setEditingIndex(index);
    }
  };

  const handleSave = async () => {
    // Validate zones
    for (const zone of zones) {
      if (!zone.key || !zone.name_es || !zone.name_en) {
        toast.error('Todas las zonas deben tener key, nombre en español e inglés');
        return;
      }
    }

    // Check for duplicate keys
    const keys = zones.map(z => z.key);
    if (new Set(keys).size !== keys.length) {
      toast.error('Existen claves (keys) duplicadas');
      return;
    }

    setSaving(true);
    try {
      await onUpdate(zones);
      setEditingIndex(null);
      toast.success('Zonas guardadas exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar zonas');
    } finally {
      setSaving(false);
    }
  };

  const getIconComponent = (iconName?: string) => {
    const icon = ICON_OPTIONS.find(opt => opt.value === iconName);
    return icon?.icon || MapPinIcon;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Zonas / Categorías</h3>
          <p className="text-xs text-navy-500 mt-1">
            Gestiona las zonas para filtrar destinos en el sitio web
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addZone}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar zona
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors"
          >
            <CheckIcon className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* Zones List */}
      <div className="space-y-3">
        {zones.map((zone, index) => {
          const IconComponent = getIconComponent(zone.icon);
          const isEditing = editingIndex === index;

          return (
            <div
              key={index}
              className={`bg-navy-800/50 rounded-lg border transition-all ${
                isEditing ? 'border-brand-500 ring-1 ring-brand-500/50' : 'border-navy-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveZone(index, 'up')}
                      disabled={index === 0}
                      className={`p-0.5 rounded transition-colors ${
                        index === 0
                          ? 'text-navy-700 cursor-not-allowed'
                          : 'text-navy-400 hover:text-white hover:bg-navy-700'
                      }`}
                    >
                      <ChevronUpIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveZone(index, 'down')}
                      disabled={index === zones.length - 1}
                      className={`p-0.5 rounded transition-colors ${
                        index === zones.length - 1
                          ? 'text-navy-700 cursor-not-allowed'
                          : 'text-navy-400 hover:text-white hover:bg-navy-700'
                      }`}
                    >
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/20">
                    <IconComponent className="w-5 h-5 text-brand-400" />
                  </div>

                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {zone.name_es || 'Nueva zona'}
                      {zone.name_en && zone.name_en !== zone.name_es && (
                        <span className="text-navy-400 ml-2">/ {zone.name_en}</span>
                      )}
                    </p>
                    <p className="text-xs text-navy-500">
                      Key: <code className="text-brand-400">{zone.key || 'sin-clave'}</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingIndex(isEditing ? null : index)}
                    className="px-3 py-1.5 text-xs bg-navy-700 hover:bg-navy-600 text-white rounded transition-colors"
                  >
                    {isEditing ? 'Cerrar' : 'Editar'}
                  </button>
                  {zones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeZone(index)}
                      className="p-1.5 text-navy-400 hover:text-red-400 hover:bg-navy-700 rounded transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Edit Form */}
              {isEditing && (
                <div className="border-t border-navy-700 p-4 space-y-4">
                  {/* Key & Icon */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-navy-400 mb-1">
                        Clave (key) *
                      </label>
                      <input
                        type="text"
                        value={zone.key}
                        onChange={(e) => updateZone(index, 'key', e.target.value)}
                        placeholder="hotel-zone"
                        className="w-full px-3 py-2 text-sm bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                      />
                      <p className="text-[10px] text-navy-500 mt-1">
                        Único, minúsculas, sin espacios
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-400 mb-1">
                        Icono
                      </label>
                      <select
                        value={zone.icon || 'MapPinIcon'}
                        onChange={(e) => updateZone(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-navy-900 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-navy-400 mb-1">
                        <span className="mr-1">🇪🇸</span> Nombre (ES) *
                      </label>
                      <input
                        type="text"
                        value={zone.name_es}
                        onChange={(e) => updateZone(index, 'name_es', e.target.value)}
                        placeholder="Zona Hotelera"
                        className="w-full px-3 py-2 text-sm bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-400 mb-1">
                        <span className="mr-1">🇺🇸</span> Nombre (EN) *
                      </label>
                      <input
                        type="text"
                        value={zone.name_en}
                        onChange={(e) => updateZone(index, 'name_en', e.target.value)}
                        placeholder="Hotel Zone"
                        className="w-full px-3 py-2 text-sm bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-navy-400 mb-1">
                        <span className="mr-1">🇪🇸</span> Descripción (ES)
                      </label>
                      <textarea
                        value={zone.description_es || ''}
                        onChange={(e) => updateZone(index, 'description_es', e.target.value)}
                        rows={2}
                        placeholder="Descripción opcional..."
                        className="w-full px-3 py-2 text-sm bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-400 mb-1">
                        <span className="mr-1">🇺🇸</span> Descripción (EN)
                      </label>
                      <textarea
                        value={zone.description_en || ''}
                        onChange={(e) => updateZone(index, 'description_en', e.target.value)}
                        rows={2}
                        placeholder="Optional description..."
                        className="w-full px-3 py-2 text-sm bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {zones.length === 0 && (
        <div className="bg-navy-800/50 rounded-lg p-8 border border-navy-700 text-center">
          <MapPinIcon className="w-12 h-12 text-navy-600 mx-auto mb-3" />
          <p className="text-navy-400 mb-4">No hay zonas configuradas</p>
          <button
            type="button"
            onClick={addZone}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar primera zona
          </button>
        </div>
      )}
    </div>
  );
}
