'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import AdminLayout from '@/components/admin/AdminLayout';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  TruckIcon,
  UserGroupIcon,
  CameraIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import ImageSelector from '@/components/admin/ImageSelector';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  luggage_capacity: number;
  base_price_usd?: number;
  description_es: string;
  description_en: string;
  features: string[];
  images: string[];
  display_order: number;
  is_active: boolean;
}

interface VehiclesContentProps {
  user: User;
  vehicles: Vehicle[];
}

const emptyVehicle: Omit<Vehicle, 'id'> = {
  name: '',
  type: '',
  capacity: 1,
  luggage_capacity: 1,
  base_price_usd: 0,
  description_es: '',
  description_en: '',
  features: [],
  images: [],
  display_order: 0,
  is_active: true,
};

const VEHICLE_TYPES = [
  { value: 'sedan', label: 'Sedán' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'sprinter', label: 'Sprinter' },
  { value: 'luxury', label: 'Lujo' },
];

export default function VehiclesContent({
  user,
  vehicles: initialVehicles,
}: VehiclesContentProps) {
  const router = useRouter();
  const supabase = createClient();

  const [vehicles, setVehicles] = useState(initialVehicles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>(emptyVehicle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      luggage_capacity: vehicle.luggage_capacity,
      base_price_usd: vehicle.base_price_usd || 0,
      description_es: vehicle.description_es,
      description_en: vehicle.description_en,
      features: vehicle.features || [],
      images: vehicle.images || [],
      display_order: vehicle.display_order,
      is_active: vehicle.is_active,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      ...emptyVehicle,
      display_order: vehicles.length,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(emptyVehicle);
    setError('');
    setNewFeature('');
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, newFeature.trim()],
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.type) {
      setError('El nombre y tipo son requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isCreating) {
        const { data, error: insertError } = await supabase
          .from('vehicles')
          .insert([formData])
          .select()
          .single();

        if (insertError) throw insertError;
        setVehicles([...vehicles, data]);
        toast.success('Vehículo creado exitosamente');
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from('vehicles')
          .update(formData)
          .eq('id', editingId);

        if (updateError) throw updateError;
        setVehicles(vehicles.map(v =>
          v.id === editingId ? { ...v, ...formData } : v
        ));
        toast.success('Vehículo actualizado');
      }

      handleCancel();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
      toast.error(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast('¿Eliminar este vehículo?', {
      description: 'Esta acción no se puede deshacer',
      action: {
        label: 'Eliminar',
        onClick: async () => {
          setLoading(true);
          try {
            const { error: deleteError } = await supabase
              .from('vehicles')
              .delete()
              .eq('id', id);

            if (deleteError) throw deleteError;
            setVehicles(vehicles.filter(v => v.id !== id));
            toast.success('Vehículo eliminado');
            router.refresh();
          } catch (err: any) {
            toast.error(err.message || 'Error al eliminar');
          } finally {
            setLoading(false);
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {},
      },
    });
  };

  const handleToggleActive = async (vehicle: Vehicle) => {
    try {
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ is_active: !vehicle.is_active })
        .eq('id', vehicle.id);

      if (updateError) throw updateError;
      setVehicles(vehicles.map(v =>
        v.id === vehicle.id ? { ...v, is_active: !v.is_active } : v
      ));
      toast.success(vehicle.is_active ? 'Vehículo desactivado' : 'Vehículo activado');
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...vehicles].sort((a, b) => a.display_order - b.display_order);
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= sorted.length) return;

    const currentItem = sorted[index];
    const swapItem = sorted[newIndex];

    try {
      await supabase
        .from('vehicles')
        .update({ display_order: swapItem.display_order })
        .eq('id', currentItem.id);

      await supabase
        .from('vehicles')
        .update({ display_order: currentItem.display_order })
        .eq('id', swapItem.id);

      const updated = vehicles.map(v => {
        if (v.id === currentItem.id) return { ...v, display_order: swapItem.display_order };
        if (v.id === swapItem.id) return { ...v, display_order: currentItem.display_order };
        return v;
      });
      setVehicles(updated);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error al reordenar');
    }
  };

  const sortedVehicles = [...vehicles].sort((a, b) => a.display_order - b.display_order);

  return (
    <AdminLayout userEmail={user.email || ''}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Vehículos</h1>
        <p className="text-navy-400 mt-1">
          Gestiona la flota de vehículos disponibles
        </p>
      </div>

      {error && !editingId && !isCreating && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isCreating || editingId) && (
        <div className="mb-6 bg-navy-900 rounded-xl border border-navy-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Nuevo vehículo' : 'Editar vehículo'}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-1">
                Nombre del vehículo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej: Chevrolet Suburban"
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Seleccionar tipo</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-1">
                Capacidad de pasajeros
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-1">
                Capacidad de equipaje
              </label>
              <input
                type="number"
                min="1"
                value={formData.luggage_capacity}
                onChange={(e) => setFormData({ ...formData, luggage_capacity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-1">
                Precio base (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.base_price_usd || 0}
                onChange={(e) => setFormData({ ...formData, base_price_usd: parseFloat(e.target.value) || 0 })}
                placeholder="75.00"
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-xs text-navy-500 mt-1">Precio de referencia "Desde $X USD"</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy-300 mb-1">
                <span className="mr-1">🇪🇸</span> Descripción (Español)
              </label>
              <textarea
                value={formData.description_es}
                onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                placeholder="Descripción del vehículo en español"
                rows={3}
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy-300 mb-1">
                <span className="mr-1">🇺🇸</span> Descripción (Inglés)
              </label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder="Vehicle description in English"
                rows={3}
                className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy-300 mb-1">
                Características
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder="Agregar característica"
                  className="flex-1 px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-navy-800 text-navy-300 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-1 text-navy-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sección de Imágenes */}
          <div className="mt-6 pt-6 border-t border-navy-700">
            <div className="flex items-center gap-2 mb-4">
              <CameraIcon className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-medium text-white">Imágenes del Vehículo</h3>
            </div>

            <div className="space-y-4">
              {/* Grid de imágenes actuales */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-navy-700">
                      <Image
                        src={imageUrl}
                        alt={`${formData.name} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={imageUrl.startsWith('http')}
                      />
                      {/* Badge de orden */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                        #{index + 1}
                      </div>
                      {/* Botón de eliminar */}
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar imagen"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                      {/* Botones de reordenar */}
                      {formData.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...formData.images];
                                [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
                                setFormData({ ...formData, images: newImages });
                              }}
                              className="p-1.5 bg-brand-500/80 hover:bg-brand-500 text-white rounded transition-colors"
                              title="Mover a la izquierda"
                            >
                              ←
                            </button>
                          )}
                          {index < formData.images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...formData.images];
                                [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
                                setFormData({ ...formData, images: newImages });
                              }}
                              className="p-1.5 bg-brand-500/80 hover:bg-brand-500 text-white rounded transition-colors"
                              title="Mover a la derecha"
                            >
                              →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Selector para agregar nueva imagen */}
              <div className="bg-navy-800/50 rounded-lg p-4 border border-navy-700">
                <ImageSelector
                  value=""
                  onChange={(url) => {
                    if (url && !formData.images.includes(url)) {
                      setFormData({ ...formData, images: [...formData.images, url] });
                    }
                  }}
                  category="vehicles"
                  label="Agregar imagen"
                  description="Selecciona o sube una nueva imagen para este vehículo"
                  placeholder="URL de la imagen"
                />
              </div>

              <p className="text-xs text-navy-500">
                💡 La primera imagen será la principal. Arrastra o usa las flechas para reordenar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-navy-700">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-navy-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
            <span className="text-sm text-navy-300">Activo</span>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white rounded-lg transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {/* Vehicles List */}
      <div className="bg-navy-900 rounded-xl border border-navy-800 overflow-hidden">
        <div className="p-4 border-b border-navy-800 flex items-center justify-between">
          <h3 className="font-medium text-white flex items-center gap-2">
            <TruckIcon className="w-5 h-5" />
            Flota de Vehículos
          </h3>
          <button
            onClick={handleCreate}
            disabled={isCreating || editingId !== null}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-500 hover:bg-brand-600 disabled:bg-navy-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar
          </button>
        </div>

        <div className="divide-y divide-navy-800">
          {sortedVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className={`p-4 hover:bg-navy-800/50 ${editingId === vehicle.id ? 'bg-navy-800/50 ring-1 ring-brand-500' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Order controls */}
                <div className="flex flex-col items-center gap-0.5 pt-2">
                  <button
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded transition-colors ${
                      index === 0 ? 'text-navy-700 cursor-not-allowed' : 'text-navy-400 hover:text-white hover:bg-navy-700'
                    }`}
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-navy-500 font-mono">{index + 1}</span>
                  <button
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === sortedVehicles.length - 1}
                    className={`p-1 rounded transition-colors ${
                      index === sortedVehicles.length - 1 ? 'text-navy-700 cursor-not-allowed' : 'text-navy-400 hover:text-white hover:bg-navy-700'
                    }`}
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Vehicle info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium text-lg">{vehicle.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-navy-400 capitalize">{vehicle.type}</span>
                        <span className="text-navy-600">•</span>
                        <span className="text-sm text-navy-400 flex items-center gap-1">
                          <UserGroupIcon className="w-4 h-4" />
                          {vehicle.capacity} pasajeros
                        </span>
                        <span className="text-navy-600">•</span>
                        <span className="text-sm text-navy-400">
                          {vehicle.luggage_capacity} maletas
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(vehicle)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        vehicle.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-navy-700 text-navy-400'
                      }`}
                    >
                      {vehicle.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>

                  {vehicle.description_es && (
                    <p className="text-sm text-navy-400 mb-2 line-clamp-2">
                      {vehicle.description_es}
                    </p>
                  )}

                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vehicle.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-navy-800 text-navy-400 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-navy-400 hover:text-red-400 hover:bg-navy-800 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sortedVehicles.length === 0 && (
            <div className="px-4 py-8 text-center text-navy-500">
              No hay vehículos registrados
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-navy-900/50 rounded-xl border border-navy-800">
        <p className="text-sm text-navy-400">
          <strong className="text-navy-300">Nota:</strong> Los vehículos definidos aquí pueden ser
          utilizados en el sistema de precios de destinos. Solo los vehículos activos estarán disponibles
          para mostrar a los usuarios.
        </p>
      </div>
    </AdminLayout>
  );
}
