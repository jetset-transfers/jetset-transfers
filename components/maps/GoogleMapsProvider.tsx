'use client';

import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { createContext, useContext, ReactNode } from 'react';

const libraries: Libraries = ['places', 'drawing', 'geometry'];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export default function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
    // Restrict to Mexico region for better autocomplete results
    region: 'MX',
    language: 'es',
  });

  // Log error for debugging
  if (loadError) {
    console.error('Google Maps load error:', loadError);
  }

  // Create a more descriptive error if API key is missing
  const error = !apiKey
    ? new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está configurada')
    : loadError;

  return (
    <GoogleMapsContext.Provider value={{ isLoaded: isLoaded && !!apiKey, loadError: error }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}
