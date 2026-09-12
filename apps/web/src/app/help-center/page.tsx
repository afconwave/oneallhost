'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />

      {/* Hero with Search */}
      <section className="bg-[#091F44] text-white py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-3 py-1 bg-[#7CB342] text-white text-xs font-black uppercase rounded tracking-wide">
            Oneallhost Help Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white leading-tight">
            How can we help you today?
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Search 500+ tutorials, step-by-step guides, DNS troubleshooting articles, and account management FAQs.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto pt-4">
            <div className="flex items-center gap-3 bg-white px-5 h-14 rounded-2xl shadow-xl">
              <i className="fa-solid fa-magnifying-glass text-[#6B6E68] text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles e.g. how to change nameservers, install SSL..."
                className="w-full h-full text-sm text-[#111111] placeholder:text-[#6B6E68] outline-none font-medium bg-transparent"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold font-display text-[#111111]">
            Knowledgebase Categories
          </h2>
          <p className="text-sm text-[#6B6E68]">
            Browse help topics by service area or product.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl space-y-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer border-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
              <i className="fa-solid fa-globe text-base" />
            </div>
            <h3 className="font-bold text-sm text-[#111111]">Domains &amp; DNS</h3>
            <p className="text-xs text-[#6B6E68]">Domain registration, EPP codes, WHOIS, Anycast DNS records.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer border-0">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#7CB342] flex items-center justify-center">
              <i className="fa-solid fa-server text-base" />
            </div>
            <h3 className="font-bold text-sm text-[#111111]">Hosting &amp; cPanel</h3>
            <p className="text-xs text-[#6B6E68]">cPanel management, FTP credentials, database setup, PHP versions.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer border-0">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <i className="fa-brands fa-wordpress text-base" />
            </div>
            <h3 className="font-bold text-sm text-[#111111]">WordPress Cloud</h3>
            <p className="text-xs text-[#6B6E68]">1-click WP setup, plugin troubleshooting, staging &amp; speed tuning.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl space-y-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer border-0">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5A27] flex items-center justify-center">
              <i className="fa-solid fa-envelope text-base" />
            </div>
            <h3 className="font-bold text-sm text-[#111111]">Private Email</h3>
            <p className="text-xs text-[#6B6E68]">Outlook &amp; iPhone IMAP configuration, DKIM/SPF records, webmail.</p>
          </div>
        </div>

        {/* Live Support Card */}
        <div className="bg-[#EAEFF8] p-8 sm:p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-extrabold text-[#111111]">Can&apos;t find what you&apos;re looking for?</h3>
            <p className="text-xs sm:text-sm text-[#6B6E68]">Our technical engineers are available 24/7/365 to assist you.</p>
          </div>
          <Link href="/dashboard/support">
            <button className="h-11 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors shrink-0">
              Submit Support Ticket
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
