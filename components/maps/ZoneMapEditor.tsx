'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Polygon, DrawingManager } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsProvider';
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ZoneCoordinate {
  lat: number;
  lng: number;
}

interface Zone {
  id: string;
  name: string;
  coordinates: ZoneCoordinate[];
  color: string;
}

interface ZoneMapEditorProps {
  zones: Zone[];
  onZoneCreate?: (coordinates: ZoneCoordinate[]) => void;
  onZoneUpdate?: (zoneId: string, coordinates: ZoneCoordinate[]) => void;
  onZoneDelete?: (zoneId: string) => void;
  onZoneSelect?: (zone: Zone | null) => void;
  selectedZoneId?: string | null;
  editable?: boolean;
  height?: string;
}

// Default center: Cancun Airport
const DEFAULT_CENTER = { lat: 21.0365, lng: -86.8771 };
const DEFAULT_ZOOM = 10;

// Zone colors for visual distinction
const ZONE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function ZoneMapEditor({
  zones,
  onZoneCreate,
  onZoneUpdate,
  onZoneDelete,
  onZoneSelect,
  selectedZoneId,
  editable = true,
  height = '500px',
}: ZoneMapEditorProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const polygonRefs = useRef<Map<string, google.maps.Polygon>>(new Map());

  // Handle map load
  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  // Handle polygon complete (new zone drawn)
  const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    const coordinates: ZoneCoordinate[] = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({
        lat: point.lat(),
        lng: point.lng(),
      });
    }

    // Remove the drawn polygon (it will be replaced by our managed one)
    polygon.setMap(null);

    // Notify parent
    if (onZoneCreate && coordinates.length >= 3) {
      onZoneCreate(coordinates);
    }

    setDrawingMode(false);
  }, [onZoneCreate]);

  // Handle polygon edit
  const handlePolygonEdit = useCallback((zoneId: string) => {
    const polygon = polygonRefs.current.get(zoneId);
    if (!polygon) return;

    const path = polygon.getPath();
    const coordinates: ZoneCoordinate[] = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({
        lat: point.lat(),
        lng: point.lng(),
      });
    }

    if (onZoneUpdate) {
      onZoneUpdate(zoneId, coordinates);
    }
  }, [onZoneUpdate]);

  // Save polygon ref
  const onPolygonLoad = useCallback((polygon: google.maps.Polygon, zoneId: string) => {
    polygonRefs.current.set(zoneId, polygon);
  }, []);

  // Cleanup polygon ref
  const onPolygonUnmount = useCallback((zoneId: string) => {
    polygonRefs.current.delete(zoneId);
  }, []);

  // Fit map to zones
  useEffect(() => {
    if (map && zones.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      zones.forEach(zone => {
        zone.coordinates.forEach(coord => {
          bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
        });
      });
      map.fitBounds(bounds, 50);
    }
  }, [map, zones]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-navy-800 rounded-lg p-4" style={{ height }}>
        <p className="text-red-500 font-medium mb-2">Error loading maps</p>
        <p className="text-red-400 text-sm text-center max-w-md">
          {loadError.message || 'Unknown error'}
        </p>
        <p className="text-gray-500 text-xs mt-2 text-center">
          Verifica que las APIs de Google Maps (Maps JavaScript API, Places API, Drawing) estén habilitadas.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-navy-800 rounded-lg animate-pulse" style={{ height }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  // Map options - defined here to ensure google is loaded
  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-navy-700" style={{ height }}>
      {/* Toolbar */}
      {editable && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setDrawingMode(!drawingMode)}
            className={`px-4 py-2 rounded-lg font-medium text-sm shadow-lg transition-colors flex items-center gap-2 ${
              drawingMode
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700'
            }`}
          >
            <PencilIcon className="w-4 h-4" />
            {drawingMode ? 'Dibujando...' : 'Dibujar Zona'}
          </button>

          {drawingMode && (
            <button
              type="button"
              onClick={() => setDrawingMode(false)}
              className="px-3 py-2 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-navy-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Selected zone actions */}
      {selectedZoneId && editable && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {editingZoneId === selectedZoneId ? (
            <button
              type="button"
              onClick={() => {
                handlePolygonEdit(selectedZoneId);
                setEditingZoneId(null);
              }}
              className="px-3 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 flex items-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              Guardar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditingZoneId(selectedZoneId)}
              className="px-3 py-2 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-navy-700 flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </button>
          )}
          <button
            type="button"
            onClick={() => onZoneDelete?.(selectedZoneId)}
            className="px-3 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      )}

      {/* Instructions */}
      {drawingMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white dark:bg-navy-800 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300">
          Haz clic en el mapa para dibujar los puntos de la zona. Haz clic en el primer punto para cerrar.
        </div>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {/* Drawing Manager */}
        {drawingMode && (
          <DrawingManager
            drawingMode={google.maps.drawing.OverlayType.POLYGON}
            onPolygonComplete={onPolygonComplete}
            options={{
              drawingControl: false,
              polygonOptions: {
                fillColor: ZONE_COLORS[zones.length % ZONE_COLORS.length],
                fillOpacity: 0.3,
                strokeColor: ZONE_COLORS[zones.length % ZONE_COLORS.length],
                strokeWeight: 2,
                editable: true,
                draggable: false,
              },
            }}
          />
        )}

        {/* Existing zones */}
        {zones.map((zone, index) => {
          const isSelected = selectedZoneId === zone.id;
          const isEditing = editingZoneId === zone.id;
          const color = zone.color || ZONE_COLORS[index % ZONE_COLORS.length];

          return (
            <Polygon
              key={zone.id}
              paths={zone.coordinates}
              options={{
                fillColor: color,
                fillOpacity: isSelected ? 0.5 : 0.3,
                strokeColor: color,
                strokeWeight: isSelected ? 3 : 2,
                editable: isEditing,
                draggable: false,
                clickable: true,
              }}
              onClick={() => onZoneSelect?.(isSelected ? null : zone)}
              onLoad={(polygon) => onPolygonLoad(polygon, zone.id)}
              onUnmount={() => onPolygonUnmount(zone.id)}
              onMouseUp={() => {
                if (isEditing) {
                  handlePolygonEdit(zone.id);
                }
              }}
            />
          );
        })}
      </GoogleMap>

      {/* Zone legend */}
      {zones.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10 bg-white dark:bg-navy-800 rounded-lg shadow-lg p-3 max-h-48 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">Zonas</p>
          <div className="space-y-1">
            {zones.map((zone, index) => {
              const color = zone.color || ZONE_COLORS[index % ZONE_COLORS.length];
              const isSelected = selectedZoneId === zone.id;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => onZoneSelect?.(isSelected ? null : zone)}
                  className={`flex items-center gap-2 w-full px-2 py-1 rounded text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-gray-100 dark:bg-navy-700'
                      : 'hover:bg-gray-50 dark:hover:bg-navy-700/50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300 truncate">
                    {zone.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
