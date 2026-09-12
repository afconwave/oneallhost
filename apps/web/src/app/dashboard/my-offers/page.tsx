'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, Sparkles, Gift, Percent, ArrowRight, CheckCircle } from 'lucide-react';

interface PromoOffer {
  id: string;
  code: string;
  title: string;
  desc: string;
  discount: string;
  badge: string;
  validUntil: string;
  link: string;
}

export default function DashboardOffersPage() {
  const offers: PromoOffer[] = [
    {
      id: 'off-1',
      code: 'DEVPROMO26',
      title: '.DEV Domain Special',
      desc: 'Get your .DEV domain registration for just $10.98 with built-in HSTS HTTPS preloading.',
      discount: '31% OFF',
      badge: 'POPULAR',
      validUntil: '2026-12-31',
      link: '/domains/registration/gtld/dev',
    },
    {
      id: 'off-2',
      code: 'STORE098',
      title: '.STORE First Year Deal',
      desc: 'Launch your online store with a .store domain for only $0.98 (regular $2.88).',
      discount: '66% OFF',
      badge: 'HOT DEAL',
      validUntil: '2026-12-31',
      link: '/domains/registration/gtld/store',
    },
    {
      id: 'off-3',
      code: 'STAGING100',
      title: '100% Subdomain Rental Credit Rebate',
      desc: 'All rent paid on developer staging subdomains is 100% credited toward your permanent domain purchase.',
      discount: '100% REBATE',
      badge: 'DEVELOPER EXCLUSIVE',
      validUntil: 'Ongoing',
      link: '/dashboard/rentals',
    },
    {
      id: 'off-4',
      code: 'TRANSFERFREE',
      title: 'Free Domain Transfer + 1 Year Extension',
      desc: 'Transfer any eligible domain to Oneallhost and receive an automatic 1-year renewal extension included.',
      discount: '+1 YEAR FREE',
      badge: 'FREE EXTENSION',
      validUntil: '2026-12-31',
      link: '/domains/transfer',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
          My Offers &amp; Staging Rebates
        </h1>
        <p className="text-xs text-[#6B6E68] mt-1">
          Exclusive discounts, staging rental rebates, and promotional codes available on your account.
        </p>
      </div>

      {/* Rebate Balance Spotlight */}
      <div className="bg-gradient-to-r from-[#0D3B85] to-[#1E56B0] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-bold text-white">Staging Rebate Credit Balance</h2>
          </div>
          <p className="text-xs text-blue-100">
            When you lease staging subdomains, your rent accrues here to discount future domain purchases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-black font-mono text-white">$0.00 USD</div>
            <div className="text-[10px] text-blue-200">Available Credits</div>
          </div>
          <Link href="/dashboard/rentals">
            <button className="h-9 px-4 bg-white text-[#0D3B85] hover:bg-gray-100 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs">
              View Staging Leases
            </button>
          </Link>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl border border-[#F0F0EE] p-5 shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF2ED] text-[#FF5A27]">
                  {offer.badge}
                </span>
                <span className="text-xs font-black text-[#008A5E] bg-[#E8F8F3] px-2.5 py-0.5 rounded-full">
                  {offer.discount}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-[#111111]">{offer.title}</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">{offer.desc}</p>
            </div>

            <div className="pt-3 border-t border-[#F5F5F3] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#888888]">Promo Code:</span>
                <code className="px-2 py-0.5 rounded bg-gray-100 font-mono text-xs font-bold text-[#111111]">
                  {offer.code}
                </code>
              </div>

              <Link href={offer.link}>
                <button className="h-8 px-4 bg-[#FF5A27] hover:bg-[#e04a1b] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1">
                  <span>Claim Offer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
