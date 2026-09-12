'use client';

import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { RefreshCcw, Sparkles, Server, Globe, ShieldCheck } from 'lucide-react';

export const RefundContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#111111] font-sans">
      <Header />

      {/* Header Banner */}
      <section className="bg-[#091F44] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
            <RefreshCcw className="w-3.5 h-3.5 text-[#00C288]" />
            <span>Customer Guarantee &amp; Rebate Terms</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Refund &amp; Rebate Policy
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80">
            Last Updated: January 1, 2026 • 30-Day Money-Back Guarantee &amp; 100% Staging Rebate Program
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        {/* 100% Staging Rebate Highlight */}
        <div className="bg-gradient-to-r from-[#0D3B85] to-[#1E56B0] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold text-white">100% Developer Staging Subdomain Rebate Program</h2>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            All fees paid on developer staging subdomain leases (e.g. <code>project.oneall.app</code>) automatically accumulate in your account rebate balance. When registering your permanent top-level domain (.com, .cm, .store, .dev), 100% of your accrued staging rent is credited as an instant discount at checkout.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Server className="w-4 h-4 text-[#0D3B85]" />
            <span>1. 30-Day Money-Back Guarantee on Hosting</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            All shared NVMe cloud hosting, Managed WordPress, and Reseller hosting plans come with an unconditional 30-day money-back guarantee. If you are unsatisfied with server performance or uptime, submit a ticket within 30 days of initial purchase for a full refund back to your original payment method.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0D3B85]" />
            <span>2. Domain Registration Grace Periods &amp; Refunds</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            Under ICANN and central registry rules, new domain registrations may be cancelled within the registry&apos;s 5-day Add Grace Period (AGP) minus non-refundable registry processing fees. Domain renewals and transfers that have already executed at the registry operator level are non-refundable.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D3B85]" />
            <span>3. How to Request a Refund</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            To request a refund, navigate to your Client Dashboard, open a billing ticket, or email <code>billing@oneallhost.com</code> with your invoice number. Refunds are processed within 24 to 48 business hours to your original payment method (Credit Card, Mobile Money, or Account Credit).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
