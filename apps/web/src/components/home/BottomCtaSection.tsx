'use client';

import React from 'react';
import Link from 'next/link';

export const BottomCtaSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#091F44] text-white overflow-hidden">
      {/* Full-bleed Section Background Image */}
      <img
        src="/images/DomainandHosting/hostingservers.png"
        alt="Oneallhost Global Infrastructure"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />
      {/* Deep Navy to Brand Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#091F44]/95 via-[#0D3B85]/85 to-[#091F44]/95 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Ready to launch your domain infrastructure?
        </h2>
        <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
          Register permanent ICANN domains with sub-3-minute Anycast DNS propagation, or start with flexible staging leases and 100% purchase rebates.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#domains"
            className="inline-flex items-center justify-center font-bold text-sm text-[#0D3B85] bg-white hover:bg-blue-50 rounded-xl h-12 px-8 transition-colors shadow-lg"
          >
            <span>Search Domains</span>
            <i className="fa-solid fa-arrow-right ml-2 text-xs" />
          </a>

          <Link
            href="/rentals"
            className="inline-flex items-center justify-center font-bold text-sm text-white rounded-xl h-12 px-8 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors shadow-sm"
          >
            <span>Explore Subdomain Leases</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
