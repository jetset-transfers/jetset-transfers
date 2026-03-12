'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CountryCode {
  code: string;
  country: string;
  label: string;
}

const countryCodes: CountryCode[] = [
  { code: '+1', country: 'us', label: 'USA (+1)' },
  { code: '+52', country: 'mx', label: 'México (+52)' },
  { code: '+1', country: 'ca', label: 'Canadá (+1)' },
  { code: '+44', country: 'gb', label: 'UK (+44)' },
  { code: '+34', country: 'es', label: 'España (+34)' },
  { code: '+33', country: 'fr', label: 'Francia (+33)' },
  { code: '+49', country: 'de', label: 'Alemania (+49)' },
  { code: '+39', country: 'it', label: 'Italia (+39)' },
  { code: '+55', country: 'br', label: 'Brasil (+55)' },
  { code: '+54', country: 'ar', label: 'Argentina (+54)' },
  { code: '+57', country: 'co', label: 'Colombia (+57)' },
  { code: '+56', country: 'cl', label: 'Chile (+56)' },
  { code: '+51', country: 'pe', label: 'Perú (+51)' },
  { code: '+58', country: 've', label: 'Venezuela (+58)' },
  { code: '+507', country: 'pa', label: 'Panamá (+507)' },
  { code: '+506', country: 'cr', label: 'Costa Rica (+506)' },
  { code: '+31', country: 'nl', label: 'Países Bajos (+31)' },
  { code: '+41', country: 'ch', label: 'Suiza (+41)' },
  { code: '+61', country: 'au', label: 'Australia (+61)' },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CountryCodeSelect({ value, onChange, className = '' }: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find current selected country
  const selectedCountry = countryCodes.find(c => c.code === value) || countryCodes[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Selected value button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
      >
        <Image
          src={`https://flagcdn.com/w40/${selectedCountry.country}.png`}
          alt={selectedCountry.label}
          width={24}
          height={16}
          className="rounded-sm object-cover"
          unoptimized
        />
        <span className="flex-1 text-left truncate">{selectedCountry.code}</span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-56 mt-1 py-1 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {countryCodes.map((country, index) => (
            <button
              key={`${country.country}-${index}`}
              type="button"
              onClick={() => {
                onChange(country.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors ${
                country.code === value && country.country === selectedCountry.country
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              <Image
                src={`https://flagcdn.com/w40/${country.country}.png`}
                alt={country.label}
                width={24}
                height={16}
                className="rounded-sm object-cover flex-shrink-0"
                unoptimized
              />
              <span className="truncate">{country.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
