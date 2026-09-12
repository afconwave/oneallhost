'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

export default function BusinessStarterKitPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />

      <section className="bg-[#091F44] text-white py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-[#7CB342] text-white text-xs font-black uppercase rounded tracking-wide">
              Business Starter Kit
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Get Your Complete Business Online in 10 Minutes
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Domain name, 1-click website builder, custom @yourdomain.com email, and AI logo maker — all in one free setup package.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/auth/register">
                <button className="h-12 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer">
                  Claim Starter Kit
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0D3B85] text-white flex items-center justify-center mx-auto text-3xl shadow-xl">
              <i className="fa-solid fa-briefcase" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant Professional Identity</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Start accepting customer inquiries and building brand trust from day one.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
