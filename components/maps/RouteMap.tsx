'use client';

import { useMemo, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsProvider';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface RouteMapProps {
  originLat?: number;
  originLng?: number;
  originName?: string;
  destLat?: number;
  destLng?: number;
  destName?: string;
  className?: string;
}

// Map styling for dark mode - subtle, clean design
const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#1a365d' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1a365d' }, { lightness: -80 }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94a3b8' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#134e4a' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#475569' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0c4a6e' }],
  },
];

export default function RouteMap({
  originLat,
  originLng,
  originName,
  destLat,
  destLng,
  destName,
  className = '',
}: RouteMapProps) {
  const { isLoaded } = useGoogleMaps();

  // Calculate center and bounds
  const { center, zoom } = useMemo(() => {
    const hasOrigin = originLat !== undefined && originLng !== undefined;
    const hasDest = destLat !== undefined && destLng !== undefined;

    if (hasOrigin && hasDest) {
      // Center between both points
      const centerLat = (originLat + destLat) / 2;
      const centerLng = (originLng + destLng) / 2;

      // Calculate zoom based on distance
      const latDiff = Math.abs(originLat - destLat);
      const lngDiff = Math.abs(originLng - destLng);
      const maxDiff = Math.max(latDiff, lngDiff);

      let calculatedZoom = 12;
      if (maxDiff > 1) calculatedZoom = 8;
      else if (maxDiff > 0.5) calculatedZoom = 9;
      else if (maxDiff > 0.2) calculatedZoom = 10;
      else if (maxDiff > 0.1) calculatedZoom = 11;

      return { center: { lat: centerLat, lng: centerLng }, zoom: calculatedZoom };
    } else if (hasOrigin) {
      return { center: { lat: originLat, lng: originLng }, zoom: 13 };
    } else if (hasDest) {
      return { center: { lat: destLat, lng: destLng }, zoom: 13 };
    }

    // Default to Cancun area
    return { center: { lat: 21.1619, lng: -86.8515 }, zoom: 10 };
  }, [originLat, originLng, destLat, destLng]);

  const mapOptions: google.maps.MapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: mapStyles,
    gestureHandling: 'cooperative',
  }), []);

  const onLoad = useCallback((map: google.maps.Map) => {
    const hasOrigin = originLat !== undefined && originLng !== undefined;
    const hasDest = destLat !== undefined && destLng !== undefined;

    if (hasOrigin && hasDest) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: originLat, lng: originLng });
      bounds.extend({ lat: destLat, lng: destLng });
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }
  }, [originLat, originLng, destLat, destLng]);

  if (!isLoaded) {
    return (
      <div className={`bg-navy-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <MapPinIcon className="w-8 h-8 mx-auto mb-2 animate-pulse" />
          <p className="text-sm">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  const hasOrigin = originLat !== undefined && originLng !== undefined;
  const hasDest = destLat !== undefined && destLng !== undefined;

  // If no coordinates, show placeholder
  if (!hasOrigin && !hasDest) {
    return (
      <div className={`bg-navy-800 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <MapPinIcon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Selecciona origen y destino</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={onLoad}
      >
        {/* Origin marker - Green */}
        {hasOrigin && (
          <Marker
            position={{ lat: originLat, lng: originLng }}
            title={originName || 'Origen'}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#22c55e',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }}
          />
        )}

        {/* Destination marker - Red/Brand color */}
        {hasDest && (
          <Marker
            position={{ lat: destLat, lng: destLng }}
            title={destName || 'Destino'}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#e63946',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
