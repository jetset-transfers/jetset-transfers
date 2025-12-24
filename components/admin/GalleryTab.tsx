'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  PhotoIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface SiteImage {
  id: string;
  key: string;
  url: string;
  alt_es: string | null;
  alt_en: string | null;
  category: string | null;
}

interface GalleryTabProps {
  galleryImages: string[];
  onUpdate: (images: string[]) => void;
  category?: string;
}

const categoryLabels: Record<string, string> = {
  hero: 'Hero / Principal',
  destinations: 'Destinos',
  tours: 'Tours Aéreos',
  gallery: 'Galería',
  about: 'Nosotros',
  fleet: 'Flota',
  other: 'Otros',
};

export default function GalleryTab({
  galleryImages,
  onUpdate,
  category = 'gallery',
}: GalleryTabProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load images when modal opens
  useEffect(() => {
    if (isModalOpen) {
      loadImages();
    }
  }, [isModalOpen]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar imágenes');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const uploadCategory = category || 'gallery';
      const filePath = `${uploadCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Save to site_images so it appears in gallery
      const { data: newImage, error: insertError } = await supabase
        .from('site_images')
        .insert([{
          key: fileName.replace(`.${fileExt}`, ''),
          url: publicUrl,
          category: uploadCategory,
          alt_es: '',
          alt_en: '',
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Add to local list and to gallery
      setImages([...images, newImage]);
      onUpdate([...galleryImages, publicUrl]);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectImage = (url: string) => {
    if (!galleryImages.includes(url)) {
      onUpdate([...galleryImages, url]);
    }
    setIsModalOpen(false);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    onUpdate(newImages);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= galleryImages.length) return;

    const newImages = [...galleryImages];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onUpdate(newImages);
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = searchTerm === '' ||
      img.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.alt_es?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.alt_en?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;

    // Exclude images already in gallery
    const notInGallery = !galleryImages.includes(img.url);

    return matchesSearch && matchesCategory && notInGallery;
  });

  const categories = ['all', ...Object.keys(categoryLabels)];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Galería de imágenes</h3>
          <p className="text-xs text-navy-500 mt-1">
            Agrega imágenes para el carrusel de este destino ({galleryImages.length} imágenes)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Agregar imagen
        </button>
      </div>

      {/* Current gallery images */}
      {galleryImages.length > 0 ? (
        <div className="space-y-3">
          {galleryImages.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="flex items-center gap-3 bg-navy-800/50 rounded-lg p-3 border border-navy-700"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-navy-900">
                <Image
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized={url.startsWith('http')}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">Imagen {index + 1}</p>
                <p className="text-xs text-navy-500 truncate">{url}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveImage(index, 'up')}
                  disabled={index === 0}
                  className={`p-1.5 rounded transition-colors ${
                    index === 0
                      ? 'text-navy-700 cursor-not-allowed'
                      : 'text-navy-400 hover:text-white hover:bg-navy-700'
                  }`}
                  title="Mover arriba"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveImage(index, 'down')}
                  disabled={index === galleryImages.length - 1}
                  className={`p-1.5 rounded transition-colors ${
                    index === galleryImages.length - 1
                      ? 'text-navy-700 cursor-not-allowed'
                      : 'text-navy-400 hover:text-white hover:bg-navy-700'
                  }`}
                  title="Mover abajo"
                >
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1.5 text-navy-400 hover:text-red-400 hover:bg-navy-700 rounded transition-colors"
                  title="Eliminar de galería"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-navy-800/30 border border-dashed border-navy-700 rounded-lg p-8 text-center">
          <PhotoIcon className="w-12 h-12 text-navy-600 mx-auto mb-3" />
          <p className="text-navy-400 text-sm mb-2">No hay imágenes en la galería</p>
          <p className="text-navy-500 text-xs">
            Agrega imágenes para mostrar un carrusel en la página del destino
          </p>
        </div>
      )}

      {/* Preview carousel */}
      {galleryImages.length > 0 && (
        <div className="border-t border-navy-800 pt-6">
          <h4 className="text-sm font-semibold text-white mb-3">Vista previa del carrusel</h4>
          <div className="bg-navy-950 rounded-lg p-4 overflow-hidden">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((url, index) => (
                <div
                  key={`preview-${index}`}
                  className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border border-navy-700"
                >
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                    unoptimized={url.startsWith('http')}
                  />
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for selecting/uploading images */}
      {isModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/70 z-[60]"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-4 md:inset-10 lg:inset-20 bg-navy-900 rounded-xl border border-navy-800 z-[60] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800">
              <h3 className="text-lg font-semibold text-white">Agregar imagen a la galería</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-navy-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-navy-800 space-y-3">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar imagen..."
                  className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-brand-500 text-white'
                        : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                    }`}
                  >
                    {cat === 'all' ? 'Todas' : categoryLabels[cat] || cat}
                    {cat !== 'all' && (
                      <span className="ml-1 opacity-70">
                        ({images.filter(i => i.category === cat && !galleryImages.includes(i.url)).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of images */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-navy-400">Cargando imágenes...</div>
                </div>
              ) : filteredImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => handleSelectImage(image.url)}
                      className="group relative aspect-video rounded-lg overflow-hidden border-2 border-navy-700 hover:border-brand-500/50 transition-all"
                    >
                      <img
                        src={image.url}
                        alt={image.alt_es || image.key}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <PlusIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-xs text-white truncate">{image.key}</p>
                        <p className="text-xs text-navy-400 truncate">
                          {categoryLabels[image.category || 'other']}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-navy-500">
                  <PhotoIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No se encontraron imágenes disponibles</p>
                  <p className="text-xs mt-1">Sube una nueva imagen o cambia los filtros</p>
                </div>
              )}
            </div>

            {/* Footer with upload option */}
            <div className="px-6 py-4 border-t border-navy-800 bg-navy-800/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-navy-400">
                  ¿No encuentras la imagen que buscas?
                </p>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors"
                  >
                    <CloudArrowUpIcon className="w-5 h-5" />
                    {uploading ? 'Subiendo...' : 'Subir nueva imagen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
