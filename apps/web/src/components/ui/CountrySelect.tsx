'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_AFRICAN_COUNTRIES } from '@oneallhost/payments';
import { Search, ChevronDown, Check } from 'lucide-react';

const COUNTRY_FLAGS: Record<string, string> = {
  BJ: '🇧🇯',
  BF: '🇧🇫',
  CM: '🇨🇲',
  CD: '🇨🇩',
  CG: '🇨🇬',
  GA: '🇬🇦',
  GH: '🇬🇭',
  GN: '🇬🇳',
  CI: '🇨🇮',
  KE: '🇰🇪',
  ML: '🇲🇱',
  NE: '🇳🇪',
  NG: '🇳🇬',
  RW: '🇷🇼',
  SN: '🇸🇳',
  TZ: '🇹🇿',
  TG: '🇹🇬',
  UG: '🇺🇬',
  US: '🇺🇸',
  GB: '🇬🇧',
};

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries = Object.values(SUPPORTED_AFRICAN_COUNTRIES);
  const selectedCountry = countries.find((c) => c.code === value) || countries[2]; // Default CM

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Borderless Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-[#111111] flex items-center justify-between transition-colors border-0 focus:outline-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg leading-none">{COUNTRY_FLAGS[selectedCountry.code] || '🌐'}</span>
          <span className="truncate font-bold">{selectedCountry.name} ({selectedCountry.code})</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#6B6E68] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Borderless Search-Enabled Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl p-2 space-y-2 border-0 animate-in fade-in duration-150">
          {/* Live Search Input */}
          <div className="relative flex items-center px-2 py-1.5 bg-gray-50 rounded-xl">
            <Search className="w-3.5 h-3.5 text-[#6B6E68] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country name or code..."
              className="w-full pl-7 pr-2 py-1 bg-transparent text-xs text-[#111111] placeholder:text-[#6B6E68] focus:outline-none border-0 font-medium"
              autoFocus
            />
          </div>

          {/* Filtered Country List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.code === value;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-[#0D3B85] font-bold'
                        : 'hover:bg-gray-50 text-[#111111] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base leading-none">{COUNTRY_FLAGS[country.code] || '🌐'}</span>
                      <span className="truncate">{country.name}</span>
                      <span className="text-[10px] text-[#6B6E68] font-mono">({country.currencyCode})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0D3B85]" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-[#6B6E68]">
                No country found matching &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
