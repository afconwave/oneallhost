'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Card, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@oneallhost/ui';
import { Search, ShieldCheck, ArrowRight, Sparkles, Globe, Filter } from 'lucide-react';
import Link from 'next/link';

interface TldItem {
  tld: string;
  category: 'popular' | 'business' | 'tech' | 'regional' | 'ecommerce' | 'government';
  retailUsd: number;
  renewalUsd: number;
  privacy: boolean;
  featured?: boolean;
  badge?: string;
  desc: string;
}

const TLD_DATA: TldItem[] = [
  { tld: '.com', category: 'popular', retailUsd: 13.99, renewalUsd: 13.99, privacy: true, featured: true, badge: 'MOST POPULAR', desc: 'The gold standard domain extension for business worldwide' },
  { tld: '.cm', category: 'regional', retailUsd: 37.99, renewalUsd: 37.99, privacy: false, featured: true, badge: 'CAMEROON & CEMAC', desc: 'Official country-code top-level domain for Cameroon' },
  { tld: '.africa', category: 'regional', retailUsd: 19.99, renewalUsd: 19.99, privacy: true, featured: true, badge: 'PAN-AFRICA', desc: 'The unified digital identity for African innovators and enterprises' },
  { tld: '.ng', category: 'regional', retailUsd: 29.99, renewalUsd: 29.99, privacy: true, featured: true, badge: 'NIGERIA', desc: 'Official country-code domain for Nigeria' },
  { tld: '.com.ng', category: 'regional', retailUsd: 4.99, renewalUsd: 4.99, privacy: true, badge: 'NIGERIA COMMERCIAL', desc: 'Commercial domain for Nigerian businesses and startups' },
  { tld: '.gh', category: 'regional', retailUsd: 45.00, renewalUsd: 45.00, privacy: true, badge: 'GHANA', desc: 'Official country-code domain for Ghana' },
  { tld: '.ke', category: 'regional', retailUsd: 34.99, renewalUsd: 34.99, privacy: true, badge: 'KENYA', desc: 'Official country-code domain for Kenya' },
  { tld: '.co.ke', category: 'regional', retailUsd: 14.99, renewalUsd: 14.99, privacy: true, badge: 'KENYA COMMERCIAL', desc: 'Kenya premier commercial namespace' },
  { tld: '.rw', category: 'regional', retailUsd: 39.99, renewalUsd: 39.99, privacy: true, badge: 'RWANDA', desc: 'Official country-code domain for Rwanda' },
  { tld: '.za', category: 'regional', retailUsd: 19.99, renewalUsd: 19.99, privacy: true, badge: 'SOUTH AFRICA', desc: 'Official country-code domain for South Africa' },
  { tld: '.co.za', category: 'regional', retailUsd: 11.99, renewalUsd: 11.99, privacy: true, badge: 'SA COMMERCIAL', desc: 'The leading commercial domain for South African enterprises' },
  { tld: '.ci', category: 'regional', retailUsd: 49.99, renewalUsd: 49.99, privacy: true, badge: 'COTE D\'IVOIRE', desc: 'Official country-code domain for Côte d\'Ivoire' },
  { tld: '.sn', category: 'regional', retailUsd: 45.00, renewalUsd: 45.00, privacy: true, badge: 'SENEGAL', desc: 'Official country-code domain for Senegal' },
  { tld: '.tz', category: 'regional', retailUsd: 38.00, renewalUsd: 38.00, privacy: true, badge: 'TANZANIA', desc: 'Official country-code domain for Tanzania' },
  { tld: '.ug', category: 'regional', retailUsd: 35.00, renewalUsd: 35.00, privacy: true, badge: 'UGANDA', desc: 'Official country-code domain for Uganda' },
  { tld: '.gov.cm', category: 'government', retailUsd: 49.99, renewalUsd: 49.99, privacy: false, featured: true, badge: 'OFFICIAL GOV', desc: 'Official domain for Cameroon Government ministries, state agencies, and public institutions' },
  { tld: '.gov.ng', category: 'government', retailUsd: 49.99, renewalUsd: 49.99, privacy: false, badge: 'OFFICIAL GOV', desc: 'Official domain for Nigerian Government ministries, departments, and parastatals' },
  { tld: '.gov.gh', category: 'government', retailUsd: 55.00, renewalUsd: 55.00, privacy: false, badge: 'OFFICIAL GOV', desc: 'Official domain for Ghana Government ministries and statutory agencies' },
  { tld: '.gov.rw', category: 'government', retailUsd: 49.99, renewalUsd: 49.99, privacy: false, badge: 'OFFICIAL GOV', desc: 'Official domain for Government of Rwanda administrative entities' },
  { tld: '.gov.za', category: 'government', retailUsd: 45.00, renewalUsd: 45.00, privacy: false, badge: 'OFFICIAL GOV', desc: 'Official domain for South African National and Provincial Government' },
  { tld: '.gov.ke', category: 'government', retailUsd: 49.99, renewalUsd: 49.99, privacy: false, badge: 'OFFICIAL GOV', desc: 'Official domain for Kenyan Government ministries and state corporations' },
  { tld: '.edu.cm', category: 'government', retailUsd: 29.99, renewalUsd: 29.99, privacy: false, badge: 'ACADEMIC', desc: 'Accredited universities, polytechnics, and schools across Cameroon' },
  { tld: '.co.cm', category: 'regional', retailUsd: 24.99, renewalUsd: 24.99, privacy: false, badge: 'CAMEROON COMMERCIAL', desc: 'Cameroon commercial domain for local companies and SMEs' },
  { tld: '.org.cm', category: 'regional', retailUsd: 24.99, renewalUsd: 24.99, privacy: false, badge: 'CAMEROON NGO', desc: 'Non-profit organizations, associations, and charities in Cameroon' },
  { tld: '.store', category: 'ecommerce', retailUsd: 6.99, renewalUsd: 29.99, privacy: true, featured: true, badge: 'HOT DEAL', desc: 'Dedicated e-commerce namespace for retail and online shops' },
  { tld: '.net', category: 'popular', retailUsd: 15.99, renewalUsd: 15.99, privacy: true, desc: 'A true internet original for infrastructure and technology' },
  { tld: '.org', category: 'popular', retailUsd: 14.99, renewalUsd: 14.99, privacy: true, desc: 'The trusted standard for organizations, non-profits, and communities' },
  { tld: '.io', category: 'tech', retailUsd: 47.99, renewalUsd: 47.99, privacy: true, badge: 'DEV FAVORITE', desc: 'The preferred choice for software engineering and tech startups' },
  { tld: '.ai', category: 'tech', retailUsd: 89.99, renewalUsd: 89.99, privacy: true, badge: 'AI & ML', desc: 'The premier domain for artificial intelligence and machine learning' },
  { tld: '.tech', category: 'tech', retailUsd: 9.99, renewalUsd: 24.99, privacy: true, desc: 'Position your brand at the leading edge of modern tech innovation' },
  { tld: '.online', category: 'business', retailUsd: 5.99, renewalUsd: 21.99, privacy: true, desc: 'Universal, modern, and memorable extension for any digital project' },
  { tld: '.site', category: 'business', retailUsd: 4.99, renewalUsd: 19.99, privacy: true, desc: 'A flexible, affordable home for websites and digital portfolios' },
  { tld: '.space', category: 'business', retailUsd: 3.99, renewalUsd: 18.99, privacy: true, desc: 'Claim your creative space on the web' },
  { tld: '.xyz', category: 'popular', retailUsd: 12.99, renewalUsd: 12.99, privacy: true, desc: 'Bold, innovative namespace popular with next-generation builders' },
  { tld: '.cloud', category: 'tech', retailUsd: 14.99, renewalUsd: 22.99, privacy: true, desc: 'Built for cloud computing, SaaS platforms, and DevOps services' },
  { tld: '.app', category: 'tech', retailUsd: 16.99, renewalUsd: 16.99, privacy: true, desc: 'Enforced HTTPS security domain tailored for mobile and web applications' },
  { tld: '.dev', category: 'tech', retailUsd: 16.99, renewalUsd: 16.99, privacy: true, desc: 'Secure Google-backed domain for developers and software projects' },
  { tld: '.shop', category: 'ecommerce', retailUsd: 7.99, renewalUsd: 31.99, privacy: true, desc: 'Instantly recognizable namespace for e-commerce and retail stores' },
  { tld: '.agency', category: 'business', retailUsd: 22.99, renewalUsd: 22.99, privacy: true, desc: 'Dedicated branding for creative agencies and digital consultancies' },
  { tld: '.global', category: 'business', retailUsd: 24.99, renewalUsd: 24.99, privacy: true, desc: 'Project an international presence from day one' },
  { tld: '.co', category: 'popular', retailUsd: 27.99, renewalUsd: 27.99, privacy: true, desc: 'The agile alternative to .com for startups and modern companies' },
];

