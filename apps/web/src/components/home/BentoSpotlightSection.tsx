'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@oneallhost/ui';

export const BentoSpotlightSection: React.FC = () => {
  return (
    <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Permanent Domains & Anycast DNS (Crisp Architectural Surface) */}
        <div className="p-8 sm:p-10 bg-[#0D3B85] text-white flex flex-col justify-between shadow-lg relative border border-[#0D3B85] min-h-[300px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-blue-200 font-mono">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-globe text-[#7CB342]" />
                <span>PERMANENT REGISTRY</span>
              </span>
              <span>ICANN VERIFIED</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Permanent Domain Names & DNS
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-md">
              Full ICANN ownership across .com, .cm, .africa, .io and 400+ extensions with automated Anycast DNS and free lifetime WHOIS privacy.
            </p>

            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-xs text-blue-200">Starting from</span>
              <span className="text-3xl font-extrabold text-white font-mono">$13.99</span>
              <span className="text-xs text-blue-200">/ yr (8,611 XAF)</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
            <a href="#domains">
              <Button
                variant="primary"
                size="md"
                className="bg-white text-[#0D3B85] hover:bg-[#FAFAF9] font-bold text-xs h-10 px-5 rounded-lg shadow-none"
              >
                <span>Search Domain Availability</span>
                <i className="fa-solid fa-arrow-right ml-2 text-xs" />
              </Button>
            </a>
            <span className="text-xs font-mono text-blue-200">Live Anycast Mesh</span>
          </div>
        </div>

        {/* Card 2: Subdomain Staging & Leases (Crisp Architectural Surface) */}
        <div className="p-8 sm:p-10 bg-white text-[#111111] flex flex-col justify-between shadow-lg relative border border-[#DCDDD8] min-h-[300px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6B6E68] font-mono">
              <span className="flex items-center gap-2 text-emerald-800 font-bold">
                <i className="fa-solid fa-arrows-rotate text-[#7CB342]" />
                <span>100% CONVERSION REBATE</span>
              </span>
              <span className="text-[#0D3B85] font-bold">INSTANT ANYCAST</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#111111]">
              Subdomain Staging & Leases
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6E68] leading-relaxed max-w-md">
              Lease short-term developer subdomains for 24h, 7d, or 30 days. 100% of all rental payments are automatically credited back when you purchase your domain.
            </p>

            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-xs text-[#6B6E68]">Lease from</span>
              <span className="text-3xl font-extrabold text-[#0D3B85] font-mono">$0.99</span>
              <span className="text-xs text-[#6B6E68]">/ 24h (610 XAF)</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#EBEBE7] flex items-center justify-between">
            <Link href="/rentals">
              <Button
                variant="primary"
                size="md"
                className="bg-[#0D3B85] text-white hover:bg-[#1B6FC9] font-bold text-xs h-10 px-5 rounded-lg shadow-none"
              >
                <span>Browse Staging Leases</span>
                <i className="fa-solid fa-arrow-right ml-2 text-xs" />
              </Button>
            </Link>
            <span className="text-xs font-mono text-emerald-700 font-semibold">100% Rebate Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  );
};
