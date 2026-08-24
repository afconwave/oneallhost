'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Badge } from '@oneallhost/ui';
import { Repeat, ArrowRight, ShieldCheck, Clock, CheckCircle2, Globe } from 'lucide-react';

export default function RentalsManagementPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/users/rentals')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.rentals)) {
          setRentals(data.rentals);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">
            Subdomain Rentals & Staging Leases
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Rent high-reputation staging subdomains with 100% conversion rebates credited on domain purchases.
          </p>
        </div>

        <Link href="/#rentals">
          <Button variant="primary" size="sm" className="bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs gap-1.5 rounded-xl shadow-xs">
            <span>Explore Subdomain Leases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Main Table / Empty State */}
      <div className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs">
        {rentals.length > 0 ? (
          <div className="divide-y divide-[#EBEBE7]">
            {rentals.map((rnt) => (
              <div key={rnt.id} className="p-4 flex items-center justify-between hover:bg-[#FAFAF9] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#7CB342] flex items-center justify-center font-bold">
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#111111]">{rnt.subdomain}</div>
                    <div className="text-[11px] text-[#6B6E68]">Expires: {rnt.expiresAt}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    100% Rebate: ${rnt.rebateCreditUsd}
                  </span>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs text-[#0D3B85]">
                    Convert to Purchase
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Repeat className="w-8 h-8 text-[#6B6E68] mx-auto opacity-40" />
            <div className="text-sm font-semibold text-[#111111]">No active subdomain leases</div>
            <p className="text-xs text-[#6B6E68] max-w-sm mx-auto">
              Need temporary hosting for a hackathon, staging demo, or event? Lease subdomains from $0.99 with 100% rebate on purchase.
            </p>
            <Link href="/#rentals" className="inline-block pt-2">
              <Button variant="primary" size="sm" className="bg-[#0D3B85] hover:bg-[#1B6FC9] text-xs">
                Browse Available Leases
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
