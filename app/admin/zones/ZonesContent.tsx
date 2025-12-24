'use client';

import { useState, useEffect } from 'react';
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
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MapPinIcon,
  GlobeAmericasIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import ImageSelector from '@/components/admin/ImageSelector';
import Image from 'next/image';

interface Zone {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  travel_time: string | null;
  distance_km: number | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  meta_title_es?: string | null;
  meta_title_en?: string | null;
  meta_description_es?: string | null;
  meta_description_en?: string | null;
}

interface ZonesContentProps {
  user: User;
  zones: Zone[];
}

const emptyZone: Omit<Zone, 'id'> = {
  slug: '',
  name_es: '',
  name_en: '',
  description_es: '',
  description_en: '',
  travel_time: '',
  distance_km: null,
  image_url: '',
  is_active: true,
  display_order: 0,
  meta_title_es: '',
  meta_title_en: '',
  meta_description_es: '',
  meta_description_en: '',
};

type TabKey = 'basic' | 'seo';

export default function ZonesContent({ user, zones: initialZones }: ZonesContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const [zones, setZones] = useState(initialZones);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<Zone, 'id'>>(emptyZone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('basic');

  // Close drawer with Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        handleCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [drawerOpen]);

  const handleEdit = (zone: Zone) => {
    setEditingId(zone.id);
    setFormData({
      slug: zone.slug,
      name_es: zone.name_es,
      name_en: zone.name_en,
      description_es: zone.description_es || '',
      description_en: zone.description_en || '',
      travel_time: zone.travel_time || '',
      distance_km: zone.distance_km,
      image_url: zone.image_url || '',
      is_active: zone.is_active,
      display_order: zone.display_order,
      meta_title_es: zone.meta_title_es || '',
      meta_title_en: zone.meta_title_en || '',
      meta_description_es: zone.meta_description_es || '',
      meta_description_en: zone.meta_description_en || '',
    });
    setIsCreating(false);
    setActiveTab('basic');
    setDrawerOpen(true);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      ...emptyZone,
      display_order: zones.length,
    });
    setActiveTab('basic');
    setDrawerOpen(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(emptyZone);
    setError('');
    setDrawerOpen(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      if (isCreating) {
        const { data, error: insertError } = await supabase
          .from('zones')
          .insert([formData])
          .select()
          .single();

        if (insertError) throw insertError;
        setZones([...zones, data]);
        toast.success('Zona creada exitosamente');
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from('zones')
          .update(formData)
          .eq('id', editingId);

        if (updateError) throw updateError;
        setZones(zones.map(z =>
          z.id === editingId ? { ...z, ...formData } : z
        ));
        toast.success('Zona actualizada');
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
    toast('¿Eliminar esta zona?', {
      description: 'Esta acción no se puede deshacer',
      action: {
        label: 'Eliminar',
        onClick: async () => {
          setLoading(true);
          try {
            const { error: deleteError } = await supabase
              .from('zones')
              .delete()
              .eq('id', id);

            if (deleteError) throw deleteError;
            setZones(zones.filter(z => z.id !== id));
            toast.success('Zona eliminada');
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

  const handleToggleActive = async (zone: Zone) => {
    try {
      const { error: updateError } = await supabase
        .from('zones')
        .update({ is_active: !zone.is_active })
        .eq('id', zone.id);

      if (updateError) throw updateError;
      setZones(zones.map(z =>
        z.id === zone.id ? { ...z, is_active: !z.is_active } : z
      ));
      toast.success(zone.is_active ? 'Zona desactivada' : 'Zona activada');
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const sortedZones = [...zones].sort((a, b) => a.display_order - b.display_order);
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= sortedZones.length) return;

    const currentItem = sortedZones[index];
    const swapItem = sortedZones[newIndex];

    try {
      const { error: error1 } = await supabase
        .from('zones')
        .update({ display_order: swapItem.display_order })
        .eq('id', currentItem.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('zones')
        .update({ display_order: currentItem.display_order })
        .eq('id', swapItem.id);

      if (error2) throw error2;

      const updatedZones = zones.map(z => {
        if (z.id === currentItem.id) return { ...z, display_order: swapItem.display_order };
        if (z.id === swapItem.id) return { ...z, display_order: currentItem.display_order };
        return z;
      });
      setZones(updatedZones);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error al reordenar');
    }
  };

  const sortedZones = [...zones].sort((a, b) => a.display_order - b.display_order);

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'basic', label: 'Básico', icon: GlobeAmericasIcon },
    { key: 'seo', label: 'SEO', icon: MagnifyingGlassIcon },
  ];

  return (
    <AdminLayout userEmail={user.email || ''}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Zonas de Servicio</h1>
          <p className="text-navy-400 mt-1">Gestiona las zonas de cobertura de traslados</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={isCreating || editingId !== null}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-navy-700 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Zona
        </button>
      </div>

      {error && !drawerOpen && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Zones List */}
      <div className="bg-navy-900 rounded-xl border border-navy-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-navy-800">
            <tr>
              <th className="px-2 py-3 text-center text-xs font-medium text-navy-400 uppercase w-16">Orden</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-navy-400 uppercase">Zona</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-navy-400 uppercase hidden md:table-cell">Tiempo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-navy-400 uppercase hidden md:table-cell">Distancia</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-navy-400 uppercase">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-navy-400 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800">
            {sortedZones.map((zone, index) => (
              <tr key={zone.id} className={`hover:bg-navy-800/30 ${editingId === zone.id ? 'bg-navy-800/50 ring-1 ring-brand-500' : ''}`}>
                <td className="px-2 py-4">
                  <div className="flex flex-col items-center gap-0.5">
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
                      disabled={index === sortedZones.length - 1}
                      className={`p-1 rounded transition-colors ${
                        index === sortedZones.length - 1 ? 'text-navy-700 cursor-not-allowed' : 'text-navy-400 hover:text-white hover:bg-navy-700'
                      }`}
                    >
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-navy-800">
                      {zone.image_url ? (
                        <Image
                          src={zone.image_url}
                          alt={zone.name_es}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized={zone.image_url.startsWith('http')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPinIcon className="w-6 h-6 text-navy-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{zone.name_es}</p>
                      <p className="text-navy-500 text-sm">{zone.name_en}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-navy-300 hidden md:table-cell">
                  {zone.travel_time || '-'}
                </td>
                <td className="px-4 py-4 text-navy-300 hidden md:table-cell">
                  {zone.distance_km ? `${zone.distance_km} km` : '-'}
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleToggleActive(zone)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      zone.is_active ? 'bg-green-500/20 text-green-400' : 'bg-navy-700 text-navy-400'
                    }`}
                  >
                    {zone.is_active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(zone.id)}
                      className="p-2 text-navy-400 hover:text-red-400 hover:bg-navy-800 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedZones.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-navy-500">
                  No hay zonas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer lateral con tabs */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCancel} />
          <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-navy-900 border-l border-navy-800 z-50 flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800 bg-navy-900 sticky top-0 z-10">
              <h2 className="text-lg font-semibold text-white">
                {isCreating ? 'Nueva Zona' : 'Editar Zona'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-navy-800 bg-navy-950/50 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-navy-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Form content */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Tab: Basic Info */}
              {activeTab === 'basic' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1">Slug (URL)</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        placeholder="zona-hotelera"
                        className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1">Orden</label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1">
                        <span className="mr-1">🇪🇸</span> Nombre (ES)
                      </label>
                      <input
                        type="text"
                        value={formData.name_es}
                        onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
                        placeholder="Zona Hotelera"
                        className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1">
                        <span className="mr-1">🇺🇸</span> Nombre (EN)
                      </label>
                      <input
                        type="text"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        placeholder="Hotel Zone"
                        className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1">Tiempo de traslado</label>
                      <input
                        type="text"
                        value={formData.travel_time || ''}
                        onChange={(e) => setFormData({ ...formData, travel_time: e.target.value })}
                        placeholder="20-30 min"
                        className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1">Distancia (km)</label>
                      <input
                        type="number"
                        value={formData.distance_km || ''}
                        onChange={(e) => setFormData({ ...formData, distance_km: parseFloat(e.target.value) || null })}
                        placeholder="25"
                        className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-1">
                      <span className="mr-1">🇪🇸</span> Descripción (ES)
                    </label>
                    <textarea
                      value={formData.description_es || ''}
                      onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                      rows={3}
                      placeholder="Descripción de la zona..."
                      className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-1">
                      <span className="mr-1">🇺🇸</span> Descripción (EN)
                    </label>
                    <textarea
                      value={formData.description_en || ''}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      rows={3}
                      placeholder="Zone description..."
                      className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <ImageSelector
                    value={formData.image_url || ''}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    category="zones"
                    label="Imagen de la zona"
                    description="Imagen representativa de la zona"
                  />

                  <div className="flex items-center gap-3 pt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-navy-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                    <span className="text-sm text-navy-300">Zona activa</span>
                  </div>
                </div>
              )}

              {/* Tab: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-5">
                  <div className="bg-navy-800/50 rounded-lg p-4 border border-navy-700">
                    <h3 className="text-sm font-semibold text-white mb-2">Vista previa en Google</h3>
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <p className="text-blue-600 font-medium truncate">
                        {formData.meta_title_es || `Traslados a ${formData.name_es}` || 'Título de la página'}
                      </p>
                      <p className="text-green-700 text-xs truncate">jetsettransfers.com/es/destinations?zone={formData.slug || 'zona'}</p>
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {formData.meta_description_es || formData.description_es || 'Descripción de la página...'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1">🇪🇸 Meta título</label>
                      <input
                        type="text"
                        value={formData.meta_title_es || ''}
                        onChange={(e) => setFormData({ ...formData, meta_title_es: e.target.value })}
                        placeholder={`Traslados a ${formData.name_es || 'Nombre'}`}
                        className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <p className="text-xs text-navy-500 mt-1">{(formData.meta_title_es || '').length}/60</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1">🇺🇸 Meta título</label>
                      <input
                        type="text"
                        value={formData.meta_title_en || ''}
                        onChange={(e) => setFormData({ ...formData, meta_title_en: e.target.value })}
                        placeholder={`Transfers to ${formData.name_en || 'Zone Name'}`}
                        className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <p className="text-xs text-navy-500 mt-1">{(formData.meta_title_en || '').length}/60</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-1">🇪🇸 Meta descripción</label>
                    <textarea
                      value={formData.meta_description_es || ''}
                      onChange={(e) => setFormData({ ...formData, meta_description_es: e.target.value })}
                      rows={2}
                      placeholder="Descripción para buscadores..."
                      className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <p className="text-xs text-navy-500 mt-1">{(formData.meta_description_es || '').length}/160</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-1">🇺🇸 Meta descripción</label>
                    <textarea
                      value={formData.meta_description_en || ''}
                      onChange={(e) => setFormData({ ...formData, meta_description_en: e.target.value })}
                      rows={2}
                      placeholder="Description for search engines..."
                      className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <p className="text-xs text-navy-500 mt-1">{(formData.meta_description_en || '').length}/160</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-navy-800 bg-navy-900 sticky bottom-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white rounded-lg transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
