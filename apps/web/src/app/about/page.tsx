'use client';

import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ShieldCheck, Globe, Zap, Server } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col text-[#111111]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-display">
            About Oneallhost
          </h1>
          <p className="text-sm text-[#6B6E68] max-w-xl mx-auto">
            High-performance Anycast DNS infrastructure, permanent domain registrations, and short-term staging leases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
            <Globe className="w-6 h-6 text-[#0D3B85]" />
            <h3 className="text-base font-bold text-[#111111]">ICANN Provisioning</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Direct XML registry integration for instant provisioning across 400+ generic and national TLDs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
            <Zap className="w-6 h-6 text-[#7CB342]" />
            <h3 className="text-base font-bold text-[#111111]">Sub-3-Minute Anycast</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Global DNS propagation resolving from 150+ edge nodes worldwide with 100% uptime SLA.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#1B6FC9]" />
            <h3 className="text-base font-bold text-[#111111]">Native Mobile Money</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Seamless local payment integration via MTN MoMo and Orange Money with zero exchange markups.
            </p>
          </div>
        </div>

        {/* Global Edge Infrastructure Display */}
        <div className="rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-sm bg-black relative min-h-[320px]">
          <img
            src="/images/DomainandHosting/oneallhosternear.png"
            alt="Oneallhost Global Anycast Mesh"
            className="w-full h-80 object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 text-white">
            <div>
              <h3 className="text-lg font-bold">Peering & Edge Presence</h3>
              <p className="text-xs text-blue-200 mt-1">Direct interconnection at Yaoundé, Douala, Frankfurt, and 150+ Anycast PoPs.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
