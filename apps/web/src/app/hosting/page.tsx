'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '@oneallhost/ui';
import { Check, Search, Server, Shield, Zap, Headphones, ArrowRight, Layers, Layout, HardDrive, Cpu } from 'lucide-react';

const HOSTING_PLANS = [
  {
    name: 'Staging Cloud',
    desc: 'Perfect for developer MVPs, staging environments, and simple web applications.',
    priceAnnual: '$1.99',
    priceMonthly: '$2.99',
    unit: '/ mo',
    save: 'Save 35%',
    popular: false,
    features: [
      '1 Website / Staging App',
      '10 GB NVMe SSD Storage',
      'Unmetered Bandwidth',
      'Free Automatic SSL Certificate',
      'Sub-3-min Anycast DNS Propagation',
      '100% Rebate on Domain Purchase',
    ],
  },
  {
    name: 'Pro WordPress Cloud',
    desc: 'High-performance cloud hosting optimized for WordPress & business sites.',
    priceAnnual: '$4.99',
    priceMonthly: '$6.99',
    unit: '/ mo',
    save: 'Save 45%',
    popular: true,
    features: [
      '3 Websites Included',
      '50 GB High-Speed NVMe Storage',
      'Unmetered Bandwidth',
      'African Edge Caching Node (12ms)',
      'Free Automated Daily Backups',
      '1-Click Staging & Git Push-to-Deploy',
      'Dedicated 24/7 SLA Engineer Support',
    ],
  },
  {
    name: 'Enterprise NVMe Cloud',
    desc: 'Maximum computational speed, dedicated RAM, and isolated container resources.',
    priceAnnual: '$12.99',
    priceMonthly: '$15.99',
    unit: '/ mo',
    save: 'Save 30%',
    popular: false,
    features: [
      'Unlimited Websites',
      '150 GB Ultra NVMe Storage',
      'Dedicated Isolated CPU & RAM',
      'Docker, Node.js, Python, PHP 8.3',
      'Proactive AI Anti-DDoS Defense',
      'Priority 24/7 Technical SLA',
    ],
  },
];

const MATRIX_FEATURES = [
  { feature: 'Websites Hosted', staging: '1 App', pro: '3 Websites', enterprise: 'Unlimited' },
  { feature: 'NVMe SSD Disk Space', staging: '10 GB NVMe', pro: '50 GB NVMe', enterprise: '150 GB NVMe' },
  { feature: 'Monthly Bandwidth', staging: 'Unmetered', pro: 'Unmetered', enterprise: 'Unmetered' },
  { feature: 'Edge Caching Speed', staging: 'Global CDN', pro: '12ms African Node', proHighlight: true, enterprise: 'Dedicated Mesh' },
  { feature: 'SSL Certificate', staging: 'Free Auto SSL', pro: 'Free Wildcard SSL', enterprise: 'Free Wildcard SSL' },
  { feature: 'Automated Daily Backups', staging: 'Weekly', pro: 'Daily Automated', enterprise: 'Real-time Continuous' },
  { feature: 'Runtime Environment', staging: 'Node.js / PHP', pro: 'PHP 8.3 & WP Turbo', enterprise: 'Docker / Python / Node / PHP' },
  { feature: 'SLA Support Level', staging: 'Standard 24/7', pro: 'Priority Live Chat', enterprise: 'Dedicated Engineer SLA' },
];

const HOSTING_FAQS = [
  {
    q: 'What is Managed NVMe Cloud Hosting?',
    a: 'Managed NVMe Cloud Hosting leverages high-speed solid-state drives with African edge nodes to deliver up to 10x faster page loading speeds than traditional hard drives.',
  },
  {
    q: 'Can I host my WordPress site on Oneallhost?',
    a: 'Yes! Our Pro WordPress Cloud plans include 1-click WordPress installation, automatic core updates, and built-in edge caching for instant rendering.',
  },
  {
    q: 'How does local Mobile Money billing work for hosting?',
    a: 'You can pay for annual or monthly hosting plans directly using MTN MoMo, Orange Money, or Express Union with instant automated account provisioning.',
  },
  {
    q: 'Is migration to Oneallhost free?',
    a: 'Yes. Our technical engineering team provides free white-glove site migration with zero downtime.',
  },
];

