'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Server, ShieldCheck, CreditCard, ArrowRight, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { Button, Badge } from '@oneallhost/ui';
import { DomainSearchBar } from '@/components/domains';

export default function DashboardOverviewPage() {
  const [ownedDomains, setOwnedDomains] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = () => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/users/domains').then((r) => (r.ok ? r.json() : { domains: [] })),
      fetch('/api/users/invoices').then((r) => (r.ok ? r.json() : { invoices: [] })),
    ])
      .then(([domainData, invData]) => {
        setOwnedDomains(domainData.domains || []);
        setInvoices(invData.invoices || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">
            Account Dashboard
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Overview of your active domains, nameserver routing, and infrastructure services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            className="text-xs font-semibold gap-1.5 border-[#DCDDD8]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>
          <Link href="/dashboard/domain-list">
            <Button
              variant="primary"
              size="sm"
              className="bg-[#0D3B85] hover:bg-[#1B6FC9] text-xs font-bold gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Domain</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6E68]">Active Domains</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] font-mono">
            {isLoading ? '...' : ownedDomains.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">All Anycast Connected</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6E68]">Expiring Soon</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] font-mono">0</div>
          <div className="text-[11px] text-[#6B6E68]">Next 30 days</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6E68]">Cloud Servers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] font-mono">1</div>
          <div className="text-[11px] text-blue-700 font-medium">Edge Yaoundé Node</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6E68]">Invoices Settled</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] font-mono">
            {isLoading ? '...' : invoices.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">Auto-receipting active</div>
        </div>
      </div>

      {/* Fast Domain Search Strip */}
      <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#111111]">Register a New Domain</h2>
          <p className="text-xs text-[#6B6E68]">Check real-time availability across 400+ TLDs.</p>
        </div>
        <DomainSearchBar />
      </div>

      {/* Active Domains Snippet */}
      <div className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#EBEBE7] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0D3B85]" />
            <span>Active Domain Portfolio</span>
          </h2>
          <Link
            href="/dashboard/domain-list"
            className="text-xs font-semibold text-[#0D3B85] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {ownedDomains.length > 0 ? (
          <div className="divide-y divide-[#EBEBE7]">
            {ownedDomains.slice(0, 5).map((dom) => (
              <div
                key={dom.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFAF9]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center font-bold text-xs">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111111]">{dom.name}</div>
                    <div className="text-[11px] text-[#6B6E68]">Expires: {dom.expiresAt}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">Active</Badge>
                  <Link href="/dashboard/domain-list">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                      Manage DNS
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-2">
            <Globe className="w-8 h-8 text-[#6B6E68] mx-auto opacity-40" />
            <div className="text-xs font-semibold text-[#111111]">No domains registered yet</div>
            <p className="text-[11px] text-[#6B6E68]">Your domains will appear here once registered.</p>
          </div>
        )}
      </div>
    </div>
  );
}
