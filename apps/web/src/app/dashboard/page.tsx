'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@oneallhost/ui';
import {
  Globe,
  Repeat,
  Receipt,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [domains, setDomains] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:4000/api/v1/users/domains').then((r) => (r.ok ? r.json() : null)),
      fetch('http://localhost:4000/api/v1/users/invoices').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([domainsData, invoicesData]) => {
        if (domainsData && Array.isArray(domainsData.domains)) {
          setDomains(domainsData.domains);
        }
        if (invoicesData && Array.isArray(invoicesData.invoices)) {
          setInvoices(invoicesData.invoices);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">
            Account Overview
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Manage your registered domains, active staging leases, and billing receipts.
          </p>
        </div>

        <Link href="/dashboard/domains">
          <Button variant="primary" size="sm" className="h-10 px-4 bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs gap-1.5 rounded-xl shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Register Domain</span>
          </Button>
        </Link>
      </div>

      {/* 3 Clean Single-Layer Metric Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6B6E68]">
            <span className="font-semibold text-[#111111]">Registered Domains</span>
            <Globe className="w-4 h-4 text-[#0D3B85]" />
          </div>
          <div className="text-3xl font-extrabold text-[#111111]">
            {domains.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All Anycast DNS Active
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6B6E68]">
            <span className="font-semibold text-[#111111]">Active Subdomain Leases</span>
            <Repeat className="w-4 h-4 text-[#7CB342]" />
          </div>
          <div className="text-3xl font-extrabold text-[#111111]">
            0
          </div>
          <div className="text-[11px] text-[#6B6E68]">
            100% Purchase Rebate Eligible
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6B6E68]">
            <span className="font-semibold text-[#111111]">Total Transactions</span>
            <Receipt className="w-4 h-4 text-[#1B6FC9]" />
          </div>
          <div className="text-3xl font-extrabold text-[#111111]">
            {invoices.length}
          </div>
          <div className="text-[11px] text-[#6B6E68]">
            Automated Invoicing & Receipts
          </div>
        </div>
      </div>

      {/* Domain Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#EBEBE7] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111111]">My Active Domains</h2>
          <Link href="/dashboard/domains" className="text-xs font-semibold text-[#0D3B85] hover:underline flex items-center gap-1">
            <span>Manage all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {domains.length > 0 ? (
          <div className="divide-y divide-[#EBEBE7]">
            {domains.map((dom) => (
              <div key={dom.id} className="p-4 flex items-center justify-between hover:bg-[#FAFAF9] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#111111]">{dom.name}</div>
                    <div className="text-[11px] text-[#6B6E68]">Expires: {dom.expiresAt}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    Active
                  </span>
                  <Link href="/dashboard/domains">
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs text-[#0D3B85]">
                      Manage DNS
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Globe className="w-8 h-8 text-[#6B6E68] mx-auto opacity-40" />
            <div className="text-sm font-semibold text-[#111111]">No domains registered yet</div>
            <p className="text-xs text-[#6B6E68] max-w-sm mx-auto">
              Search and register your first domain with live Namecheap XML provisioning and free WHOIS privacy.
            </p>
            <Link href="/#domains" className="inline-block pt-2">
              <Button variant="primary" size="sm" className="bg-[#0D3B85] hover:bg-[#1B6FC9] text-xs">
                Search Domains
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
