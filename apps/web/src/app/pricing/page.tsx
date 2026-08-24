'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { ShieldCheck, Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [currency, setCurrency] = useState<'USD' | 'XAF'>('USD');
  const xafRate = 615.5;

  const tlds = [
    { tld: '.com', wholesale: 9.85, retailUsd: 13.99, privacy: true, highlight: true },
    { tld: '.cm', wholesale: 28.00, retailUsd: 37.99, privacy: false, note: 'Cameroon ccTLD' },
    { tld: '.africa', wholesale: 14.50, retailUsd: 19.99, privacy: true, highlight: true },
    { tld: '.net', wholesale: 11.20, retailUsd: 15.99, privacy: true },
    { tld: '.org', wholesale: 10.50, retailUsd: 14.99, privacy: true },
    { tld: '.io', wholesale: 36.00, retailUsd: 47.99, privacy: true },
    { tld: '.ai', wholesale: 68.00, retailUsd: 89.99, privacy: true },
    { tld: '.tech', wholesale: 6.90, retailUsd: 9.99, privacy: true },
    { tld: '.store', wholesale: 4.80, retailUsd: 6.99, privacy: true },
    { tld: '.online', wholesale: 3.99, retailUsd: 5.99, privacy: true },
  ];

  const formatPrice = (usd: number) => {
    if (currency === 'USD') return `$${usd.toFixed(2)}`;
    return `${Math.round(usd * xafRate).toLocaleString()} XAF`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-8">
          <div>
            <Badge variant="info">Transparent Wholesale-to-Retail</Badge>
            <h1 className="mt-2 text-2xl sm:text-3xl font-medium text-[#111111]">
              Domain, Rental & Hosting Rates
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#6B6E68]">
              No hidden renewal surcharges. ICANN compliance, automated DNS management, and free WHOIS privacy.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAFAF9] p-1 rounded border border-[#EBEBE7]">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                currency === 'USD' ? 'bg-white border border-[#DCDDD8] text-[#111111]' : 'text-[#6B6E68]'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('XAF')}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                currency === 'XAF' ? 'bg-white border border-[#DCDDD8] text-[#111111]' : 'text-[#6B6E68]'
              }`}
            >
              XAF (FCFA)
            </button>
          </div>
        </div>

        {/* TLD RATES TABLE */}
        <div className="mt-10">
          <h2 className="text-sm font-medium text-[#111111] mb-4">Domain Registration & Renewal Rates</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Extension</TableHead>
                <TableHead>Registration / Year</TableHead>
                <TableHead>Renewal / Year</TableHead>
                <TableHead>WHOIS Privacy</TableHead>
                <TableHead>Transfer Lock</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tlds.map((item) => (
                <TableRow key={item.tld}>
                  <TableCell className="font-mono font-medium text-sm text-[#111111]">
                    <div className="flex items-center gap-2">
                      <span>{item.tld}</span>
                      {item.highlight && <Badge variant="info">Popular</Badge>}
                      {item.note && <span className="text-[11px] text-[#6B6E68]">({item.note})</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{formatPrice(item.retailUsd)}</TableCell>
                  <TableCell className="font-mono text-[#6B6E68]">{formatPrice(item.retailUsd)}</TableCell>
                  <TableCell>
                    {item.privacy ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#4E7525]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Included Free
                      </span>
                    ) : (
                      <span className="text-xs text-[#6B6E68]">Registry Restricted</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-[#111111]">60-Day ICANN Lock</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/#domains`}>
                      <Button variant="outline" size="sm">Search</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* RENTAL PRICING TIERS */}
        <div className="mt-16">
          <h2 className="text-sm font-medium text-[#111111] mb-4">Domain & Subdomain Rental Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card elevation="surface-1" className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#0D3B85]">DAILY TIER</span>
                <h3 className="mt-2 text-lg font-medium text-[#111111]">Day Pass Lease</h3>
                <p className="text-xs text-[#6B6E68] mt-1">Ideal for flash events, 24h webinars, and quick proof-of-concepts.</p>
                <div className="mt-4 font-mono text-xl font-medium text-[#111111]">
                  {formatPrice(1.50)} <span className="text-xs font-normal text-[#6B6E68]">/ day</span>
                </div>
                <ul className="mt-6 space-y-2 text-xs text-[#6B6E68]">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> Instant automated DNS routing</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> Free SSL Certificate</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> 100% Purchase conversion credit</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EBEBE7]">
                <Link href="/dashboard/rentals">
                  <Button variant="outline" size="sm" className="w-full">Rent for a day</Button>
                </Link>
              </div>
            </Card>

            <Card elevation="surface-1" featured className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#1B6FC9]">WEEKLY TIER</span>
                  <Badge variant="info">Most Popular</Badge>
                </div>
                <h3 className="mt-2 text-lg font-medium text-[#111111]">7-Day Campaign</h3>
                <p className="text-xs text-[#6B6E68] mt-1">Perfect for product launches, ad campaigns, and seasonal sales.</p>
                <div className="mt-4 font-mono text-xl font-medium text-[#111111]">
                  {formatPrice(7.99)} <span className="text-xs font-normal text-[#6B6E68]">/ week</span>
                </div>
                <ul className="mt-6 space-y-2 text-xs text-[#6B6E68]">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> Includes custom TXT/CNAME records</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> Traffic forwarding analytics</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> 100% Purchase conversion credit</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EBEBE7]">
                <Link href="/dashboard/rentals">
                  <Button variant="primary" size="sm" className="w-full">Rent for 7 days</Button>
                </Link>
              </div>
            </Card>

            <Card elevation="surface-1" className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#0D3B85]">MONTHLY TIER</span>
                <h3 className="mt-2 text-lg font-medium text-[#111111]">30-Day Project</h3>
                <p className="text-xs text-[#6B6E68] mt-1">For multi-week initiatives, quarterly reports, and pilot MVPs.</p>
                <div className="mt-4 font-mono text-xl font-medium text-[#111111]">
                  {formatPrice(24.99)} <span className="text-xs font-normal text-[#6B6E68]">/ month</span>
                </div>
                <ul className="mt-6 space-y-2 text-xs text-[#6B6E68]">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> Full DNS zone authority</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> Priority ticket support</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7CB342]" /> 100% Purchase conversion credit</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EBEBE7]">
                <Link href="/dashboard/rentals">
                  <Button variant="outline" size="sm" className="w-full">Rent for a month</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
