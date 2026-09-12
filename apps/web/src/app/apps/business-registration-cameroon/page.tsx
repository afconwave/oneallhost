'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

export default function BusinessRegistrationCameroonPage() {
  const [businessName, setBusinessName] = useState('');
  const [legalType, setLegalType] = useState('Ets');

  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#091F44] text-white py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-[#7CB342] text-white text-xs font-black uppercase rounded tracking-wide">
              Cameroon Official Business Setup
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white leading-tight">
              Official Business Registration in Cameroon (RCCM &amp; NIU)
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Register your Ets (Établissement) or SARL (Société à Responsabilité Limitée) legally in Cameroon with complete RCCM registry, Tax Identification Number (NIU), domain name, and official business email.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="#start">
                <button className="h-12 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer">
                  Start Registration Now
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Cameroon Business Starter Package</h3>
            <div className="space-y-3 text-xs text-white/80">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <i className="fa-solid fa-file-contract text-[#7CB342] text-lg" />
                <div>
                  <div className="font-bold text-white">Official RCCM Registration</div>
                  <div>Registred at Commercial Court (Greffe du Tribunal de Commerce)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <i className="fa-solid fa-id-card text-[#7CB342] text-lg" />
                <div>
                  <div className="font-bold text-white">Tax ID (NIU) Attribution</div>
                  <div>Official Numéro d'Identifiant Unique from Direction Générale des Impôts</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <i className="fa-solid fa-globe text-[#7CB342] text-lg" />
                <div>
                  <div className="font-bold text-white">Domain &amp; Business Email</div>
                  <div>.cm or .com domain name + 3 business email addresses included</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="start" className="py-24 px-4 sm:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold font-display text-[#111111]">
            Register Your Business Entity in Cameroon
          </h2>
          <p className="text-sm text-[#6B6E68]">
            Complete legal setup processed within 5 to 10 business days.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border-0 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111111]">Proposed Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Douala Digital Services Ets"
              className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] text-xs text-[#111111] outline-none focus:border-[#0D3B85]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111111]">Select Legal Structure</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLegalType('Ets')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  legalType === 'Ets' ? 'border-[#0D3B85] bg-blue-50/50' : 'border-[#E2E4E8]'
                }`}
              >
                <div className="font-bold text-xs text-[#111111]">Ets (Établissement)</div>
                <div className="text-[11px] text-[#6B6E68] mt-1">Ideal for sole proprietors, freelancers, and small merchants.</div>
              </button>

              <button
                type="button"
                onClick={() => setLegalType('SARL')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  legalType === 'SARL' ? 'border-[#0D3B85] bg-blue-50/50' : 'border-[#E2E4E8]'
                }`}
              >
                <div className="font-bold text-xs text-[#111111]">SARL (Limited Liability)</div>
                <div className="text-[11px] text-[#6B6E68] mt-1">Ideal for multi-partner businesses and corporations.</div>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/auth/register">
              <button className="w-full h-12 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors">
                Proceed with Cameroon Legal Setup
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
