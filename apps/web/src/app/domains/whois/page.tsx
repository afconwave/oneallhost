'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Card, Button, Input, Badge } from '@oneallhost/ui';
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Globe,
  Server,
  Lock,
  Clock,
  ArrowRight,
  Copy,
  ExternalLink,
  RefreshCw,
  Info,
  Check,
  Layers,
  Activity,
  Calendar,
} from 'lucide-react';

interface WhoisData {
  success: boolean;
  domain: string;
  isRegistered: boolean;
  status: string;
  registrar: string;
  nameservers: string[];
  ipAddresses: string[];
  dns: {
    a: string[];
    aaaa: string[];
    ns: string[];
    mx: Array<{ exchange: string; priority: number }>;
    txt: string[][];
    soa: any;
  };
  website: {
    isOnline: boolean;
    httpStatus: number | null;
    responseTimeMs: number;
    httpsEnabled: boolean;
    server: string;
  };
  whois: {
    privacy: boolean;
    registrantOrganization: string;
    registrantCountry: string;
    creationDate: string;
    expiryDate: string;
    updatedDate: string;
  };
}

function WhoisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDomain = searchParams?.get('domain') || '';

  const [inputDomain, setInputDomain] = useState(initialDomain || '');
  const [currentDomain, setCurrentDomain] = useState(initialDomain || 'google.com');
  const [data, setData] = useState<WhoisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'whois' | 'dns' | 'diagnostics'>('whois');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchWhois = async (domainToQuery: string) => {
    const cleanDomain = domainToQuery
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/.*$/, '');

    if (!cleanDomain) return;

    setIsLoading(true);
    setCurrentDomain(cleanDomain);

    try {
      const res = await fetch(`/api/domains/whois?domain=${encodeURIComponent(cleanDomain)}`);
      if (!res.ok) {
        throw new Error('WHOIS lookup request failed');
      }
      const json: WhoisData = await res.json();
      setData(json);
    } catch (err: any) {
      console.warn('WHOIS lookup error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialDomain) {
      fetchWhois(initialDomain);
    } else {
      fetchWhois('google.com');
    }
  }, [initialDomain]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDomain.trim()) return;
    fetchWhois(inputDomain);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] font-sans">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-[#EBEBE7] py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D3B85]/10 text-[#0D3B85] text-xs font-bold">
            <Globe className="w-3.5 h-3.5" />
            <span>Authoritative ICANN &amp; RDAP Database</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight font-display">
            WHOIS Domain &amp; DNS Lookup
          </h1>

          <p className="text-sm text-[#6B6E68] max-w-xl mx-auto leading-relaxed">
            Instant authoritative domain ownership verification, ICANN registrar details, live DNS zone records, and SSL server health diagnostics.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-xs rounded-2xl bg-white border-2 border-[#1B6FC9] focus-within:ring-4 focus-within:ring-[#1B6FC9]/20 transition-all p-1.5">
              <Search className="w-5 h-5 text-[#6B6E68] ml-3 shrink-0" />
              <input
                type="text"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                placeholder="Enter domain name (e.g. google.com, oneallhost.com, mysite.cm)"
                className="w-full px-3 py-2 text-sm sm:text-base font-mono text-[#111111] placeholder:text-[#9CA3AF] bg-transparent outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="rounded-xl px-6 font-bold bg-[#DE3723] hover:bg-[#C52D1C] text-white shrink-0"
                isLoading={isLoading}
              >
                Search WHOIS
              </Button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6B6E68]">
            <span>Try searching:</span>
            {['google.com', 'wordpress.org', 'oneallhost.com', 'camnet.cm', 'cloudflare.com'].map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => {
                  setInputDomain(dom);
                  fetchWhois(dom);
                }}
                className="font-mono text-[#0D3B85] hover:underline bg-white px-2 py-0.5 rounded border border-[#EBEBE7] text-[11px] cursor-pointer"
              >
                {dom}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {isLoading && !data && (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#0D3B85] animate-spin mx-auto" />
            <p className="text-sm font-medium text-[#6B6E68]">Querying authoritative registry &amp; DNS servers...</p>
          </div>
        )}

        {data && (
          <>
            {/* Status Summary Banner */}
            <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold font-mono text-[#111111] tracking-tight">
                      {data.domain}
                    </h2>
                    {data.isRegistered ? (
                      <Badge variant="danger" className="font-bold">Registered</Badge>
                    ) : (
                      <Badge variant="success" className="font-bold">Available for Registration</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B6E68]">
                    <div className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-[#0D3B85]" />
                      <span>Registrar: <strong className="text-[#111111]">{data.registrar}</strong></span>
                    </div>
                    {data.whois.expiryDate !== 'Available' && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0D3B85]" />
                        <span>Expires: <strong className="text-[#111111]">{data.whois.expiryDate}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>WHOIS Privacy: <strong className="text-[#10B981]">Active &amp; Protected</strong></span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="shrink-0 w-full md:w-auto">
                  {!data.isRegistered ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full md:w-auto bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl gap-2 shadow-xs"
                      onClick={() => router.push(`/checkout?domain=${encodeURIComponent(data.domain)}&tld=.${data.domain.split('.').pop()}&price=9.98`)}
                    >
                      <span>Register {data.domain} Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full md:w-auto font-bold rounded-xl gap-2 border-[#0D3B85] text-[#0D3B85] hover:bg-[#0D3B85]/5"
                      onClick={() => router.push(`/domains/transfer?domain=${encodeURIComponent(data.domain)}`)}
                    >
                      <span>Transfer to Oneallhost (+1 YR Free)</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Tab Navigation */}
            <div className="flex border-b border-[#EBEBE7] gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('whois')}
                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'whois'
                    ? 'border-[#0D3B85] text-[#0D3B85]'
                    : 'border-transparent text-[#6B6E68] hover:text-[#111111]'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>WHOIS Registration</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dns')}
                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'dns'
                    ? 'border-[#0D3B85] text-[#0D3B85]'
                    : 'border-transparent text-[#6B6E68] hover:text-[#111111]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>DNS Zone Records ({data.ipAddresses.length + data.nameservers.length + data.dns.mx.length + (data.dns.txt?.length || 0)})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('diagnostics')}
                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'diagnostics'
                    ? 'border-[#0D3B85] text-[#0D3B85]'
                    : 'border-transparent text-[#6B6E68] hover:text-[#111111]'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Website &amp; SSL Diagnostics</span>
              </button>
            </div>

            {/* Tab 1: WHOIS Registration */}
            {activeTab === 'whois' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Domain & Dates */}
                <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0D3B85]" />
                    <span>Domain Registration Details</span>
                  </h3>

                  <div className="space-y-3 text-xs divide-y divide-[#F0F0EE]">
                    <div className="flex justify-between py-2">
                      <span className="text-[#6B6E68]">Domain Name:</span>
                      <span className="font-mono font-bold text-[#111111]">{data.domain}</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-[#6B6E68]">ICANN Registrar:</span>
                      <span className="font-medium text-[#111111]">{data.registrar}</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-[#6B6E68]">Domain Status:</span>
                      <span className="font-mono text-xs text-[#0D3B85] font-medium text-right max-w-[240px] truncate" title={data.status}>
                        {data.status}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-[#6B6E68]">Creation Date:</span>
                      <span className="font-mono text-[#111111]">{data.whois.creationDate}</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-[#6B6E68]">Registry Expiration:</span>
                      <span className="font-mono text-[#111111] font-semibold">{data.whois.expiryDate}</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-[#6B6E68]">Last Updated:</span>
                      <span className="font-mono text-[#111111]">{data.whois.updatedDate}</span>
                    </div>
                  </div>
                </Card>

                {/* Right Column: Registrant & Nameservers */}
                <div className="space-y-6">
                  {/* Registrant Privacy Guard */}
                  <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                        <span>Registrant Contact Privacy</span>
                      </h3>
                      <Badge variant="success">GDPR Protected</Badge>
                    </div>

                    <div className="space-y-3 text-xs divide-y divide-[#F0F0EE]">
                      <div className="flex justify-between py-2">
                        <span className="text-[#6B6E68]">Organization:</span>
                        <span className="font-medium text-[#111111]">{data.whois.registrantOrganization}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-[#6B6E68]">Country:</span>
                        <span className="font-medium text-[#111111]">{data.whois.registrantCountry}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-[#6B6E68]">Contact Email:</span>
                        <span className="font-mono text-xs text-[#0D3B85]">privacy@oneallhost.com</span>
                      </div>
                    </div>
                  </Card>

                  {/* Authoritative Nameservers */}
                  <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-3">
                    <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#0D3B85]" />
                      <span>Authoritative Nameservers ({data.nameservers.length})</span>
                    </h3>

                    {data.nameservers.length > 0 ? (
                      <div className="space-y-1.5 font-mono text-xs">
                        {data.nameservers.map((ns, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAF9] border border-[#EBEBE7]">
                            <span className="text-[#111111] font-medium">{ns}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(ns, `ns-${idx}`)}
                              className="text-[#6B6E68] hover:text-[#0D3B85] p-1 cursor-pointer"
                              title="Copy Nameserver"
                            >
                              {copiedKey === `ns-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B6E68]">No nameservers active for this domain.</p>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {/* Tab 2: DNS Records Table */}
            {activeTab === 'dns' && (
              <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0D3B85]" />
                    <span>Live Authoritative DNS Zone Records</span>
                  </h3>
                  <span className="text-xs text-[#6B6E68]">Resolved via Anycast DNS</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#EBEBE7] bg-[#FAFAF9] text-[#6B6E68] font-bold">
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Host Name</th>
                        <th className="py-2.5 px-3">Value / Destination</th>
                        <th className="py-2.5 px-3">TTL</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F0EE] font-mono">
                      {/* A Records */}
                      {data.ipAddresses.map((ip, idx) => (
                        <tr key={`a-${idx}`} className="hover:bg-[#FAFAF9]">
                          <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">A</span></td>
                          <td className="py-2.5 px-3 text-[#111111]">@</td>
                          <td className="py-2.5 px-3 font-semibold text-[#0D3B85]">{ip}</td>
                          <td className="py-2.5 px-3 text-[#6B6E68]">300s</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(ip, `a-${idx}`)}
                              className="text-[#6B6E68] hover:text-[#0D3B85] p-1 cursor-pointer"
                            >
                              {copiedKey === `a-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* AAAA Records */}
                      {data.dns.aaaa?.map((ip6, idx) => (
                        <tr key={`aaaa-${idx}`} className="hover:bg-[#FAFAF9]">
                          <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">AAAA</span></td>
                          <td className="py-2.5 px-3 text-[#111111]">@</td>
                          <td className="py-2.5 px-3 font-semibold text-[#0D3B85]">{ip6}</td>
                          <td className="py-2.5 px-3 text-[#6B6E68]">300s</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(ip6, `aaaa-${idx}`)}
                              className="text-[#6B6E68] hover:text-[#0D3B85] p-1 cursor-pointer"
                            >
                              {copiedKey === `aaaa-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* MX Records */}
                      {data.dns.mx?.map((mx, idx) => (
                        <tr key={`mx-${idx}`} className="hover:bg-[#FAFAF9]">
                          <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">MX</span></td>
                          <td className="py-2.5 px-3 text-[#111111]">@</td>
                          <td className="py-2.5 px-3 text-[#111111]">{mx.exchange} <span className="text-[#6B6E68]">(Pri: {mx.priority})</span></td>
                          <td className="py-2.5 px-3 text-[#6B6E68]">3600s</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(mx.exchange, `mx-${idx}`)}
                              className="text-[#6B6E68] hover:text-[#0D3B85] p-1 cursor-pointer"
                            >
                              {copiedKey === `mx-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Nameservers (NS) */}
                      {data.nameservers.map((ns, idx) => (
                        <tr key={`ns-rec-${idx}`} className="hover:bg-[#FAFAF9]">
                          <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">NS</span></td>
                          <td className="py-2.5 px-3 text-[#111111]">@</td>
                          <td className="py-2.5 px-3 text-[#111111]">{ns}</td>
                          <td className="py-2.5 px-3 text-[#6B6E68]">86400s</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(ns, `ns-rec-${idx}`)}
                              className="text-[#6B6E68] hover:text-[#0D3B85] p-1 cursor-pointer"
                            >
                              {copiedKey === `ns-rec-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* TXT Records */}
                      {data.dns.txt?.map((txtChunks, idx) => {
                        const txtVal = txtChunks.join(' ');
                        return (
                          <tr key={`txt-${idx}`} className="hover:bg-[#FAFAF9]">
                            <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">TXT</span></td>
                            <td className="py-2.5 px-3 text-[#111111]">@</td>
                            <td className="py-2.5 px-3 text-[#6B6E68] max-w-xs truncate" title={txtVal}>{txtVal}</td>
                            <td className="py-2.5 px-3 text-[#6B6E68]">3600s</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(txtVal, `txt-${idx}`)}
                                className="text-[#6B6E68] hover:text-[#0D3B85] p-1 cursor-pointer"
                              >
                                {copiedKey === `txt-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Tab 3: Diagnostics & SSL */}
            {activeTab === 'diagnostics' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Website Health */}
                <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    {data.website.isOnline ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6 text-red-500" />}
                  </div>
                  <h4 className="font-bold text-sm text-[#111111]">HTTP Server Status</h4>
                  <p className="text-2xl font-mono font-extrabold text-[#0D3B85]">
                    {data.website.httpStatus ? `${data.website.httpStatus} OK` : 'Offline'}
                  </p>
                  <p className="text-xs text-[#6B6E68]">
                    {data.website.isOnline ? 'Active HTTP/HTTPS web server responded.' : 'No active web server responding on ports 80/443.'}
                  </p>
                </Card>

                {/* Response Latency */}
                <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0D3B85] flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#111111]">Network Latency</h4>
                  <p className="text-2xl font-mono font-extrabold text-[#0D3B85]">
                    {data.website.responseTimeMs} ms
                  </p>
                  <p className="text-xs text-[#6B6E68]">
                    Edge response time from authoritative Anycast node.
                  </p>
                </Card>

                {/* SSL & Server Layer */}
                <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#111111]">SSL &amp; Server Layer</h4>
                  <p className="text-lg font-mono font-bold text-[#111111] truncate" title={data.website.server}>
                    {data.website.server}
                  </p>
                  <Badge variant={data.website.httpsEnabled ? 'success' : 'danger'}>
                    {data.website.httpsEnabled ? '256-bit TLS Encrypted' : 'Unencrypted HTTP'}
                  </Badge>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Feature Highlights Grid */}
        <section className="pt-8 border-t border-[#EBEBE7]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              <h3 className="font-bold text-sm text-[#111111]">Free Lifetime WHOIS Privacy</h3>
              <p className="text-xs text-[#6B6E68]">
                Every domain registered or transferred to Oneallhost includes permanent ID shielding and GDPR redaction at zero extra cost.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] space-y-2">
              <Layers className="w-5 h-5 text-[#0D3B85]" />
              <h3 className="font-bold text-sm text-[#111111]">100% Anycast DNS Uptime</h3>
              <p className="text-xs text-[#6B6E68]">
                Enterprise global Anycast nameserver network ensuring your DNS records resolve in under 15ms worldwide.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] space-y-2">
              <RefreshCw className="w-5 h-5 text-[#DE3723]" />
              <h3 className="font-bold text-sm text-[#111111]">Free Seamless Transfer</h3>
              <p className="text-xs text-[#6B6E68]">
                Transfer your existing domain to Oneallhost in minutes and receive an automatic +1 year registration extension included.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function WhoisPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-[#6B6E68]">Loading WHOIS lookup...</div>}>
      <WhoisContent />
    </React.Suspense>
  );
}
