'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '@oneallhost/ui';

interface AvailableRental {
  id: string;
  subdomain: string;
  fullDomain?: string;
  parentDomain?: string;
  tldCategory?: string;
  dailyPriceUsd?: number;
  weeklyPriceUsd?: number;
  monthlyPriceUsd?: number;
  pricePaidUsd?: number;
  rebatePercent?: number;
  available?: boolean;
  status?: string;
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<AvailableRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/v1/rentals');
      if (!res.ok) {
        throw new Error(`Failed to load rentals (HTTP ${res.status})`);
      }
      const data = await res.json();
      setRentals(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to rentals backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col text-[#111111] font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12 w-full">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] font-display">
            Subdomain Staging & Leases
          </h1>
          <p className="text-sm sm:text-base text-[#6B6E68] font-medium leading-relaxed">
            Lease high-reputation developer staging subdomains for 24h, 7d, or 30d. 100% of all rental fees are credited back when you purchase a domain.
          </p>
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-8 rounded-2xl bg-white border border-[#EBEBE7] space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-16 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="p-8 rounded-2xl bg-white border border-red-200 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <h3 className="font-bold text-lg text-[#111111]">Unable to load staging leases</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRentals}
              className="bg-white border-[#DCDDD8] text-[#0D3B85] font-bold text-xs h-10 px-5 rounded-lg"
            >
              <i className="fa-solid fa-arrow-rotate-right mr-2 text-xs" />
              <span>Retry Fetch</span>
            </Button>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && rentals.length === 0 && (
          <div className="p-12 rounded-2xl bg-white border border-[#EBEBE7] text-center max-w-xl mx-auto space-y-5 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-network-wired" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#111111]">No Active Staging Leases Listed</h3>
              <p className="text-sm text-[#6B6E68] font-medium leading-relaxed">
                There are currently no public staging subdomains available for lease. You can register a permanent domain or configure custom Anycast DNS records in the client portal.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a href="/#domains">
                <Button
                  variant="primary"
                  size="md"
                  className="bg-[#0D3B85] text-white hover:bg-[#1B6FC9] font-bold text-xs h-10 px-6 rounded-lg shadow-none"
                >
                  <span>Search Permanent Domains</span>
                  <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                </Button>
              </a>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="md"
                  className="bg-white border-[#DCDDD8] text-[#111111] hover:bg-[#FAFAF9] font-bold text-xs h-10 px-6 rounded-lg shadow-none"
                >
                  <span>Client Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* 4. Populated State */}
        {!loading && !error && rentals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((r) => (
              <div
                key={r.id}
                className="p-8 rounded-2xl bg-white border border-[#EBEBE7] flex flex-col justify-between space-y-6 shadow-xs hover:border-[#0D3B85]/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded bg-blue-50 text-[#0D3B85] font-bold">
                      {r.tldCategory || 'Staging Sandbox'}
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <i className="fa-solid fa-shield-halved text-xs text-[#7CB342]" />
                      <span>100% Rebate</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#111111]">
                    {r.fullDomain || `${r.subdomain}.oah.link`}
                  </h3>

                  <p className="text-xs text-[#6B6E68] font-medium leading-relaxed">
                    Sub-3-minute Anycast DNS edge propagation with automated SSL certificates and full purchase rebate.
                  </p>

                  <div className="pt-2 text-2xl font-black text-[#0D3B85]">
                    ${r.weeklyPriceUsd || r.pricePaidUsd || '3.99'}
                    <span className="text-xs font-medium text-[#6B6E68] ml-1">/ 7 Days</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBEBE7]">
                  <Link href={`/checkout?subdomain=${r.subdomain}&type=rental`}>
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full bg-[#0D3B85] hover:bg-[#1B6FC9] text-white font-bold text-xs h-10 rounded-lg shadow-none"
                    >
                      <span>Lease This Subdomain</span>
                      <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
