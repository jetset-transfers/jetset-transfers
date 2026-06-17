'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsProvider';
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';

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

const DEFAULT_CENTER = { lat: 21.0365, lng: -86.8771 };
const DEFAULT_ZOOM = 10;
const MIN_POLYGON_POINTS = 3;
const DRAWING_PREVIEW_COLOR = '#3B82F6';

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
  const [drawingPoints, setDrawingPoints] = useState<ZoneCoordinate[]>([]);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const polygonRefs = useRef<Map<string, google.maps.Polygon>>(new Map());

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!drawingMode || !e.latLng) return;
      setDrawingPoints((prev) => [
        ...prev,
        { lat: e.latLng!.lat(), lng: e.latLng!.lng() },
      ]);
    },
    [drawingMode]
  );

  const startDrawing = useCallback(() => {
    setEditingZoneId(null);
    setDrawingPoints([]);
    setDrawingMode(true);
  }, []);

  const cancelDrawing = useCallback(() => {
    setDrawingMode(false);
    setDrawingPoints([]);
  }, []);

  const undoLastPoint = useCallback(() => {
    setDrawingPoints((prev) => prev.slice(0, -1));
  }, []);

  const finalizeDrawing = useCallback(() => {
    if (drawingPoints.length < MIN_POLYGON_POINTS) return;
    if (onZoneCreate) {
      onZoneCreate(drawingPoints);
    }
    setDrawingMode(false);
    setDrawingPoints([]);
  }, [drawingPoints, onZoneCreate]);

  const handlePolygonEdit = useCallback(
    (zoneId: string) => {
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
    },
    [onZoneUpdate]
  );

  const onPolygonLoad = useCallback(
    (polygon: google.maps.Polygon, zoneId: string) => {
      polygonRefs.current.set(zoneId, polygon);
    },
    []
  );

  const onPolygonUnmount = useCallback((zoneId: string) => {
    polygonRefs.current.delete(zoneId);
  }, []);

  useEffect(() => {
    if (map && zones.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      zones.forEach((zone) => {
        zone.coordinates.forEach((coord) => {
          bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
        });
      });
      map.fitBounds(bounds, 50);
    }
  }, [map, zones]);

  if (loadError) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gray-100 dark:bg-navy-800 rounded-lg p-4"
        style={{ height }}
      >
        <p className="text-red-500 font-medium mb-2">Error loading maps</p>
        <p className="text-red-400 text-sm text-center max-w-md">
          {loadError.message || 'Unknown error'}
        </p>
        <p className="text-gray-500 text-xs mt-2 text-center">
          Verifica que las APIs de Google Maps (Maps JavaScript API, Places API) estén habilitadas.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-navy-800 rounded-lg animate-pulse"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    draggableCursor: drawingMode ? 'crosshair' : undefined,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  const canFinalize = drawingPoints.length >= MIN_POLYGON_POINTS;

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-navy-700"
      style={{ height }}
    >
      {/* Toolbar */}
      {editable && (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          {!drawingMode ? (
            <button
              type="button"
              onClick={startDrawing}
              className="px-4 py-2 rounded-lg font-medium text-sm shadow-lg transition-colors flex items-center gap-2 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700"
            >
              <PencilIcon className="w-4 h-4" />
              Dibujar Zona
            </button>
          ) : (
            <>
              <div className="px-4 py-2 rounded-lg font-medium text-sm shadow-lg bg-brand-500 text-white flex items-center gap-2">
                <PencilIcon className="w-4 h-4" />
                Dibujando ({drawingPoints.length})
              </div>
              <button
                type="button"
                onClick={undoLastPoint}
                disabled={drawingPoints.length === 0}
                className="px-3 py-2 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title="Deshacer último punto"
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={finalizeDrawing}
                disabled={!canFinalize}
                className="px-3 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                title={
                  canFinalize
                    ? 'Finalizar zona'
                    : `Necesitas al menos ${MIN_POLYGON_POINTS} puntos`
                }
              >
                <CheckIcon className="w-4 h-4" />
                Finalizar
              </button>
              <button
                type="button"
                onClick={cancelDrawing}
                className="px-3 py-2 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-navy-700 flex items-center gap-2"
                title="Cancelar"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Selected zone actions */}
      {selectedZoneId && editable && !drawingMode && (
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white dark:bg-navy-800 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300 text-center max-w-md">
          {drawingPoints.length === 0
            ? 'Haz clic en el mapa para agregar el primer punto de la zona.'
            : drawingPoints.length < MIN_POLYGON_POINTS
            ? `Agrega ${MIN_POLYGON_POINTS - drawingPoints.length} punto(s) más y presiona Finalizar.`
            : 'Sigue agregando puntos o presiona Finalizar para guardar la zona.'}
        </div>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        options={mapOptions}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {/* Drawing preview */}
        {drawingMode && drawingPoints.length > 0 && (
          <Polygon
            paths={drawingPoints}
            options={{
              fillColor: DRAWING_PREVIEW_COLOR,
              fillOpacity: canFinalize ? 0.25 : 0.1,
              strokeColor: DRAWING_PREVIEW_COLOR,
              strokeWeight: 2,
              clickable: false,
              editable: false,
              draggable: false,
              zIndex: 999,
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
                clickable: !drawingMode,
              }}
              onClick={() => {
                if (drawingMode) return;
                onZoneSelect?.(isSelected ? null : zone);
              }}
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
      {zones.length > 0 && !drawingMode && (
        <div className="absolute bottom-4 right-4 z-10 bg-white dark:bg-navy-800 rounded-lg shadow-lg p-3 max-h-48 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
            Zonas
          </p>
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
