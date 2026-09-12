'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function EmailPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F5] text-[#111111] font-sans flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-[#091F44] text-white py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-[#0D3B85] text-white text-xs font-black uppercase rounded tracking-wide">
              Private Business Email
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white leading-tight">
              Build Instant Trust with Business Email
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed">
              Create professional mailboxes with @yourdomain.com. Enjoy ad-free webmail, calendar sync, anti-spam protection, and mobile compatibility.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/auth/register">
                <button className="h-12 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer">
                  Get Business Email
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0D3B85] text-white flex items-center justify-center mx-auto text-3xl shadow-xl">
              <i className="fa-solid fa-envelope-open-text" />
            </div>
            <h3 className="text-xl font-bold text-white">Ad-Free &amp; Secure Webmail</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Sync seamlessly across iPhone, Android, Outlook, and Apple Mail with IMAP/POP3/SMTP support.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold font-display text-[#111111]">
            Business Email Tiers
          </h2>
          <p className="text-sm text-[#6B6E68]">
            Fast, private, and reliable email hosting for individuals and growing teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="bg-white p-8 rounded-3xl space-y-6 shadow-xs border-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase text-[#6B6E68]">Starter Mail</div>
              <h3 className="text-2xl font-extrabold text-[#111111]">Starter</h3>
              <div className="text-3xl font-black text-[#0D3B85]">
                $0.99 <span className="text-xs text-[#6B6E68] font-normal">/ mo</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#333333] pt-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 5 GB Email Storage</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 1 Domain Mailbox</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Anti-Spam &amp; Anti-Virus</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Webmail, Mobile &amp; Desktop Sync</li>
              </ul>
            </div>
            <Link href="/auth/register">
              <button className="w-full h-11 bg-[#0D3B85] hover:bg-[#091F44] text-white font-bold text-xs rounded-xl transition-colors">
                Order Starter
              </button>
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-3xl space-y-6 shadow-md border-2 border-[#0D3B85] flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0D3B85] text-white text-[10px] font-black uppercase rounded-full">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="text-xs font-black uppercase text-[#0D3B85]">Pro Mail</div>
              <h3 className="text-2xl font-extrabold text-[#111111]">Pro Business</h3>
              <div className="text-3xl font-black text-[#0D3B85]">
                $2.49 <span className="text-xs text-[#6B6E68] font-normal">/ mo</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#333333] pt-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 30 GB Email Storage</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 3 Mailboxes Included</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Shared Contacts &amp; Calendar</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Advanced Spam Guard</li>
              </ul>
            </div>
            <Link href="/auth/register">
              <button className="w-full h-11 bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors">
                Order Pro Mail
              </button>
            </Link>
          </div>

          {/* Ultimate */}
          <div className="bg-white p-8 rounded-3xl space-y-6 shadow-xs border-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase text-[#6B6E68]">Ultimate Team</div>
              <h3 className="text-2xl font-extrabold text-[#111111]">Ultimate</h3>
              <div className="text-3xl font-black text-[#0D3B85]">
                $4.99 <span className="text-xs text-[#6B6E68] font-normal">/ mo</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#333333] pt-2">
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 75 GB Storage</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> 5 Mailboxes Included</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Full Team Collaboration Suite</li>
                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-[#7CB342]" /> Priority Technical Support</li>
              </ul>
            </div>
            <Link href="/auth/register">
              <button className="w-full h-11 bg-[#0D3B85] hover:bg-[#091F44] text-white font-bold text-xs rounded-xl transition-colors">
                Order Ultimate
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
