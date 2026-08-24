'use client';

import React from 'react';
import { Rocket, ShieldCheck, Zap, Smartphone } from 'lucide-react';

export const HumanLedDemoSection: React.FC = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-10">
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111111] font-display">
            Human-led. Tech-powered.
          </h2>
          <p className="text-sm text-[#6B6E68]">
            Real engineers backing an automated cloud registrar designed to get you live instantly.
          </p>
        </div>

        {/* Large Center "Go Live" Interactive Card */}
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-[#0D3B85] via-[#1B6FC9] to-[#0D3B85] text-white shadow-2xl relative flex flex-col items-center justify-center space-y-6">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#0D3B85] font-extrabold text-lg sm:text-xl shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <Rocket className="w-6 h-6 text-[#1B6FC9]" />
            <span>Go Live</span>
          </div>

          <p className="text-xs text-blue-100 max-w-sm">
            Click to deploy your domain, connect DNS records, and launch in less than 3 minutes.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-5 border border-[#EBEBE7] rounded-2xl bg-[#FAFAF9] space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#7CB342]" />
            <h4 className="text-sm font-bold text-[#111111]">Free WHOIS Privacy</h4>
            <p className="text-xs text-[#6B6E68]">Your identity and contact details remain hidden from spammers and scraping bots.</p>
          </div>

          <div className="p-5 border border-[#EBEBE7] rounded-2xl bg-[#FAFAF9] space-y-2">
            <Zap className="w-6 h-6 text-[#1B6FC9]" />
            <h4 className="text-sm font-bold text-[#111111]">Sub-3-Min Anycast</h4>
            <p className="text-xs text-[#6B6E68]">Global DNS propagation across 150+ worldwide edge nodes immediately.</p>
          </div>

          <div className="p-5 border border-[#EBEBE7] rounded-2xl bg-[#FAFAF9] space-y-2">
            <Smartphone className="w-6 h-6 text-[#4E7525]" />
            <h4 className="text-sm font-bold text-[#111111]">Direct Mobile Money</h4>
            <p className="text-xs text-[#6B6E68]">Zero external redirections. Instant USSD push notifications to your phone.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
