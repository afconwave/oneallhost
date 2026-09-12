'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Repeat,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Globe,
  Clock,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface StagingTier {
  period: string;
  price: string;
  unit: string;
  popular?: boolean;
  desc: string;
  features: string[];
}

const TIERS: StagingTier[] = [
  {
    period: 'Daily Pass',
    price: '$0.25',
    unit: '/ day',
    desc: 'Perfect for quick client demos, hotfix testing, and PR reviews.',
    features: [
      'Instant sub-3-minute DNS setup',
      'Free AutoSSL TLS 1.3 included',
      '100% Purchase Rebate accrued',
      'No renewal commitment',
    ],
  },
  {
    period: 'Weekly Sprint',
    price: '$1.20',
    unit: '/ week',
    popular: true,
    desc: 'Ideal for 1-2 week development sprints, QA testing, and staging.',
    features: [
      'Instant Anycast DNS mesh',
      'Free AutoSSL Wildcard encryption',
      '100% Purchase Rebate accrued',
      'Full DNS Zone record control (A, CNAME, TXT)',
    ],
  },
  {
    period: 'Monthly Stage',
    price: '$3.99',
    unit: '/ month',
    desc: 'Designed for MVP launches, investor pitch previews, and early beta testing.',
    features: [
      'Persistent staging subdomain',
      'Free AutoSSL & DDoS mitigation',
      '100% Purchase Rebate applied at checkout',
      'Priority Anycast routing',
    ],
  },
];

const AVAILABLE_ZONES = [
  { parent: 'oneall.app', category: 'General Apps', sample: 'yourproject.oneall.app', badge: 'POPULAR' },
  { parent: 'devpreview.io', category: 'Tech & SaaS', sample: 'yourclient.devpreview.io', badge: 'DEVELOPER' },
  { parent: 'staginghub.cm', category: 'Cameroon Local', sample: 'boutique.staginghub.cm', badge: 'LOCAL ccTLD' },
  { parent: 'appbuild.co', category: 'Startup Beta', sample: 'demo.appbuild.co', badge: 'FAST' },
];

