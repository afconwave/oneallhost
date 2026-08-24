'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@oneallhost/ui';
import { MtnMomoBadge, OrangeMoneyBadge, VisaMastercardBadges } from './PaymentBrandBadges';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#091F44] text-white pt-24 mt-24">
      {/* CONTINUOUS ANIMATED SVG WAVES */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none transform -translate-y-[98%]">
        <svg
          className="relative block w-[200%] h-16 sm:h-24 animate-wave text-[#091F44]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use href="#gentle-wave" x="48" y="0" fill="rgba(9, 31, 68, 0.25)" className="animate-wave-slow" />
            <use href="#gentle-wave" x="48" y="3" fill="rgba(13, 59, 133, 0.45)" className="animate-wave-medium" />
            <use href="#gentle-wave" x="48" y="5" fill="rgba(27, 111, 201, 0.3)" className="animate-wave-fast" />
            <use href="#gentle-wave" x="48" y="7" fill="#091F44" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo variant="horizontal" height={42} />
            </Link>
            
            <p className="text-xs text-blue-100/75 max-w-sm leading-relaxed">
              Unified ICANN domain registrar, flexible short-term subdomain rentals, and managed cloud infrastructure.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <MtnMomoBadge size="sm" />
              <OrangeMoneyBadge size="sm" />
              <VisaMastercardBadges />
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Registrar Products</h4>
            <ul className="space-y-2 text-xs text-blue-100/70">
              <li>
                <Link href="/#domains" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Domain Registration</span>
                  <i className="bi bi-arrow-up-right text-[10px] opacity-70" />
                </Link>
              </li>
              <li>
                <Link href="/transfer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Domain Transfer</span>
                  <i className="bi bi-arrow-up-right text-[10px] opacity-70" />
                </Link>
              </li>
              <li>
                <Link href="/rentals-explainer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Subdomain Rentals</span>
                  <i className="bi bi-arrow-up-right text-[10px] opacity-70" />
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white hover:underline">
                  TLD Pricing Matrix
                </Link>
              </li>
              <li>
                <Link href="/hosting-waitlist" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Managed Cloud Hosting</span>
                  <span className="px-1.5 py-0.2 text-[9px] bg-[#7CB342] text-white rounded font-bold">NEW</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Dashboard */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Client Portal</h4>
            <ul className="space-y-2 text-xs text-blue-100/70">
              <li><Link href="/dashboard" className="hover:text-white">Overview & Stats</Link></li>
              <li><Link href="/dashboard/domains" className="hover:text-white">DNS Zone File Editor</Link></li>
              <li><Link href="/dashboard/rentals" className="hover:text-white">Active Leases & Rebates</Link></li>
              <li><Link href="/dashboard/billing" className="hover:text-white">Invoices & Cards</Link></li>
              <li><Link href="/dashboard/support" className="hover:text-white">Technical Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs text-blue-100/70">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white">Refund & 100% Rebate Policy</Link></li>
              <li><Link href="/about" className="hover:text-white">About Oneallhost</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-100/60 gap-4">
          <p>© {new Date().getFullYear()} Oneallhost Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-blue-200 font-medium">USD & XAF Currency Engine</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-white/80">
              <i className="bi bi-lock-fill text-[#7CB342]" /> 256-Bit SSL Encrypted
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
