'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />

      {/* 1. Dark Navy Hero Section */}
      <section className="bg-[#091F44] text-white py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-[#7CB342] text-white text-xs font-black uppercase rounded tracking-wide">
              Security Suite
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight text-white">
              Protect your website, domain, and data with confidence
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              From free lifetime WHOIS privacy protection to 256-bit SSL certificates and 24/7 automated malware scanning — keep your online business safe.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/auth/register">
                <button className="h-12 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer">
                  Get Started Today
                </button>
              </Link>
              <Link href="/dashboard/support">
                <button className="h-12 px-8 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-xl transition-all border border-white/20 cursor-pointer">
                  Contact Security Team
                </button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-blue-900/40 to-indigo-950/60 p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl">
              <div className="w-20 h-20 rounded-2xl bg-[#0D3B85] text-white flex items-center justify-center shadow-xl">
                <i className="fa-solid fa-shield-halved text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-white">100% Guaranteed Protection</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Free identity privacy with every domain registration. Automated SSL deployment within 3 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Emergency SOS Banner */}
      <section className="bg-[#D32F2F] text-white py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white text-[#D32F2F] flex items-center justify-center shrink-0 font-black text-lg">
              <i className="fa-solid fa-kit-medical" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">Website Compromised or Hacked?</h4>
              <p className="text-xs text-white/90">Our emergency security response team cleans infected sites within 24 hours.</p>
            </div>
          </div>
          <Link href="/dashboard/support">
            <button className="h-10 px-6 bg-white text-[#D32F2F] font-extrabold text-xs rounded-xl hover:bg-gray-100 transition-colors shrink-0 cursor-pointer">
              Fix Hacked Website (SOS)
            </button>
          </Link>
        </div>
      </section>

      {/* 3. Security Products Grid */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold font-display text-[#111111]">
            Comprehensive Security Solutions
          </h2>
          <p className="text-sm text-[#6B6E68]">
            Choose the right layer of protection tailored to your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* SSL Certificates */}
          <div className="bg-white p-8 rounded-3xl space-y-5 shadow-xs border-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
                <i className="fa-solid fa-lock text-xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111111]">SSL Certificates</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Encrypt sensitive customer data, boost SEO rankings, and display the trusted padlock icon in browsers.
              </p>
              <ul className="space-y-2 text-xs text-[#333333] pt-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 256-bit Industry Encryption</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Instant 1-Click Auto Install</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> $50,000 Relying Party Warranty</li>
              </ul>
            </div>
            <Link href="/auth/register" className="pt-4">
              <button className="w-full h-11 bg-[#0D3B85] hover:bg-[#091F44] text-white font-bold text-xs rounded-xl transition-colors">
                Explore SSL Options
              </button>
            </Link>
          </div>

          {/* Domain Privacy */}
          <div className="bg-white p-8 rounded-3xl space-y-5 shadow-xs border-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#7CB342] flex items-center justify-center">
                <i className="fa-solid fa-user-shield text-xl" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#111111]">Domain Privacy Guard</h3>
                <span className="px-2 py-0.5 bg-[#7CB342] text-white rounded text-[10px] font-black uppercase">FREE</span>
              </div>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Keep your personal phone number, home address, and personal email address completely hidden from public WHOIS databases.
              </p>
              <ul className="space-y-2 text-xs text-[#333333] pt-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 100% Free Lifetime Guard</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Blocks Telemarketers &amp; Spam</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Automatic Setup on Registration</li>
              </ul>
            </div>
            <Link href="/domains" className="pt-4">
              <button className="w-full h-11 bg-[#0D3B85] hover:bg-[#091F44] text-white font-bold text-xs rounded-xl transition-colors">
                Search Domains with Free Privacy
              </button>
            </Link>
          </div>

          {/* PremiumDNS */}
          <div className="bg-white p-8 rounded-3xl space-y-5 shadow-xs border-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A27] flex items-center justify-center">
                <i className="fa-solid fa-tower-cell text-xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111111]">PremiumDNS Anycast</h3>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Global Anycast DNS nodes deliver ultra-fast domain resolution and continuous 100% DNS uptime SLA.
              </p>
              <ul className="space-y-2 text-xs text-[#333333] pt-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 100% Uptime Guarantee</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> DDoS Mitigation Built-in</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Global Low-Latency Anycast Nodes</li>
              </ul>
            </div>
            <Link href="/auth/register" className="pt-4">
              <button className="w-full h-11 bg-[#0D3B85] hover:bg-[#091F44] text-white font-bold text-xs rounded-xl transition-colors">
                Upgrade to PremiumDNS
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