export default function SubdomainRentalsPage() {
  const [desiredSubdomain, setDesiredSubdomain] = useState('');
  const [selectedParent, setSelectedParent] = useState('oneall.app');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const cleanPrefix = desiredSubdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const fullSubdomain = cleanPrefix ? `${cleanPrefix}.${selectedParent}` : `yourproject.${selectedParent}`;

  const handleRentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanPrefix) {
      window.location.href = `/checkout?subdomain=${encodeURIComponent(fullSubdomain)}&type=rental`;
    }
  };

  const faqs = [
    {
      q: 'How does the 100% Staging Rental Rebate work?',
      a: 'Every dollar you spend renting developer staging subdomains (e.g., $1.20/week on yourproject.oneall.app) accumulates in your account rebate wallet. When you purchase a permanent domain name (.com, .cm, .store, .dev), 100% of your accumulated rent is automatically deducted from your checkout total.',
    },
    {
      q: 'How fast will my staging subdomain activate?',
      a: 'Activation is automated and instantaneous upon checkout confirmation. Your Anycast DNS zone file is propagated globally within sub-3 minutes.',
    },
    {
      q: 'Can I configure custom DNS records (A, CNAME, TXT) on rented subdomains?',
      a: 'Yes! You have full access in your client dashboard to point A records to your Vercel, AWS, VPS, or DigitalOcean servers, add CNAME records, and verify domain ownership.',
    },
    {
      q: 'Is HTTPS / SSL included with staging subdomains?',
      a: 'Yes. Every rented staging subdomain automatically includes free 256-bit AutoSSL TLS encryption certificates with zero configuration required.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />

      {/* 1. Dark Navy Hero Banner with Compact Responsive Search */}
      <section className="bg-[#0B1528] text-white py-14 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A27]" />
            <span>100% Purchase Rebate on All Domain Registrations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Subdomain Staging &amp; Leases
          </h1>
          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Deploy high-reputation staging environments in seconds. 100% of your rental fees are credited toward your permanent domain purchase.
          </p>

          {/* Compact Responsive Subdomain Search Form */}
          <div className="max-w-3xl mx-auto pt-2">
            <form
              onSubmit={handleRentalSubmit}
              className="bg-white p-1.5 sm:p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full flex items-center">
                <input
                  type="text"
                  value={desiredSubdomain}
                  onChange={(e) => setDesiredSubdomain(e.target.value)}
                  placeholder="Enter staging name (e.g. client-beta)"
                  className="w-full h-10 sm:h-11 pl-4 pr-2 text-xs sm:text-sm text-[#111111] placeholder-gray-400 bg-transparent outline-none font-medium"
                  autoFocus
                />
                <span className="text-gray-300 font-bold px-1">.</span>
                <select
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                  className="h-9 px-2 text-xs font-bold text-[#0D3B85] bg-[#F5F7FA] rounded-lg outline-none border-0 cursor-pointer mr-1 shrink-0"
                >
                  <option value="oneall.app">oneall.app</option>
                  <option value="devpreview.io">devpreview.io</option>
                  <option value="staginghub.cm">staginghub.cm</option>
                  <option value="appbuild.co">appbuild.co</option>
                </select>
              </div>

              <button
                type="submit"
                className="h-10 sm:h-11 px-5 sm:px-6 bg-[#FF5A27] hover:bg-[#e04a1b] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto shrink-0"
              >
                <span>Lease for $0.25</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300 pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#00C288]" /> Sub-3min DNS Zone
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#00C288]" /> Free AutoSSL Included
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#00C288]" /> 100% Purchase Rebate
            </span>
          </div>
        </div>
      </section>

      {/* 2. 100% Rebate Workflow Diagram */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A27]">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Build on Staging. Convert with 100% Credit.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6E68]">
            Never pay twice for staging and production domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAFAF9] p-6 rounded-2xl border border-[#F0F0EE] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D3B85] flex items-center justify-center font-black text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-[#111111]">Lease Staging Subdomain</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Rent a clean subdomain like <code>client.oneall.app</code> for $0.25/day or $1.20/week. Instant Anycast DNS propagation.
            </p>
          </div>

          <div className="bg-[#FAFAF9] p-6 rounded-2xl border border-[#F0F0EE] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-[#111111]">Build, Demo &amp; Validate</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Show client previews, run automated CI/CD builds, and test integrations with free automated SSL certificates.
            </p>
          </div>

          <div className="bg-[#FAFAF9] p-6 rounded-2xl border border-[#F0F0EE] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008A5E] flex items-center justify-center font-black text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-[#111111]">Claim 100% Purchase Rebate</h3>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              When registering your official domain (.com, .cm, .store, .dev), 100% of your rental payment is credited as a discount!
            </p>
          </div>
        </div>
      </section>

      {/* 3. Staging Pricing Tiers */}
      <section className="py-16 px-4 sm:px-8 bg-[#FAFAF9] border-t border-b border-[#EBEBE7]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Flexible Staging Lease Tiers
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6E68]">
              Choose the exact duration you need with zero long-term commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-7 flex flex-col justify-between space-y-6 transition-all ${
                  tier.popular
                    ? 'border-2 border-[#0D3B85] shadow-lg relative'
                    : 'border border-[#F0F0EE] shadow-xs'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#0D3B85] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-xs">
                    Most Popular for Sprints
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-[#111111]">{tier.period}</h3>
                    <p className="text-xs text-[#6B6E68] mt-1">{tier.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl font-black text-[#111111] font-mono">{tier.price}</span>
                    <span className="text-xs text-[#6B6E68] font-medium">{tier.unit}</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-[#F0F0EE] text-xs text-[#555555]">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#008A5E] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/checkout?tier=${encodeURIComponent(tier.period)}&type=rental`}>
                  <button
                    className={`w-full h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      tier.popular
                        ? 'bg-[#0D3B85] hover:bg-[#1B6FC9] text-white shadow-xs'
                        : 'bg-[#F5F7FA] hover:bg-[#EAEFF8] text-[#0D3B85]'
                    }`}
                  >
                    Start {tier.period}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Available Parent Staging Zones */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Available High-Reputation Parent Zones
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6E68]">
            Instant automated DNS zone delegation across established high-trust domains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {AVAILABLE_ZONES.map((zone) => (
            <div
              key={zone.parent}
              className="bg-white p-5 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-sm text-[#0D3B85]">
                  .{zone.parent}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-[#555555]">
                  {zone.badge}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#111111]">{zone.category}</div>
              <div className="text-[11px] text-[#888888] font-mono truncate">{zone.sample}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQs Accordion */}
      <section className="py-16 px-4 sm:px-8 bg-[#FAFAF9] border-t border-[#EBEBE7]">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] text-center">
            Frequently asked questions about staging leases
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-2xs border border-[#F0F0EE]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#111111] hover:text-[#0D3B85] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-[#6B6E68] leading-relaxed border-t border-[#F0F0EE] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Live Chat Support Bar */}
      <div className="bg-[#EAEFF8] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#111111]">
          <span className="font-semibold">Have questions about staging subdomain leases? We&apos;re online 24/7.</span>
          <Link href="/dashboard/support">
            <button className="h-9 px-5 bg-[#2C6E63] hover:bg-[#205249] text-white font-bold text-xs rounded-xl cursor-pointer">
              Chat with a Live Person
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
