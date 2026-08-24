'use client';

import React, { useState } from 'react';
import { Button, Card, Badge } from '@oneallhost/ui';
import { Search, CheckCircle, XCircle, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const DomainSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'XAF'>('USD');
  const [searchedDomain, setSearchedDomain] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
    if (!cleanQuery) return;

    setIsSearching(true);
    setSearchError('');
    setSearchedDomain(cleanQuery);

    try {
      // Connect to real live backend API gateway (which queries live Namecheap XML API)
      const apiUrl = `http://localhost:4000/api/v1/domains/search?q=${encodeURIComponent(cleanQuery)}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
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
      setSearchError('Live registry check failed. Please check connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickTld = (tld: string) => {
    const base = query ? query.split('.')[0] : 'mybrand';
    setQuery(`${base}.${tld}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Domain Search Input Container */}
      <div className="bg-white p-2 sm:p-3 rounded-2xl shadow-xl shadow-blue-950/5 border border-[#DCDDD8] hover:border-[#0D3B85] transition-all">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-[#0D3B85] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your domain name (e.g. startup.cm, brand.com, app.africa)..."
              className="w-full h-14 pl-12 pr-4 text-base font-semibold bg-transparent text-[#111111] placeholder:text-[#6B6E68] focus:outline-none"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Currency Switcher */}
            <button
              type="button"
              onClick={() => setCurrency(currency === 'USD' ? 'XAF' : 'USD')}
              className="px-3.5 h-14 text-xs font-bold border border-[#DCDDD8] rounded-xl bg-[#FAFAF9] text-[#0D3B85] hover:bg-[#F3F4F1] transition-colors shrink-0"
              title="Toggle USD / XAF Currency"
            >
              {currency}
            </button>

            <Button
              variant="primary"
              size="lg"
              className="h-14 px-8 font-bold text-sm bg-[#0D3B85] hover:bg-[#1B6FC9] rounded-xl shrink-0 gap-2 shadow-sm"
              isLoading={isSearching}
            >
              <span>Search Domain</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Popular TLD Quick Selectors */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-[#6B6E68] font-medium mr-1">Popular:</span>
        <button
          type="button"
          onClick={() => handleQuickTld('com')}
          className="px-3 py-1.5 rounded-lg bg-white border border-[#EBEBE7] hover:border-[#0D3B85] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span className="font-bold text-[#111111]">.com</span>
          <span className="text-[#0D3B85] font-bold">{currency === 'USD' ? '$13.99' : '8,611 XAF'}</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleQuickTld('cm')}
          className="px-3 py-1.5 rounded-lg bg-[#F8FAF6] border border-[#D6E8C2] hover:border-[#7CB342] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span className="font-bold text-emerald-950">.cm</span>
          <span className="text-emerald-700 font-bold">{currency === 'USD' ? '$37.99' : '23,383 XAF'}</span>
          <span className="px-1 text-[9px] bg-[#7CB342] text-white rounded font-bold">CEMAC</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickTld('africa')}
          className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:border-blue-500 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span className="font-bold text-blue-950">.africa</span>
          <span className="text-blue-700 font-bold">{currency === 'USD' ? '$19.99' : '12,304 XAF'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickTld('org')}
          className="px-3 py-1.5 rounded-lg bg-white border border-[#EBEBE7] hover:border-[#0D3B85] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span className="font-bold text-[#111111]">.org</span>
          <span className="text-[#6B6E68] font-semibold">{currency === 'USD' ? '$14.99' : '9,226 XAF'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickTld('net')}
          className="px-3 py-1.5 rounded-lg bg-white border border-[#EBEBE7] hover:border-[#0D3B85] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span className="font-bold text-[#111111]">.net</span>
          <span className="text-[#6B6E68] font-semibold">{currency === 'USD' ? '$15.99' : '9,841 XAF'}</span>
        </button>
      </div>

      {/* Error state if API fails */}
      {searchError && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 text-center">
          {searchError}
        </div>
      )}

      {/* Real Live Registry Search Results (Permanent Registrations Only) */}
      {results.length > 0 && (
        <div className="mt-8 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#7CB342]" />
              <span>Live Domain Availability (Namecheap Verified)</span>
            </h3>
            <span className="text-xs text-[#0D3B85] font-semibold">
              Results for &quot;{searchedDomain}&quot;
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {results.map((res) => (
              <div
                key={res.domainName}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                  res.isAvailable
                    ? 'border-[#DCDDD8] hover:border-[#0D3B85] bg-white shadow-xs'
                    : 'bg-[#FAFAF9] opacity-75 border-[#EBEBE7]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {res.isAvailable ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                      <XCircle className="w-5 h-5 text-neutral-400" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#111111]">{res.domainName}</span>
                      {res.isAvailable ? (
                        <Badge variant="success">Available</Badge>
                      ) : (
                        <Badge variant="neutral">Taken</Badge>
                      )}
                      {res.isPremium && <Badge variant="warning">Premium</Badge>}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#6B6E68]">
                      {res.whoisPrivacySupported ? (
                        <span className="inline-flex items-center gap-1 text-[#4E7525] font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" /> Free Lifetime WHOIS Privacy
                        </span>
                      ) : (
                        <span>Standard WHOIS Registry</span>
                      )}
                      <span>•</span>
                      <span>Renewal: {currency === 'USD' ? `$${res.retailPriceUsd.toFixed(2)}` : `${res.retailPriceXaf.toLocaleString()} XAF`}/yr</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-base font-bold text-[#0D3B85]">
                      {currency === 'USD' ? `$${res.retailPriceUsd.toFixed(2)}` : `${res.retailPriceXaf.toLocaleString()} XAF`}
                    </div>
                    <div className="text-[10px] text-[#6B6E68]">1st Year Registration</div>
                  </div>

                  {res.isAvailable ? (
                    <Link href={`/checkout?domain=${res.domainName}&amount=${res.retailPriceUsd}`}>
                      <Button
                        variant="primary"
                        size="md"
                        className="gap-1.5 bg-[#0D3B85] hover:bg-[#1B6FC9] px-5 font-bold text-xs whitespace-nowrap shadow-xs rounded-xl"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 bg-gray-100 text-gray-400 font-semibold text-xs rounded-xl cursor-not-allowed border border-gray-200"
                    >
                      Taken
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
