'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function WordPressPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-[#091F44] text-white py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <i className="fa-brands fa-wordpress text-3xl text-blue-400" />
              <span className="text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 px-3 py-1 rounded">
                Managed WordPress Cloud
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white leading-tight">
              Ultra-Fast Managed WordPress Cloud Hosting
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Launch your WordPress website in under 60 seconds. Powered by high-speed NVMe cloud storage, automatic updates, built-in caching, and daily backups.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/hosting">
                <button className="h-12 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer">
                  See WordPress Plans
                </button>
              </Link>
              <Link href="/transfer">
                <button className="h-12 px-8 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-xl transition-all border border-white/20 cursor-pointer">
                  Free Site Migration
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto text-3xl shadow-xl">
              <i className="fa-brands fa-wordpress" />
            </div>
            <h3 className="text-xl font-bold text-white">Why Choose Our WordPress Cloud?</h3>
            <div className="grid grid-cols-2 gap-4 text-left pt-2">
              <div className="p-3 rounded-xl bg-white/5 space-y-1">
                <div className="text-xs font-bold text-blue-300">1-Click Setup</div>
                <div className="text-[11px] text-white/70">Instant WP installation</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 space-y-1">
                <div className="text-xs font-bold text-blue-300">Object Caching</div>
                <div className="text-[11px] text-white/70">Sub-500ms load times</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 space-y-1">
                <div className="text-xs font-bold text-blue-300">Automatic WP Updates</div>
                <div className="text-[11px] text-white/70">Core &amp; plugin security</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 space-y-1">
                <div className="text-xs font-bold text-blue-300">Free SFTP &amp; DB Access</div>
                <div className="text-[11px] text-white/70">Developer flexibility</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold font-display text-[#111111]">
            Engineered Specifically for WordPress
          </h2>
          <p className="text-sm text-[#6B6E68]">
            Everything you need to create, manage, and scale your WordPress site effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl space-y-4 shadow-xs border-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
              <i className="fa-solid fa-[#0D3B85] fa-bolt text-xl" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">NVMe Speed Storage</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Up to 20x faster page loading speeds compared to traditional HDD hosting, boosting SEO and conversion rates.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl space-y-4 shadow-xs border-0">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#7CB342] flex items-center justify-center">
              <i className="fa-solid fa-arrows-rotate text-xl" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Auto Backups &amp; Staging</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Test design changes on 1-click staging environments before pushing live. Daily automatic off-site backups included.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl space-y-4 shadow-xs border-0">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A27] flex items-center justify-center">
              <i className="fa-solid fa-headset text-xl" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">24/7 WordPress Experts</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Our specialized WP engineers are online around the clock to help with plugin issues, speed tuning, and site migrations.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
