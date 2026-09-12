'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { DomainSearchBar } from '../../components/domains/DomainSearchBar';
import { Button } from '@oneallhost/ui';
import { Search, ShieldCheck, Zap, RefreshCw, Lock, ArrowRight, Layers, Cpu, ArrowRightLeft } from 'lucide-react';

const TOP_TLDS = [
  { tld: '.com', price: '$6.79', renew: '$13.99', badge: 'POPULAR', color: 'bg-red-600', link: '/domains/registration/gtld/com' },
  { tld: '.cm', price: '$28.00', renew: '$37.99', badge: 'LOCAL REGISTRY', color: 'bg-emerald-600', link: '/domains/registration/cctld/cm' },
  { tld: '.store', price: '$0.98', renew: '$2.88', badge: 'HOT DEAL', color: 'bg-[#FF5A27]', link: '/domains/registration/gtld/store' },
];

const TLD_TABLE = [
  { extension: '.com', reg: '$6.79', renew: '$13.99', transfer: '$11.98', popular: true, path: '/domains/registration/gtld/com' },
  { extension: '.store', reg: '$0.98', renew: '$2.88', transfer: '$0.98', popular: true, path: '/domains/registration/gtld/store' },
  { extension: '.dev', reg: '$10.98', renew: '$20.98', transfer: '$15.98', popular: true, path: '/domains/registration/gtld/dev' },
  { extension: '.cm', reg: '$28.00', renew: '$37.99', transfer: '$28.00', popular: true, path: '/domains/registration/cctld/cm' },
  { extension: '.net', reg: '$12.48', renew: '$18.58', transfer: '$12.98', popular: false, path: '/domains/registration/gtld/net' },
  { extension: '.org', reg: '$8.48', renew: '$18.98', transfer: '$12.28', popular: false, path: '/domains/registration/gtld/org' },
  { extension: '.io', reg: '$34.98', renew: '$75.98', transfer: '$65.98', popular: false, path: '/domains/registration/cctld/io' },
  { extension: '.ai', reg: '$89.98', renew: '$114.98', transfer: '$99.98', popular: false, path: '/domains/registration/cctld/ai' },
  { extension: '.co', reg: '$19.98', renew: '$45.48', transfer: '$38.48', popular: false, path: '/domains/registration/cctld/co' },
  { extension: '.ca', reg: '$11.98', renew: '$14.98', transfer: '$10.98', popular: false, path: '/domains/registration/cctld/ca' },
];

const DOMAIN_FAQS = [
  {
    q: 'How fast is domain activation and DNS setup on Oneallhost?',
    a: 'Domain activation is instantaneous upon payment confirmation via MTN MoMo, Orange Money, or credit card. Your Anycast DNS zone file is propagated globally within sub-3 minutes.',
  },
  {
    q: 'Is WHOIS Privacy Protection really 100% free forever?',
    a: 'Yes. Oneallhost includes free lifetime WHOIS Privacy Protection with every eligible domain registration to prevent spam and protect your personal contact details.',
  },
  {
    q: 'How does the 100% Subdomain Staging Rebate work?',
    a: 'When you lease a developer staging subdomain (e.g. yourname.oneall.app), 100% of your rental payment is automatically credited as a discount when you purchase your permanent domain name.',
  },
  {
    q: 'Can I transfer an existing domain to Oneallhost?',
    a: 'Yes! Domain transfers include a free 1-year extension added directly to your existing registration period with zero downtime.',
  },
];

export default function DomainsPage() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      window.location.href = `/checkout?domain=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section matching Namecheap Domains Screenshot */}
        <section className="bg-[#091F44] text-white pt-20 pb-28 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <h1 className="text-4xl sm:text-6xl font-extrabold font-display leading-tight text-white">
              Domain Prices &amp; Registration
            </h1>

            {/* Live Domain Search Bar */}
            <div className="pt-2">
              <DomainSearchBar />
            </div>
          </div>
        </section>

        {/* 2. Top 3 Prominent Featured TLD Cards (Overlapping Hero Layout) */}
        <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_TLDS.map((item) => (
              <div key={item.tld} className="p-8 rounded-2xl bg-white shadow-xl border border-[#F0F0EE] flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-extrabold font-mono text-[#0D3B85]">{item.tld}</span>
                    <span className={`px-2.5 py-1 text-white font-bold text-[10px] rounded-lg ${item.color}`}>
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-xs text-[#6B6E68]">Renews at {item.renew}/yr</div>
                </div>

                <div className="pt-4 border-t border-[#EBEBE7] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-3xl font-extrabold text-[#111111] font-mono">{item.price}</span>
                    <span className="text-xs text-[#6B6E68]"> / 1st yr</span>
                  </div>
                  <Link href={item.link}>
                    <button className="h-10 px-5 bg-[#FF5A27] hover:bg-[#e04a1b] text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-xs">
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Domain Search Simplified (3 Column Feature Grid) */}
        <section className="py-24 bg-[#F6F7F5] mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <h2 className="text-3xl font-extrabold font-display text-[#111111] text-center">
              Domain Search Simplified
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white space-y-4 text-center sm:text-left border border-[#F0F0EE]">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center mx-auto sm:mx-0">
                  <Layers className="w-6 h-6 text-[#7CB342]" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">Bulk Domain Search</h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  Search up to 5,000 domain names simultaneously and register multiple extensions with one click.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white space-y-4 text-center sm:text-left border border-[#F0F0EE]">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center mx-auto sm:mx-0">
                  <Cpu className="w-6 h-6 text-[#7CB342]" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">Beast Mode Domain Discovery</h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  Filter by extension category, budget, or name length with instant domain generator algorithms.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white space-y-4 text-center sm:text-left border border-[#F0F0EE]">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center mx-auto sm:mx-0">
                  <ArrowRightLeft className="w-6 h-6 text-[#7CB342]" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">Domain Transfer (+1 YR Free)</h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  Transfer existing domain registrations seamlessly to Oneallhost with zero downtime and +1 YR extension.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Full TLD Pricing Table Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <h2 className="text-3xl font-extrabold font-display text-[#111111] text-center">
              Find the Primary Price of Your Domain
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-[#EBEBE7]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F6F7F5] text-[#111111] font-bold uppercase tracking-wider text-[11px] border-b border-[#EBEBE7]">
                  <tr>
                    <th className="py-4 px-6">Domain Extension</th>
                    <th className="py-4 px-6">Registration (1st YR)</th>
                    <th className="py-4 px-6">Renewal Price</th>
                    <th className="py-4 px-6">Transfer Price</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE7]">
                  {TLD_TABLE.map((row) => (
                    <tr key={row.extension} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#0D3B85] text-base font-mono">
                        <Link href={row.path} className="hover:underline flex items-center gap-1.5 inline-flex">
                          <span>{row.extension}</span>
                          <span className="text-[11px] font-normal text-[#6B6E68]">→</span>
                        </Link>
                        {row.popular && (
                          <span className="ml-2 px-2 py-0.5 bg-[#7CB342]/15 text-[#4E7525] font-bold text-[10px] rounded">
                            Popular
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold font-mono text-sm text-[#111111]">{row.reg}</td>
                      <td className="py-4 px-6 font-mono text-[#6B6E68]">{row.renew}</td>
                      <td className="py-4 px-6 font-mono text-[#6B6E68]">{row.transfer}</td>
                      <td className="py-4 px-6 text-right">
                        <Link href={row.path}>
                          <button className="h-8 px-4 bg-[#0D3B85] hover:bg-[#1B6FC9] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                            View {row.extension.toUpperCase()}
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