const CATEGORIES = [
  { id: 'all', label: 'All TLDs' },
  { id: 'popular', label: 'Popular' },
  { id: 'regional', label: 'Africa ccTLDs' },
  { id: 'government', label: 'Government & Institutional' },
  { id: 'tech', label: 'Tech & AI' },
  { id: 'ecommerce', label: 'eCommerce' },
  { id: 'business', label: 'Business' },
];

export default function FullTldListPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'XAF'>('USD');
  const xafRate = 615.5;

  const formatPrice = (usd: number) => {
    if (currency === 'USD') return `$${usd.toFixed(2)}`;
    return `${Math.round(usd * xafRate).toLocaleString()} XAF`;
  };

  const filteredTlds = useMemo(() => {
    return TLD_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.tld.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full space-y-10">
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EBEBE7] pb-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0D3B85] text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>Complete TLD Registry & Pricing Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
              Explore 400+ Top-Level Domains
            </h1>
            <p className="text-sm sm:text-base text-[#6B6E68] leading-relaxed">
              Find the perfect domain extension for your project. Transparent pricing, free lifetime WHOIS privacy, and automated sub-3-minute Anycast DNS.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 p-1 bg-[#FAFAF9] rounded-xl border border-[#EBEBE7] shrink-0 self-start md:self-end">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currency === 'USD' ? 'bg-white shadow-xs text-[#0D3B85] border border-[#DCDDD8]' : 'text-[#6B6E68] hover:text-[#111111]'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('XAF')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currency === 'XAF' ? 'bg-white shadow-xs text-[#0D3B85] border border-[#DCDDD8]' : 'text-[#6B6E68] hover:text-[#111111]'
              }`}
            >
              XAF (FCFA)
            </button>
          </div>
        </div>

        {/* Search and Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#0D3B85] text-white shadow-xs'
                    : 'bg-[#FAFAF9] text-[#6B6E68] hover:bg-[#F3F4F1] hover:text-[#111111] border border-[#EBEBE7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#6B6E68] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TLD (e.g. .com, tech)..."
              className="w-full h-10 pl-10 pr-4 text-xs font-semibold bg-[#FAFAF9] border border-[#DCDDD8] rounded-xl text-[#111111] placeholder:text-[#6B6E68] focus:outline-none focus:border-[#0D3B85] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* TLD List Table */}
        <div className="bg-white rounded-2xl border border-[#EBEBE7] shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAFAF9] border-b border-[#EBEBE7]">
                <TableHead className="text-xs font-bold text-[#111111] py-3.5">Extension</TableHead>
                <TableHead className="text-xs font-bold text-[#111111] py-3.5">Description</TableHead>
                <TableHead className="text-xs font-bold text-[#111111] py-3.5">1st Year Registration</TableHead>
                <TableHead className="text-xs font-bold text-[#111111] py-3.5">Annual Renewal</TableHead>
                <TableHead className="text-xs font-bold text-[#111111] py-3.5">WHOIS Privacy</TableHead>
                <TableHead className="text-xs font-bold text-[#111111] py-3.5 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTlds.length > 0 ? (
                filteredTlds.map((item) => (
                  <TableRow key={item.tld} className="border-b border-[#EBEBE7] hover:bg-[#F8FAFC] transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[#0D3B85]">{item.tld}</span>
                        {item.badge && (
                          <Badge variant={item.badge.includes('HOT') ? 'warning' : 'info'} className="text-[10px] font-bold">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-xs text-[#6B6E68] max-w-xs leading-relaxed">
                      {item.desc}
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="text-sm font-bold text-[#111111]">{formatPrice(item.retailUsd)}</span>
                      <span className="text-[10px] text-[#6B6E68] block">/ 1st year</span>
                    </TableCell>

                    <TableCell className="py-4">
                      <span className="text-xs font-medium text-[#6B6E68]">{formatPrice(item.renewalUsd)}</span>
                      <span className="text-[10px] text-[#6B6E68] block">/ year</span>
                    </TableCell>

                    <TableCell className="py-4">
                      {item.privacy ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#4E7525] font-semibold">
                          <ShieldCheck className="w-4 h-4 text-[#7CB342]" /> Included Free
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B6E68] font-medium">Registry Policy</span>
                      )}
                    </TableCell>

                    <TableCell className="py-4 text-right">
                      <Link href={`/domains/domain-name-search?tld=${item.tld.replace('.', '')}`}>
                        <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold rounded-xl h-8 px-3.5 bg-[#0D3B85] hover:bg-[#1B6FC9]">
                          <span>Register</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-[#6B6E68]">
                    No domain extensions found matching &quot;{searchQuery}&quot;. Try a different query or category filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Info Banner at Bottom */}
        <div className="p-6 rounded-2xl bg-[#F8FAF6] border border-[#D6E8C2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7CB342] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111]">Need temporary subdomains or staging URLs?</h4>
              <p className="text-xs text-[#4E7525]">
                Lease staging subdomains from $1.50/day with 100% purchase rebate towards full domain ownership.
              </p>
            </div>
          </div>
          <Link href="/domains/rentals">
            <Button variant="outline" size="sm" className="whitespace-nowrap font-bold text-xs rounded-xl border-[#7CB342] text-[#4E7525] hover:bg-[#7CB342] hover:text-white">
              Explore Staging Rentals
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
