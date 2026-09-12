'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DomainSearchBar } from '@/components/domains/DomainSearchBar';

export default function DomainNameSearchPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular' | 'tech' | 'ecommerce' | 'cctld'>('all');

  const featuredTlds = [
    { tld: 'store', category: 'gtld', path: '/domains/registration/gtld/store', price: 0.98, orig: 2.88, badge: 'HOT DEAL', desc: 'The commerce standard' },
    { tld: 'com', category: 'gtld', path: '/domains/registration/gtld/com', price: 6.79, orig: 13.99, badge: 'MOST POPULAR', desc: 'The King of domains' },
    { tld: 'dev', category: 'gtld', path: '/domains/registration/gtld/dev', price: 10.98, orig: 15.98, badge: 'DEVELOPER', desc: 'Develop your site today' },
    { tld: 'net', category: 'gtld', path: '/domains/registration/gtld/net', price: 12.48, orig: 14.98, badge: 'SALE', desc: 'A true Internet original' },
    { tld: 'org', category: 'gtld', path: '/domains/registration/gtld/org', price: 8.48, orig: 14.48, badge: '41% OFF', desc: 'Start making a difference' },
    { tld: 'cm', category: 'cctld', path: '/domains/registration/cctld/cm', price: 28.00, orig: 37.99, badge: 'LOCAL ccTLD', desc: 'Official Cameroon Registry' },
    { tld: 'io', category: 'cctld', path: '/domains/registration/cctld/io', price: 34.98, orig: 65.98, badge: 'SAAS FAVORITE', desc: 'Time to grow with .io' },
    { tld: 'ai', category: 'cctld', path: '/domains/registration/cctld/ai', price: 89.98, orig: 179.96, badge: 'AI ERA', desc: 'Secure your .ai domain' },
    { tld: 'co', category: 'cctld', path: '/domains/registration/cctld/co', price: 19.98, orig: 38.48, badge: '48% OFF', desc: 'Get ready to go with .co' },
    { tld: 'me', category: 'cctld', path: '/domains/registration/cctld/me', price: 10.98, orig: 19.98, badge: '45% OFF', desc: 'Show more of you' },
    { tld: 'ca', category: 'cctld', path: '/domains/registration/cctld/ca', price: 11.98, orig: 14.98, badge: 'CANADA', desc: 'Canadians trust the .ca' },
    { tld: 'co.uk', category: 'cctld', path: '/domains/registration/cctld/co-uk', price: 6.98, orig: 7.48, badge: 'UK SPECIAL', desc: 'Great British domain' },
  ];

  const filterTlds = () => {
    switch (selectedFilter) {
      case 'popular':
        return featuredTlds.filter((t) => ['com', 'store', 'cm', 'net'].includes(t.tld));
      case 'tech':
        return featuredTlds.filter((t) => ['dev', 'io', 'ai'].includes(t.tld));
      case 'ecommerce':
        return featuredTlds.filter((t) => ['store', 'com', 'co'].includes(t.tld));
      case 'cctld':
        return featuredTlds.filter((t) => t.category === 'cctld');
      default:
        return featuredTlds;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />

      {/* 1. Dark Navy Search Hero with Live DomainSearchBar */}
      <section className="bg-[#0B1528] text-white py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white backdrop-blur-xs">
            <i className="fa-solid fa-bolt text-[#FF5A27]" />
            <span>Instant Anycast DNS Propagation in Sub-3 Minutes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Domain Name Search
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-normal">
            Find your ideal web address across 400+ top-level domains. Every domain includes 100% Free Lifetime WHOIS Privacy Guard &amp; DNSSEC standard.
          </p>

          {/* Live Auto-fetching Domain Search Bar Component */}
          <div className="pt-4">
            <DomainSearchBar />
          </div>
        </div>
      </section>

      {/* 2. Filterable TLD Category Matrix & Dedicated Landing Page Links */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111]">
            Explore 400+ TLD Domain Extensions
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6E68] max-w-xl mx-auto">
            Click any domain extension to discover custom registration perks, renewal pricing matrices, and technical specifications.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {(
              [
                { id: 'all', label: 'All Extensions' },
                { id: 'popular', label: 'Most Popular' },
                { id: 'tech', label: 'Tech & Developers' },
                { id: 'ecommerce', label: 'Ecommerce & Stores' },
                { id: 'cctld', label: 'Country ccTLDs' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-[#0D3B85] text-white shadow-xs'
                    : 'bg-[#F5F7FA] text-[#555555] hover:bg-[#EAEFF8] hover:text-[#0D3B85]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TLD Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filterTlds().map((tldItem) => (
            <Link
              key={tldItem.tld}
              href={tldItem.path}
              className="bg-white rounded-2xl p-5 border border-[#F0F0EE] hover:border-[#0D3B85] hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-[#111111] group-hover:text-[#0D3B85] transition-colors">
                    .{tldItem.tld.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF2ED] text-[#FF5A27]">
                    {tldItem.badge}
                  </span>
                </div>
                <p className="text-xs text-[#6B6E68] line-clamp-2">
                  {tldItem.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F5F5F3] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#888888] uppercase font-bold">Starts at</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-extrabold text-[#111111]">
                      ${tldItem.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#888888] line-through">
                      ${tldItem.orig.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#666666]">/yr</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#0D3B85] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View TLD →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Included with Every Domain */}
      <section className="py-16 px-4 sm:px-8 bg-[#FAFAF9] border-t border-[#EBEBE7]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Included FREE with every domain name
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6E68]">
              No hidden fees, no surprise upsells. Everything you need to launch with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#F0F0EE] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-emerald-600 flex items-center justify-center">
                <i className="fa-solid fa-user-shield text-base" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">Free Lifetime Privacy</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Keep your phone number, email, and home address masked from spam and scraping databases forever.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#F0F0EE] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
                <i className="fa-solid fa-bolt text-base" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">Anycast DNS Mesh</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Global nameservers ensure instant sub-3-minute zone propagation and lightning-fast DNS lookups.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#F0F0EE] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <i className="fa-solid fa-lock text-base" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">Free DNSSEC Security</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Cryptographic authentication protects your website visitors against DNS spoofing and cache poisoning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#F0F0EE] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <i className="fa-solid fa-envelope text-base" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">Free Email Forwarding</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Set up custom redirect aliases like hello@yourdomain.com pointing to your existing personal inbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 100% Subdomain Staging Rebate Spotlight */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#0D3B85] to-[#1E56B0] text-white p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">
              Developer Friendly
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              100% Subdomain Staging Rental Rebate
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Lease a staging subdomain (e.g. <code>client.oneall.app</code>) while building your project. When you register the final domain, 100% of your staging lease is credited toward your domain purchase!
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link href="/domains/full-tld-list">
              <button className="h-11 px-6 bg-white text-[#0D3B85] hover:bg-gray-100 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md">
                View Full TLD Pricing List
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Live Chat Support Bar */}
      <div className="bg-[#EAEFF8] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#111111]">
          <span className="font-semibold">Need help choosing a domain extension? We&apos;re always here for you.</span>
          <Link href="/dashboard/support">
            <button className="h-9 px-5 bg-[#2C6E63] hover:bg-[#205249] text-white font-bold text-xs rounded-xl cursor-pointer">
              Chat with a Live Person
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
