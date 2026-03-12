'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useGoogleMaps } from './GoogleMapsProvider';
import {
  MapPinIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  SparklesIcon,
  ShoppingBagIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  types?: string[];
}

interface PlacesAutocompleteProps {
  placeholder?: string;
  value?: PlaceResult | null;
  onChange: (place: PlaceResult | null) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  // Restrict search to specific bounds (Riviera Maya area)
  restrictToBounds?: boolean;
  // Locale for category labels
  locale?: 'es' | 'en';
}

// Yucatan Peninsula bounds (Yucatan, Campeche, Quintana Roo states)
const YUCATAN_PENINSULA_BOUNDS = {
  north: 21.65,  // Northern Yucatan (Rio Lagartos, Progreso, Celestun)
  south: 17.85,  // Southern QR/Campeche (Chetumal, Bacalar, Calakmul)
  east: -86.70,  // Caribbean coast
  west: -90.50,  // Western Campeche (includes Campeche city)
};

// Messages for no results
const NO_RESULTS_MESSAGES = {
  es: {
    noResults: 'No hay resultados en nuestra zona de servicio',
    serviceArea: 'Ofrecemos traslados en toda la Península de Yucatán',
  },
  en: {
    noResults: 'No results in our service area',
    serviceArea: 'We offer transfers throughout the Yucatan Peninsula',
  },
};

// Category mapping for place types with bilingual labels
const PLACE_CATEGORIES: Record<string, { label_es: string; label_en: string; color: string; icon: React.ElementType }> = {
  lodging: { label_es: 'Hotel', label_en: 'Hotel', color: 'bg-blue-500', icon: BuildingOffice2Icon },
  hotel: { label_es: 'Hotel', label_en: 'Hotel', color: 'bg-blue-500', icon: BuildingOffice2Icon },
  resort: { label_es: 'Resort', label_en: 'Resort', color: 'bg-blue-500', icon: BuildingOffice2Icon },
  restaurant: { label_es: 'Restaurante', label_en: 'Restaurant', color: 'bg-orange-500', icon: SparklesIcon },
  food: { label_es: 'Comida', label_en: 'Food', color: 'bg-orange-500', icon: SparklesIcon },
  cafe: { label_es: 'Café', label_en: 'Cafe', color: 'bg-amber-500', icon: SparklesIcon },
  bar: { label_es: 'Bar', label_en: 'Bar', color: 'bg-purple-500', icon: MusicalNoteIcon },
  night_club: { label_es: 'Club', label_en: 'Club', color: 'bg-purple-500', icon: MusicalNoteIcon },
  tourist_attraction: { label_es: 'Atracción', label_en: 'Attraction', color: 'bg-green-500', icon: SparklesIcon },
  museum: { label_es: 'Museo', label_en: 'Museum', color: 'bg-indigo-500', icon: BuildingOffice2Icon },
  park: { label_es: 'Parque', label_en: 'Park', color: 'bg-green-500', icon: SparklesIcon },
  amusement_park: { label_es: 'Parque', label_en: 'Park', color: 'bg-green-500', icon: SparklesIcon },
  zoo: { label_es: 'Zoológico', label_en: 'Zoo', color: 'bg-green-500', icon: SparklesIcon },
  aquarium: { label_es: 'Acuario', label_en: 'Aquarium', color: 'bg-cyan-500', icon: SparklesIcon },
  shopping_mall: { label_es: 'Centro Comercial', label_en: 'Mall', color: 'bg-pink-500', icon: ShoppingBagIcon },
  spa: { label_es: 'Spa', label_en: 'Spa', color: 'bg-teal-500', icon: SparklesIcon },
  airport: { label_es: 'Aeropuerto', label_en: 'Airport', color: 'bg-gray-500', icon: MapPinIcon },
  bus_station: { label_es: 'Terminal', label_en: 'Station', color: 'bg-gray-500', icon: MapPinIcon },
  point_of_interest: { label_es: 'Lugar', label_en: 'Place', color: 'bg-gray-400', icon: MapPinIcon },
  establishment: { label_es: 'Establecimiento', label_en: 'Business', color: 'bg-gray-400', icon: BuildingOffice2Icon },
  real_estate_agency: { label_es: 'Inmueble', label_en: 'Property', color: 'bg-slate-500', icon: HomeModernIcon },
};

// Get category info from place types
function getCategoryFromTypes(types: string[], locale: 'es' | 'en' = 'es'): { label: string; color: string; icon: React.ElementType } | null {
  // Priority order for categories
  const priorityTypes = [
    'lodging', 'hotel', 'resort',
    'restaurant', 'cafe', 'bar', 'night_club', 'food',
    'tourist_attraction', 'museum', 'park', 'amusement_park', 'zoo', 'aquarium',
    'shopping_mall', 'spa', 'airport', 'bus_station',
  ];

  for (const type of priorityTypes) {
    if (types.includes(type) && PLACE_CATEGORIES[type]) {
      const cat = PLACE_CATEGORIES[type];
      return {
        label: locale === 'en' ? cat.label_en : cat.label_es,
        color: cat.color,
        icon: cat.icon,
      };
    }
  }

  // Fallback to first matching type
  for (const type of types) {
    if (PLACE_CATEGORIES[type]) {
      const cat = PLACE_CATEGORIES[type];
      return {
        label: locale === 'en' ? cat.label_en : cat.label_es,
        color: cat.color,
        icon: cat.icon,
      };
    }
  }

  return null;
}

