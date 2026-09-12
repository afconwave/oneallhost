'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../../../components/Header';
import { Footer } from '../../../../components/Footer';
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { RefreshCw, Search, ExternalLink, HelpCircle, MessageSquare } from 'lucide-react';

const EXCHANGE_RATES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.000, region: 'Global Base' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', rate: 615.500, region: 'Cameroon, Gabon, CEMAC' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', rate: 615.500, region: 'Ivory Coast, Senegal, Benin, UEMOA' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1600.000, region: 'Nigeria' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rate: 15.500, region: 'Ghana' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 129.000, region: 'Kenya' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', rate: 1350.000, region: 'Rwanda' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', rate: 2800.000, region: 'DR Congo' },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.863, region: 'European Union' },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£', rate: 0.740, region: 'United Kingdom' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.386, region: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.394, region: 'Australia' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.708, region: 'China' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 95.555, region: 'India' },
];

export default function CurrencyExchangeRatesPage() {
  const [search, setSearch] = useState('');
  const [calculatorAmount, setCalculatorAmount] = useState<number>(13.99);

  const filteredRates = EXCHANGE_RATES.filter(
    (r) =>
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#6B6E68]">
          <Link href="/help-center" className="hover:text-[#0D3B85]">Support</Link>
          <span>/</span>
          <Link href="/help-center" className="hover:text-[#0D3B85]">Payment Options</Link>
          <span>/</span>
          <span className="font-bold text-[#111111]">Currency Exchange Rates</span>
        </nav>

        {/* Page Title & Notice */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Currency Exchange Rates
          </h1>
          <div className="p-4 rounded-xl bg-[#FFF9F2] border border-[#FFE2C2] text-xs text-[#8A4B08] space-y-2 leading-relaxed">
            <div className="font-bold text-[#A75D00] text-sm">
              Final charges will be made in USD (or native Mobile Money equivalent where selected).
            </div>
            <p>
              Currency conversion is for information purposes only and accuracy is not guaranteed. Overseas customers are encouraged to contact their bank or credit card provider for details on any additional fees these institutions may include for currency conversion.
            </p>
          </div>
        </div>

        {/* Meta Specs Grid */}
        <Card elevation="surface-1" className="p-6 bg-[#FAFAF9] border-[#EBEBE7] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-[11px] text-[#6B6E68] uppercase font-bold tracking-wider">Exchange Data As Of</div>
            <div className="font-bold text-[#111111] mt-1">9/12/2026 12:00:01 AM</div>
          </div>
          <div>
            <div className="text-[11px] text-[#6B6E68] uppercase font-bold tracking-wider">Base Currency</div>
            <div className="font-bold text-[#0D3B85] mt-1">USD ($1.00)</div>
          </div>
          <div>
            <div className="text-[11px] text-[#6B6E68] uppercase font-bold tracking-wider">Data Provider</div>
            <div className="font-bold text-[#111111] mt-1">European Central Bank &amp; BEAC</div>
          </div>
          <div>
            <div className="text-[11px] text-[#6B6E68] uppercase font-bold tracking-wider">Provider Source</div>
            <a
              href="https://www.ecb.europa.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#0D3B85] hover:underline flex items-center gap-1 mt-1"
            >
              <span>ecb.europa.eu</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>

        {/* Live Converter Widget */}
        <div className="p-6 rounded-2xl bg-[#091F44] text-white space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Live Currency Rate Calculator</h3>
              <p className="text-xs text-blue-200">Convert USD domain or hosting prices into any supported currency</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-xs">
              <span className="text-blue-200 font-medium">USD Amount: $</span>
              <input
                type="number"
                value={calculatorAmount}
                onChange={(e) => setCalculatorAmount(parseFloat(e.target.value) || 0)}
                className="w-20 bg-white text-[#111111] font-bold px-2 py-0.5 rounded text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Rates Table Filter */}
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-[#111111]">
            Active Exchange Rates vs 1.00 USD
          </h3>
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-[#6B6E68] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter currency (e.g. XAF, EUR)..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#FAFAF9] border border-[#DCDDD8] rounded-xl text-[#111111] focus:outline-none focus:border-[#0D3B85] focus:bg-white"
            />
          </div>
        </div>

        {/* Exchange Rates Table */}
        <div className="bg-white rounded-2xl border border-[#EBEBE7] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAFAF9]">
                <TableHead className="text-xs font-bold text-[#111111]">Currency</TableHead>
                <TableHead className="text-xs font-bold text-[#111111]">Country / Region</TableHead>
                <TableHead className="text-xs font-bold text-[#111111]">1 USD Rate</TableHead>
                <TableHead className="text-xs font-bold text-[#111111]">Calculated Amount (${calculatorAmount.toFixed(2)})</TableHead>
                <TableHead className="text-xs font-bold text-[#111111] text-right">Payment Rails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRates.map((curr) => {
                const calculated = Math.round(calculatorAmount * curr.rate);
                return (
                  <TableRow key={curr.code} className="hover:bg-[#F8FAFC]">
                    <TableCell className="font-bold text-sm text-[#0D3B85]">
                      <div className="flex items-center gap-2">
                        <span>{curr.code}</span>
                        <span className="text-xs text-[#6B6E68] font-medium">({curr.name})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-[#6B6E68]">{curr.region}</TableCell>
                    <TableCell className="font-mono text-xs font-bold text-[#111111]">
                      1 USD = {curr.rate.toFixed(3)} {curr.code}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-extrabold text-emerald-800">
                      {calculated.toLocaleString()} {curr.code}
                    </TableCell>
                    <TableCell className="text-right">
                      {curr.code === 'XAF' || curr.code === 'XOF' ? (
                        <Badge variant="success">Mobile Money &amp; Card</Badge>
                      ) : curr.code === 'NGN' || curr.code === 'GHS' || curr.code === 'KES' ? (
                        <Badge variant="info">Local Mobile &amp; Bank</Badge>
                      ) : (
                        <Badge variant="neutral">Global Card &amp; Crypto</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Support & Live Help Strip */}
        <div className="p-6 rounded-2xl bg-[#EAEFF8] flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#CCE2FA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D3B85] text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111]">Have questions regarding billing or exchange rates?</h4>
              <p className="text-xs text-[#6B6E68]">Our billing support team is available 24/7 to assist you.</p>
            </div>
          </div>
          <Link href="/dashboard/support">
            <Button variant="primary" size="md" className="bg-[#2C6E63] hover:bg-[#205249] text-white font-bold text-xs rounded-xl gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat with a Live Person</span>
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
