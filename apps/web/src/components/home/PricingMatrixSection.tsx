'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@oneallhost/ui';
import { Check, Zap, ShieldCheck, Globe, Server, ArrowRight, Sparkles } from 'lucide-react';

export const PricingMatrixSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');

  return (
    <section id="pricing" className="py-16 bg-white border-t border-[#EBEBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Pick the plan that fits your growth
          </h2>
          <p className="text-sm text-[#6B6E68]">
            Transparent pricing with zero hidden renewal fees. All plans include 24/7 Anycast DNS and local MTN / Orange Money billing.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1 bg-[#FAFAF9] rounded-xl border border-[#EBEBE7] mt-4">
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white text-[#0D3B85] shadow-xs'
                  : 'text-[#6B6E68] hover:text-[#111111]'
              }`}
            >
              Annual Billing <span className="text-[#7CB342] ml-1 font-semibold">(Save 35%)</span>
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#0D3B85] shadow-xs'
                  : 'text-[#6B6E68] hover:text-[#111111]'
              }`}
            >
              Monthly / Flex
            </button>
          </div>
        </div>

        {/* 3 Tall, Full-Featured Pricing Cards (Hostinger Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Card 1: Subdomain Lease (Staging / Short-Term) */}
          <div className="p-8 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs flex flex-col justify-between hover:border-[#DCDDD8] transition-all">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#111111] font-display">Subdomain Staging Lease</h3>
                <p className="text-xs text-[#6B6E68] mt-1">
                  Ideal for staging environments, university hackathons, and short-term event landing pages.
                </p>
              </div>

              <div className="pt-2 border-t border-[#EBEBE7]">
                <div className="text-xs text-[#6B6E68] line-through">$3.99</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-4xl font-extrabold text-[#111111] font-display">
                    {billingCycle === 'annual' ? '$1.99' : '$0.99'}
                  </span>
                  <span className="text-xs text-[#6B6E68] font-medium">/ 24h lease</span>
                </div>
                <div className="text-[11px] text-[#6B6E68] mt-1">
                  ~1,225 XAF via MTN MoMo / Orange Money
                </div>
              </div>

              <Link href="/dashboard/rentals" className="block pt-2">
                <Button variant="outline" size="lg" className="w-full h-12 rounded-xl text-xs font-bold text-[#0D3B85] border-[#DCDDD8] hover:bg-blue-50">
                  <span>Explore Subdomain Leases</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>

              {/* Comprehensive Feature List */}
              <div className="pt-4 border-t border-[#EBEBE7] space-y-3 text-xs text-[#111111]">
                <div className="font-bold text-[#111111] uppercase tracking-wider text-[11px]">Key Highlights</div>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span><strong>100% Purchase Rebate</strong> credited on domain buy</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Instant Anycast DNS resolution (Sub-3-minute)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Free 256-Bit SSL Certificate pre-provisioned</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Zero long-term renewal contracts or penalties</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>CNAME, A, and custom proxy routing support</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Custom lease duration (24 hours to 30 days)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Instant automatic DNS decommissioning on expiry</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Domain Pro Package (Center ELEVATED Dark Blue Card - Hostinger Best Value) */}
          <div className="p-8 rounded-2xl bg-[#091F44] text-white shadow-2xl flex flex-col justify-between relative border border-white/10 lg:-translate-y-3">
            {/* Top Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#7CB342] text-white text-[11px] font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1.5">
              <i className="fa-solid fa-star text-[10px]" />
              <span>Most Popular</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white font-display">Permanent Domain Pro</h3>
                <p className="text-xs text-blue-100/80 mt-1">
                  Full ICANN ownership across 400+ extensions (.com, .cm, .org, .net, .africa).
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-blue-300 line-through">$18.99</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-4xl font-extrabold text-white font-display">
                    {billingCycle === 'annual' ? '$13.99' : '$15.99'}
                  </span>
                  <span className="text-xs text-blue-200 font-medium">/ year</span>
                </div>
                <div className="text-[11px] text-blue-200 mt-1">
                  ~8,611 XAF via MTN MoMo / Orange Money
                </div>
              </div>

              <Link href="/#domains" className="block pt-2">
                <Button variant="primary" size="lg" className="w-full h-12 rounded-xl text-xs font-bold bg-[#1B6FC9] hover:bg-blue-600 shadow-md">
                  <span>Register Domain Now</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>

              {/* Comprehensive Feature List */}
              <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-blue-50">
                <div className="font-bold text-[#7CB342] uppercase tracking-wider text-[11px]">Everything in Staging, plus:</div>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span><strong>Free Lifetime WHOIS Privacy Guard</strong> (Save $9.99/yr)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Full Anycast DNS Zone file management (A, CNAME, MX, TXT)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>60-Day Mandatory ICANN Transfer Lock Protection</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>1-Click ICANN EPP Authorization code generator</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Custom Nameserver delegation (Cloudflare, AWS, Route53)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Automated Mobile Money renewal reminders via SMS & Email</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Official sequential Tax PDF invoices (ONH-YYYY-XXXXXX)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3: Cloud Infrastructure Layer */}
          <div className="p-8 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs flex flex-col justify-between hover:border-[#DCDDD8] transition-all">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#111111] font-display">Managed Cloud Hosting</h3>
                <p className="text-xs text-[#6B6E68] mt-1">
                  High-speed NVMe hosting with Central & West Africa low-latency edge caching.
                </p>
              </div>

              <div className="pt-2 border-t border-[#EBEBE7]">
                <div className="text-xs text-[#6B6E68] line-through">$34.99</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-4xl font-extrabold text-[#111111] font-display">
                    {billingCycle === 'annual' ? '$24.99' : '$29.99'}
                  </span>
                  <span className="text-xs text-[#6B6E68] font-medium">/ month</span>
                </div>
                <div className="text-[11px] text-[#6B6E68] mt-1">
                  ~15,375 XAF via MTN MoMo / Orange Money
                </div>
              </div>

              <Link href="/hosting-waitlist" className="block pt-2">
                <Button variant="outline" size="lg" className="w-full h-12 rounded-xl text-xs font-bold text-[#0D3B85] border-[#DCDDD8] hover:bg-blue-50">
                  <span>Join Early Access Waitlist</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>

              {/* Comprehensive Feature List */}
              <div className="pt-4 border-t border-[#EBEBE7] space-y-3 text-xs text-[#111111]">
                <div className="font-bold text-[#111111] uppercase tracking-wider text-[11px]">Cloud Stack Features</div>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span><strong>50 GB NVMe SSD Storage</strong> with automated daily backups</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Central & West Africa Edge Caching (12ms latency)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Node.js, Python, PHP 8.3 & Docker container support</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Unmetered bandwidth with DDoS edge protection</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>Free staging environment with 1-click Git push-to-deploy</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />
                    <span>24/7 Dedicated technical engineering SLA support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