export default function PlacesAutocomplete({
  placeholder = 'Buscar ubicación...',
  value,
  onChange,
  className = '',
  disabled = false,
  error = false,
  restrictToBounds = true,
  locale = 'es',
}: PlacesAutocompleteProps) {
  const { isLoaded } = useGoogleMaps();
  const [inputValue, setInputValue] = useState(value?.name || '');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize services when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && typeof google !== 'undefined') {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      // Create a dummy div for PlacesService (required)
      const dummyDiv = document.createElement('div');
      placesServiceRef.current = new google.maps.places.PlacesService(dummyDiv);
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    }
  }, [isLoaded]);

  // Update input when value changes externally
  useEffect(() => {
    setInputValue(value?.name || '');
  }, [value]);

  // Fetch predictions with debounce
  const fetchPredictions = useCallback((input: string) => {
    if (!autocompleteServiceRef.current || !input.trim()) {
      setPredictions([]);
      setNoResults(false);
      return;
    }

    setIsLoading(true);
    setNoResults(false);
    setSearchedQuery(input);

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(YUCATAN_PENINSULA_BOUNDS.south, YUCATAN_PENINSULA_BOUNDS.west),
      new google.maps.LatLng(YUCATAN_PENINSULA_BOUNDS.north, YUCATAN_PENINSULA_BOUNDS.east)
    );

    const request: google.maps.places.AutocompletionRequest = {
      input,
      sessionToken: sessionTokenRef.current!,
      // Use 'establishment' to include hotels, restaurants, tourist attractions, etc.
      // Note: 'establishment' cannot be mixed with other types per Google API rules
      types: ['establishment'],
      componentRestrictions: { country: 'mx' },
    };

    // Use locationRestriction to strictly limit results to Riviera Maya area
    if (restrictToBounds) {
      request.locationRestriction = bounds;
    }

    autocompleteServiceRef.current.getPlacePredictions(request, (results, status) => {
      setIsLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        setPredictions(results);
        setNoResults(false);
        setIsOpen(true);
      } else {
        setPredictions([]);
        setNoResults(true);
        setIsOpen(true);
      }
    });
  }, [restrictToBounds]);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setNoResults(false);

    // Clear previous value when typing
    if (value) {
      onChange(null);
    }

    // Debounce API calls (300ms)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (newValue.length >= 3) {
      debounceRef.current = setTimeout(() => {
        fetchPredictions(newValue);
      }, 300);
    } else {
      setPredictions([]);
      setIsOpen(false);
      setNoResults(false);
    }
  };

  // Handle place selection
  const handleSelectPlace = useCallback((prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesServiceRef.current) {
      console.error('PlacesService not initialized');
      return;
    }

    setIsLoading(true);
    setIsOpen(false);

    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types'],
        sessionToken: sessionTokenRef.current!,
      },
      (place, status) => {
        setIsLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
          const result: PlaceResult = {
            placeId: place.place_id || prediction.place_id,
            name: place.name || prediction.structured_formatting.main_text,
            address: place.formatted_address || prediction.description,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            types: place.types || prediction.types,
          };

          setInputValue(result.name);
          onChange(result);
          setPredictions([]);

          // Create new session token for next search
          sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        } else {
          console.error('Failed to get place details:', status);
          // Fallback: use prediction data directly
          setInputValue(prediction.structured_formatting.main_text);
          onChange({
            placeId: prediction.place_id,
            name: prediction.structured_formatting.main_text,
            address: prediction.description,
            lat: 0,
            lng: 0,
            types: prediction.types,
          });
          setPredictions([]);
        }
      }
    );
  }, [onChange]);

  // Clear selection
  const handleClear = () => {
    setInputValue('');
    onChange(null);
    setPredictions([]);
    setIsOpen(false);
    setNoResults(false);
    setSearchedQuery('');
    inputRef.current?.focus();
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isLoaded) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-navy-800 rounded-lg animate-pulse">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => predictions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-9 pr-8 py-2.5 bg-white dark:bg-navy-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
            error
              ? 'border-red-500'
              : 'border-gray-200 dark:border-navy-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Predictions dropdown */}
      {isOpen && predictions.length > 0 && (
        <div className="absolute z-[100] left-0 right-0 sm:right-auto sm:min-w-[400px] sm:max-w-[500px] mt-1 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {predictions.map((prediction) => {
            const category = getCategoryFromTypes(prediction.types || [], locale);
            const CategoryIcon = category?.icon || MapPinIcon;

            return (
              <button
                key={prediction.place_id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectPlace(prediction);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors border-b border-gray-100 dark:border-navy-700 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${category?.color || 'bg-gray-400'} bg-opacity-20 mt-0.5 flex-shrink-0`}>
                    <CategoryIcon className={`w-4 h-4 ${category?.color ? category.color.replace('bg-', 'text-') : 'text-gray-500'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2 flex-wrap sm:flex-nowrap">
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-words sm:truncate flex-1 min-w-0">
                        {prediction.structured_formatting.main_text}
                      </p>
                      {category && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${category.color} text-white flex-shrink-0 whitespace-nowrap`}>
                          {category.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words sm:line-clamp-2">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No results message */}
      {isOpen && noResults && predictions.length === 0 && searchedQuery.length >= 3 && (
        <div className="absolute z-[100] left-0 right-0 sm:right-auto sm:min-w-[400px] mt-1 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg shadow-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <MapPinIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {NO_RESULTS_MESSAGES[locale].noResults}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {NO_RESULTS_MESSAGES[locale].serviceArea}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                &quot;{searchedQuery}&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
