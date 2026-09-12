'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function TransferPage() {
  const [domainToTransfer, setDomainToTransfer] = useState('');

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domainToTransfer.trim()) {
      window.location.href = `/checkout?domain=${encodeURIComponent(domainToTransfer)}&type=transfer`;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-[#091F44] text-white py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-3 py-1 bg-[#0D3B85] text-white text-xs font-black uppercase rounded tracking-wide">
            Domain &amp; Hosting Migration
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white leading-tight">
            Transfer Your Domains &amp; Hosting to Oneallhost
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Get +1 Year FREE domain registration extension when you transfer. Plus zero-downtime free hosting migration handled by our experts.
          </p>

          {/* Transfer Search Input */}
          <form onSubmit={handleTransferSubmit} className="max-w-2xl mx-auto pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl shadow-xl">
              <div className="flex-1 flex items-center gap-3 px-4 w-full">
                <i className="fa-solid fa-arrow-right-arrow-left text-[#6B6E68]" />
                <input
                  type="text"
                  value={domainToTransfer}
                  onChange={(e) => setDomainToTransfer(e.target.value)}
                  placeholder="Enter your domain to transfer (e.g. mybrand.com)"
                  className="w-full h-11 text-sm text-[#111111] placeholder:text-[#6B6E68] outline-none font-medium bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto h-11 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Transfer Now
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3 Step Transfer Process */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold font-display text-[#111111]">
            Simple 3-Step Domain Transfer Process
          </h2>
          <p className="text-sm text-[#6B6E68]">
            Moving your domains is fast, safe, and backed by our sub-3-minute DNS propagation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl space-y-4 shadow-xs border-0 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0D3B85] font-black flex items-center justify-center mx-auto text-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Unlock Your Domain</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Log into your current registrar, unlock your domain name, and obtain your EPP transfer authorization code.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl space-y-4 shadow-xs border-0 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 text-[#7CB342] font-black flex items-center justify-center mx-auto text-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Enter Domain &amp; Code</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Type your domain in the search box above, enter your auth code, and confirm your transfer order.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl space-y-4 shadow-xs border-0 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#D32F2F] font-black flex items-center justify-center mx-auto text-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Enjoy +1 Year Free</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Your domain transfer completes smoothly with +1 extra year added to your expiration date automatically.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