export default function HostingPage() {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [activeTab, setActiveTab] = useState<'shared' | 'wp' | 'vps' | 'dedicated'>('shared');
  const [domainQuery, setDomainQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (domainQuery) {
      window.location.href = `/checkout?domain=${encodeURIComponent(domainQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section matching Namecheap Hosting Screenshot */}
        <section className="bg-[#091F44] text-white py-20 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-6xl font-extrabold font-display leading-tight text-white">
                Reliable web hosting starts here
              </h1>
              <p className="text-base text-blue-100/90 leading-relaxed max-w-lg">
                Fast NVMe cloud hosting with low-latency edge nodes, 99.99% uptime SLA, and local Mobile Money payment support.
              </p>

              <ul className="space-y-2.5 text-xs text-blue-100 font-semibold">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7CB342]" />
                  <span>Free domain registration included with annual plans</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7CB342]" />
                  <span>Sub-3-minute Anycast DNS &amp; free WHOIS Privacy</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7CB342]" />
                  <span>24/7 dedicated engineering support</span>
                </li>
              </ul>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a href="#plans">
                  <Button variant="primary" className="h-12 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md">
                    Get Started
                  </Button>
                </a>
                <a href="#matrix">
                  <Button variant="outline" className="h-12 px-6 border-white/30 text-white hover:bg-white/10 font-bold text-xs rounded-xl">
                    Compare All Plans
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Side Illustration */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="/images/namecheap/hosting-illustration.svg"
                alt="Cloud Hosting Servers"
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* 2. Featured Hosting Plans (Full-Bleed Flat Section) */}
        <section id="plans" className="py-24 bg-[#F6F7F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#111111]">
                Featured Hosting Plans
              </h2>

              {/* Billing Switcher */}
              <div className="inline-flex items-center p-1.5 bg-white rounded-xl shadow-xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    billingCycle === 'annual'
                      ? 'bg-[#0D3B85] text-white shadow-xs'
                      : 'text-[#6B6E68] hover:text-[#111111]'
                  }`}
                >
                  Annual Billing <span className="text-[#7CB342] ml-1 font-bold">(Save up to 45%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-[#0D3B85] text-white shadow-xs'
                      : 'text-[#6B6E68] hover:text-[#111111]'
                  }`}
                >
                  Monthly Flex
                </button>
              </div>
            </div>

            {/* 3 Flat Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {HOSTING_PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-8 rounded-2xl bg-white space-y-6 flex flex-col justify-between relative transition-all ${
                    plan.popular ? 'ring-2 ring-[#0D3B85] shadow-lg' : 'shadow-sm'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0D3B85] text-white text-[11px] font-extrabold uppercase tracking-wide">
                      Most Popular Plan
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#111111] font-display">{plan.name}</h3>
                      <p className="text-xs text-[#6B6E68] mt-1.5 leading-relaxed">{plan.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-[#EBEBE7]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold font-mono text-[#111111]">
                          {billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                        </span>
                        <span className="text-xs text-[#6B6E68] font-medium">{plan.unit}</span>
                        <span className="ml-auto text-xs font-bold text-[#7CB342] bg-[#7CB342]/10 px-2 py-0.5 rounded">
                          {plan.save}
                        </span>
                      </div>
                    </div>

                    <Link href={`/checkout?plan=${encodeURIComponent(plan.name)}`}>
                      <Button
                        variant="primary"
                        className={`w-full h-12 rounded-xl text-xs font-bold ${
                          plan.popular
                            ? 'bg-[#D32F2F] hover:bg-red-700 text-white'
                            : 'bg-[#0D3B85] hover:bg-[#1B6FC9] text-white'
                        }`}
                      >
                        Get Started
                      </Button>
                    </Link>

                    {/* Features List */}
                    <div className="pt-4 border-t border-[#EBEBE7] space-y-3 text-xs text-[#111111]">
                      <ul className="space-y-2.5">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Find Your Domain Search Strip */}
        <section className="py-12 bg-white border-y border-[#EBEBE7]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <form onSubmit={handleDomainSearch} className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-[#F6F7F5] rounded-2xl">
              <div className="flex items-center gap-3 px-4 w-full text-[#111111]">
                <Search className="w-5 h-5 text-[#6B6E68] shrink-0" />
                <input
                  type="text"
                  value={domainQuery}
                  onChange={(e) => setDomainQuery(e.target.value)}
                  placeholder="Find your domain name to pair with hosting..."
                  className="w-full h-12 bg-transparent text-sm font-semibold placeholder:text-[#6B6E68] outline-none"
                />
              </div>
              <Button type="submit" variant="primary" className="h-12 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs rounded-xl w-full sm:w-auto shrink-0">
                Search Domain
              </Button>
            </form>
          </div>
        </section>

        {/* 4. Tabbed Section: "Every way to build a web hosting site" */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <h2 className="text-3xl font-extrabold font-display text-[#111111] text-center">
              Every Way to Build Your Website or App
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#EBEBE7] pb-4">
              <button
                type="button"
                onClick={() => setActiveTab('shared')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'shared'
                    ? 'bg-[#0D3B85] text-white'
                    : 'text-[#6B6E68] hover:text-[#111111] hover:bg-gray-100'
                }`}
              >
                Shared NVMe Hosting
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('wp')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'wp'
                    ? 'bg-[#0D3B85] text-white'
                    : 'text-[#6B6E68] hover:text-[#111111] hover:bg-gray-100'
                }`}
              >
                WordPress Cloud
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vps')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'vps'
                    ? 'bg-[#0D3B85] text-white'
                    : 'text-[#6B6E68] hover:text-[#111111] hover:bg-gray-100'
                }`}
              >
                VPS Staging &amp; Leases
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-[#F6F7F5] flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
              <div className="space-y-3 max-w-lg">
                <h3 className="text-2xl font-bold font-display text-[#111111]">
                  {activeTab === 'shared' && 'A Great Starting Point for New Websites'}
                  {activeTab === 'wp' && 'Optimized Turbo Engine for WordPress'}
                  {activeTab === 'vps' && 'Isolated Container & Developer Subdomain Leases'}
                </h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  {activeTab === 'shared' && 'Get reliable NVMe speed, unmetered bandwidth, free SSL certificates, and 24/7 technical support included with every account.'}
                  {activeTab === 'wp' && 'Experience 1-click WP setup, automated core updates, and built-in edge caching for lightning fast rendering.'}
                  {activeTab === 'vps' && 'Lease staging subdomains for hackathons or developer MVPs with 100% of rental payments credited back.'}
                </p>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                <div className="text-3xl font-extrabold text-[#0D3B85] font-mono">$1.99 / mo</div>
                <Link href="/checkout?plan=Shared">
                  <Button variant="primary" className="h-11 px-8 bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs rounded-xl">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Why Choose Oneallhost Hosting 4-Card Grid */}
        <section className="py-24 bg-[#F6F7F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <h2 className="text-3xl font-extrabold font-display text-[#111111] text-center">
              Why Choose Oneallhost Hosting?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-8 rounded-2xl bg-white space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#7CB342]" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">99.99% Guaranteed Uptime</h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  Redundant cloud architecture ensures your web apps remain online around the clock.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
                  <Server className="w-6 h-6 text-[#7CB342]" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">NVMe SSD Speed</h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  Blazing-fast disk performance combined with African edge nodes for 12ms ultra-low latency.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#7CB342]" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">Proactive DDoS Defense</h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  Automated web application firewall (WAF) filtering malicious traffic before it reaches your app.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-[#7CB342]" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">24/7 SLA Technical Support</h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">
                  Direct access to expert cloud engineers via live chat, ticket, and phone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Detailed Hosting Features Matrix Table */}
        <section id="matrix" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <h2 className="text-3xl font-extrabold font-display text-[#111111] text-center">
              Detailed Plan Comparison Matrix
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-[#EBEBE7]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F6F7F5] text-[#111111] font-bold uppercase tracking-wider text-[11px] border-b border-[#EBEBE7]">
                  <tr>
                    <th className="py-4 px-6">Feature Specifications</th>
                    <th className="py-4 px-6">Staging Cloud</th>
                    <th className="py-4 px-6 bg-blue-50/70 text-[#0D3B85]">Pro WordPress Cloud</th>
                    <th className="py-4 px-6">Enterprise NVMe Cloud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE7]">
                  {MATRIX_FEATURES.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#111111]">{row.feature}</td>
                      <td className="py-4 px-6 text-[#6B6E68]">{row.staging}</td>
                      <td className="py-4 px-6 font-bold text-[#0D3B85] bg-blue-50/30">{row.pro}</td>
                      <td className="py-4 px-6 text-[#111111] font-semibold">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 7. Hosting FAQs */}
        <section className="py-24 bg-[#F6F7F5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
            <h2 className="text-3xl font-extrabold font-display text-[#111111] text-center">
              Hosting Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {HOSTING_FAQS.map((faq, idx) => (
                <div key={idx} className="rounded-2xl bg-white p-6 space-y-2 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-base text-[#111111]"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#0D3B85] text-xl font-mono">{activeFaq === idx ? '−' : '+'}</span>
                  </button>
                  {activeFaq === idx && (
                    <p className="text-xs text-[#6B6E68] leading-relaxed pt-2 border-t border-[#EBEBE7]">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
