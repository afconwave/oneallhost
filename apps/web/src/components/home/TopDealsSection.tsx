'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const DEALS = [
  {
    tag: 'FREE REBATE',
    title: 'Subdomain Staging Leases',
    badge: '100% REBATE',
    desc: 'Lease staging subdomains for 24h, 7d, or 30 days. 100% of rental fees credited back on domain purchase.',
    price: '$0.99',
    unit: '/ 24h (~610 XAF)',
    href: '/rentals',
    color: 'bg-emerald-100 text-emerald-900',
  },
  {
    tag: '55% OFF',
    title: '.CM & .COM Domain Registration',
    badge: 'HOT DEAL',
    desc: 'Claim your .cm or .com domain with sub-3-minute Anycast DNS and free lifetime WHOIS privacy.',
    price: '$13.99',
    unit: '/ yr (~8,611 XAF)',
    href: '/#domains',
    color: 'bg-blue-100 text-[#0D3B85]',
  },
  {
    tag: 'EARLY ACCESS',
    title: 'Managed Cloud Hosting',
    badge: 'NVMe SPEED',
    desc: 'High-speed NVMe hosting with Central & West Africa low-latency edge caching and 24/7 SLA.',
    price: '$24.99',
    unit: '/ mo (~15,375 XAF)',
    href: '/hosting-waitlist',
    color: 'bg-gray-200 text-[#111111]',
  },
  {
    tag: 'FREE TRIAL',
    title: 'Private Business Email',
    badge: '1 MONTH FREE',
    desc: 'Professional @yourdomain.com email with AI spam protection and built-in webmail workspace.',
    price: '$0.00',
    unit: '/ 1st mo (then $1.25/mo)',
    href: '/dashboard/support',
    color: 'bg-amber-100 text-amber-950',
  },
];

export const TopDealsSection: React.FC = () => {
  return (
    <section className="py-24 bg-white border-0 shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Explore Current Top Deals &amp; Offers
          </h2>
        </div>

        {/* Flat Borderless Shadowless Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEALS.map((deal, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#FAFAF9] border-0 shadow-none flex flex-col justify-between space-y-4 hover:bg-gray-100/70 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wide ${deal.color}`}>
                    {deal.tag}
                  </span>
                  <span className="text-[10px] font-bold text-[#0D3B85] font-mono">{deal.badge}</span>
                </div>

                <h3 className="text-lg font-bold text-[#111111] font-display">{deal.title}</h3>
                <p className="text-sm text-[#555555] leading-relaxed">{deal.desc}</p>
              </div>

              <div className="pt-4 border-t border-[#EBEBE7] space-y-3">
                <div>
                  <span className="text-2xl font-extrabold text-[#0D3B85] font-display">{deal.price}</span>
                  <span className="text-[11px] text-[#6B6E68] font-medium ml-1">{deal.unit}</span>
                </div>

                <Link
                  href={deal.href}
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[42px] px-4 bg-[#0D3B85] hover:bg-[#1B6FC9] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs active:scale-98 text-center"
                >
                  <span>Get Offer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
