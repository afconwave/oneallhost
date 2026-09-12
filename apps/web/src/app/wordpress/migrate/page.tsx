'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

export default function WordPressMigrationPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />

      <section className="bg-[#091F44] text-white py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-[#7CB342] text-white text-xs font-black uppercase rounded tracking-wide">
              WordPress Migration
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Seamless WordPress Site Migration
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Move your existing WordPress site to our high-speed NVMe managed cloud with zero downtime and automated plugin checks.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/auth/register">
                <button className="h-12 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer">
                  Start WP Migration
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto text-3xl shadow-xl">
              <i className="fa-brands fa-wordpress" />
            </div>
            <h3 className="text-xl font-bold text-white">100% Free WP Transfer</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Our WP engineers transfer database, uploads, plugins, themes, and configuration flawlessly.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
