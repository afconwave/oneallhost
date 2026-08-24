'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@oneallhost/ui';
import { Check } from 'lucide-react';

export const ConfidenceComparisonSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-[#EBEBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Build your business with confidence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#FAFAF9] border border-[#EBEBE7] space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Scalable Domain Authority</h3>
              <p className="text-xs text-[#6B6E68]">Complete ICANN ownership, EPP Auth-Codes, and Anycast DNS control.</p>
            </div>

            <ul className="space-y-2.5 text-xs text-[#111111]">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7CB342]" /> Free WHOIS Privacy Guard</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7CB342]" /> 60-Day Transfer Lock Protection</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7CB342]" /> Custom Nameservers Delegation</li>
            </ul>

            <Link href="/#domains">
              <Button variant="outline" size="sm" className="w-full">
                Register domain
              </Button>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#F8FAF6] border border-[#D6E8C2] space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#111111]">Subdomain Staging with 100% Rebate</h3>
              <p className="text-xs text-[#6B6E68]">Deploy staging links for events, MVPs, and hackathons with zero risk.</p>
            </div>

            <ul className="space-y-2.5 text-xs text-[#111111]">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7CB342]" /> 24 Hours ($1.99) & 7 Days ($7.99)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#7CB342]" /> Instant CNAME & A record forwarding</li>
              <li className="flex items-center gap-2 font-bold text-[#0D3B85]"><Check className="w-4 h-4 text-[#7CB342]" /> 100% Purchase conversion rebate</li>
            </ul>

            <Link href="/dashboard/rentals">
              <Button variant="primary" size="sm" className="w-full bg-[#4E7525] hover:bg-[#7CB342]">
                Start a lease
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
