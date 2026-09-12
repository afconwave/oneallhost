'use client';

import React, { useState, useEffect } from 'react';
import { Button, Badge } from '@oneallhost/ui';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useGeoCurrency, formatLocalPrice } from '../../lib/geoCurrency';

export const DomainSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { geoConfig } = useGeoCurrency();
  const [searchedDomain, setSearchedDomain] = useState('');
  const [searchError, setSearchError] = useState('');

  // Execute live search across all extensions
  const performSearch = async (searchTerm: string) => {
    const cleanQuery = searchTerm.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
    if (!cleanQuery || cleanQuery.length < 2) {
      setResults([]);
      setSearchedDomain('');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSearchedDomain(cleanQuery);

    try {
      const apiUrl = `/api/domains/search?q=${encodeURIComponent(cleanQuery)}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Registry API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err: any) {
      console.error('[Domain Search Error]', err);
      setSearchError('Live registry check failed. Please check your connection.');
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced auto-fetch as user types
  useEffect(() => {
    const clean = query.trim();
    if (!clean || clean.length < 2) {
      setResults([]);
      setSearchedDomain('');
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(clean);
    }, 380);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const handleQuickTld = (tld: string) => {
    const base = query ? query.split('.')[0] : 'mybrand';
    const newQuery = `${base}.${tld}`;
    setQuery(newQuery);
    performSearch(newQuery);
  };

  return (
    <div className="w-full max-w-3xl mx-auto font-sans">
      {/* Search Input Box with Live Typing Indicator */}
      <div className="bg-white p-2 rounded-2xl shadow-xl shadow-black/20 border border-[#DCDDD8] hover:border-[#0D3B85] focus-within:border-[#0D3B85] transition-all">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full flex items-center">
            <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none transition-colors ${isSearching ? 'text-[#DE3723] animate-pulse' : 'text-[#0D3B85]'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type any domain name (e.g. startup, mybrand.com, shop.cm)..."
              className="w-full h-11 sm:h-12 pl-10 pr-9 text-sm font-semibold bg-transparent text-[#111111] placeholder:text-[#6B6E68] focus:outline-none"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-3 w-4 h-4 border-2 border-[#DE3723] border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full sm:w-auto h-11 sm:h-12 px-6 font-bold text-xs sm:text-sm bg-[#DE3723] hover:bg-[#C52D1C] text-white rounded-xl shrink-0 gap-1.5 shadow-xs cursor-pointer active:scale-95"
            isLoading={isSearching}
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Popular TLD Selectors */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <span className="text-white/80 font-medium text-[11px] mr-0.5 shrink-0">Popular:</span>
          
          <button
            type="button"
            onClick={() => handleQuickTld('com')}
            className="min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1 text-[11px] sm:text-xs cursor-pointer shrink-0"
          >
            <span className="font-bold">.com</span>
            <span className="text-emerald-300 font-bold">{formatLocalPrice(13.99, geoConfig.currencyCode)}</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickTld('cm')}
            className="min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1 text-[11px] sm:text-xs cursor-pointer shrink-0"
          >
            <span className="font-bold">.cm</span>
            <span className="text-emerald-300 font-bold">{formatLocalPrice(37.99, geoConfig.currencyCode)}</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickTld('africa')}
            className="min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1 text-[11px] sm:text-xs cursor-pointer shrink-0"
          >
            <span className="font-bold">.africa</span>
            <span className="text-emerald-300 font-bold">{formatLocalPrice(19.99, geoConfig.currencyCode)}</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickTld('net')}
            className="min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1 text-[11px] sm:text-xs cursor-pointer shrink-0"
          >
            <span className="font-bold">.net</span>
            <span className="text-white/80">{formatLocalPrice(15.99, geoConfig.currencyCode)}</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickTld('org')}
            className="min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1 text-[11px] sm:text-xs cursor-pointer shrink-0"
          >
            <span className="font-bold">.org</span>
            <span className="text-white/80">{formatLocalPrice(14.99, geoConfig.currencyCode)}</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickTld('io')}
            className="min-h-[28px] sm:min-h-[30px] px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1 text-[11px] sm:text-xs cursor-pointer shrink-0"
          >
            <span className="font-bold">.io</span>
            <span className="text-white/80">{formatLocalPrice(39.99, geoConfig.currencyCode)}</span>
          </button>
        </div>

        {/* Currency Tag */}
        <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/10 text-white rounded-lg border border-white/20 text-[10px] sm:text-[11px] font-bold shrink-0">
          <span>{geoConfig.currencyCode}</span>
          <span className="text-white/60 text-[9px] sm:text-[10px]">({geoConfig.countryCode})</span>
        </div>
      </div>

      {/* Error state */}
      {searchError && (
        <div className="mt-3 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 text-center">
          {searchError}
        </div>
      )}

      {/* Clean, Dynamic Results List Across Multiple Extensions */}
      {results.length > 0 && (
        <div className="mt-5 sm:mt-6 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="font-bold text-white text-[11px] sm:text-xs truncate">
              Extensions for &ldquo;{searchedDomain}&rdquo;
            </span>
            <span className="text-white/70 text-[10px] sm:text-xs shrink-0 ml-2">{results.length} checked</span>
          </div>

          <div className="space-y-2">
            {results.map((res) => {
              const formattedPrice = formatLocalPrice(res.retailPriceUsd, geoConfig.currencyCode);
              return (
                <div
                  key={res.domainName}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-[#EBEBE7] shadow-md text-[#111111] hover:border-[#0D3B85]/40 transition-colors"
                >
                  {/* Left: Domain Name & Status */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0">
                    <span className="text-sm sm:text-base font-bold text-[#111111] truncate">
                      {res.domainName}
                    </span>
                    {res.isAvailable ? (
                      <Badge variant="success" className="shrink-0 text-[10px] py-0.5 font-bold">Available</Badge>
                    ) : (
                      <Badge variant="neutral" className="shrink-0 text-[10px] py-0.5">Taken</Badge>
                    )}
                  </div>

                  {/* Right: Price & Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t border-gray-100 sm:border-t-0">
                    <div className="text-left sm:text-right">
                      <div className="text-sm sm:text-base font-bold text-[#0D3B85]">
                        {formattedPrice}
                      </div>
                      <div className="text-[10px] text-[#6B6E68]">/ year</div>
                    </div>

                    {res.isAvailable ? (
                      <Link href={`/checkout?domain=${res.domainName}&amount=${res.retailPriceUsd}&country=${geoConfig.countryCode}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-[#DE3723] hover:bg-[#C52D1C] px-3.5 sm:px-4 py-1.5 sm:py-2 font-bold text-xs rounded-xl h-8 sm:h-9 whitespace-nowrap cursor-pointer"
                        >
                          Register
                        </Button>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-3 py-1 bg-gray-100 text-gray-400 font-bold text-xs rounded-xl cursor-not-allowed border border-gray-200 h-8 sm:h-9"
                      >
                        Taken
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
