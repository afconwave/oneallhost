'use client';

import React from 'react';
import Link from 'next/link';
import { MtnMomoBadge, OrangeMoneyBadge, VisaMastercardBadges } from '../PaymentBrandBadges';

export const MobileMoneySection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-[#EBEBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Payment methods we accept
          </h2>
          <p className="text-sm sm:text-base text-[#6B6E68] font-medium leading-relaxed">
            Pay seamlessly with 14+ Central & West African local mobile money methods, major credit/debit cards, and cryptocurrency.
          </p>
        </div>

        {/* 3 Clean Payment Category Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1: 14+ Central & West African Local Payments */}
          <div className="p-8 rounded-2xl bg-[#FAFAF9] border border-[#EBEBE7] space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#111111]">
                  <i className="fa-solid fa-mobile-screen-button text-lg text-amber-600" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-[#111111]">Local Mobile Money</h3>
                  <p className="text-xs text-[#6B6E68] font-medium">14+ African rails supported</p>
                </div>
              </div>

              <p className="text-sm text-[#6B6E68] font-medium leading-relaxed">
                Pay directly in XAF, XOF, or local currency with zero foreign exchange fees across CEMAC and West Africa.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <div className="p-2 bg-white border border-[#EBEBE7] rounded-lg">
                  <MtnMomoBadge />
                </div>
                <div className="p-2 bg-white border border-[#EBEBE7] rounded-lg">
                  <OrangeMoneyBadge />
                </div>
              </div>

              <div className="text-xs text-[#111111] font-bold flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 bg-white border border-[#EBEBE7] rounded">Express Union</span>
                <span className="px-2.5 py-1 bg-white border border-[#EBEBE7] rounded">Moov Money</span>
                <span className="px-2.5 py-1 bg-white border border-[#EBEBE7] rounded">Wave</span>
                <span className="px-2.5 py-1 bg-white border border-[#EBEBE7] rounded">Airtel Money</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBEBE7] text-xs font-bold text-[#0D3B85]">
              Direct Local Settlement
            </div>
          </div>

          {/* Category 2: Credit & Debit Cards */}
          <div className="p-8 rounded-2xl bg-[#FAFAF9] border border-[#EBEBE7] space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0D3B85]">
                  <i className="fa-regular fa-credit-card text-lg text-[#0D3B85]" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-[#111111]">Credit & Debit Cards</h3>
                  <p className="text-xs text-[#6B6E68] font-medium">Global payment networks</p>
                </div>
              </div>

              <p className="text-sm text-[#6B6E68] font-medium leading-relaxed">
                Worldwide instant checkout with Visa, Mastercard, and international bank cards protected by 256-bit encryption.
              </p>

              <div className="pt-2">
                <div className="p-2 bg-white border border-[#EBEBE7] rounded-lg inline-block">
                  <VisaMastercardBadges />
                </div>
              </div>

              <div className="text-xs text-[#111111] font-bold flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 bg-white border border-[#EBEBE7] rounded">Visa</span>
                <span className="px-2.5 py-1 bg-white border border-[#EBEBE7] rounded">Mastercard</span>
                <span className="px-2.5 py-1 bg-white border border-[#EBEBE7] rounded">Prepaid Cards</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBEBE7] text-xs font-bold text-[#0D3B85]">
              Instant Global Clearing
            </div>
          </div>

          {/* Category 3: Cryptocurrency */}
          <div className="p-8 rounded-2xl bg-[#FAFAF9] border border-[#EBEBE7] space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <i className="fa-brands fa-bitcoin text-lg text-emerald-700" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-[#111111]">Cryptocurrency</h3>
                  <p className="text-xs text-[#6B6E68] font-medium">Borderless digital assets</p>
                </div>
              </div>

              <p className="text-sm text-[#6B6E68] font-medium leading-relaxed">
                Pay with major cryptocurrencies and stablecoins for immediate domain and staging lease settlement.
              </p>

              <div className="text-xs text-[#111111] font-bold flex flex-wrap gap-2 pt-4">
                <span className="px-3 py-1.5 bg-white border border-[#EBEBE7] rounded flex items-center gap-1.5">
                  <i className="fa-solid fa-dollar-sign text-emerald-600 text-xs" />
                  <span>USDT (TRC-20 / ERC-20)</span>
                </span>
                <span className="px-3 py-1.5 bg-white border border-[#EBEBE7] rounded flex items-center gap-1.5">
                  <i className="fa-brands fa-bitcoin text-amber-500 text-xs" />
                  <span>Bitcoin (BTC)</span>
                </span>
                <span className="px-3 py-1.5 bg-white border border-[#EBEBE7] rounded flex items-center gap-1.5">
                  <i className="fa-brands fa-ethereum text-blue-500 text-xs" />
                  <span>Ethereum (ETH)</span>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBEBE7] text-xs font-bold text-[#0D3B85]">
              Automated Blockchain Confirmation
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
