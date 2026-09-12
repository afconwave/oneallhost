'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Repeat,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Clock,
  Globe,
  Tag,
} from 'lucide-react';

interface StagingLease {
  id: string;
  subdomain: string;
  parentZone: string;
  plan: string;
  rentPaidUsd: number;
  rebateCreditUsd: number;
  status: 'active' | 'expiring';
  expiresAt: string;
}

export default function RentalsManagementPage() {
  const [rentals, setRentals] = useState<StagingLease[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/rentals')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.rentals)) {
          setRentals(data.rentals);
        } else {
          setRentals([]);
        }
      })
      .catch((err) => console.error('[Rentals Fetch Error]', err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalRebate = rentals.reduce((acc, r) => acc + (r.rebateCreditUsd || 0), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Subdomain Staging &amp; Leases
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Manage your temporary developer environments. 100% of rental fees accrue as credits toward permanent domain registrations.
          </p>
        </div>

        <Link href="/domains/rentals">
          <button className="h-10 px-4 bg-[#FF5A27] hover:bg-[#e04a1b] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Lease Staging Subdomain</span>
          </button>
        </Link>
      </div>

      {/* Rebate Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6B6E68]">
            <span className="font-bold text-[#111111]">Active Staging Leases</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center">
              <Repeat className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111111] font-mono">{rentals.length}</div>
          <div className="text-[11px] text-[#008A5E] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> AutoSSL &amp; Anycast DNS Active
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6B6E68]">
            <span className="font-bold text-[#111111]">Accrued Purchase Rebates</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#008A5E] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#008A5E] font-mono">
            ${totalRebate.toFixed(2)} USD
          </div>
          <div className="text-[11px] text-[#6B6E68]">
            100% of rent credited on domain purchase
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6B6E68]">
            <span className="font-bold text-[#111111]">DNS Propagation Speed</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#111111] font-mono">&lt; 3 mins</div>
          <div className="text-[11px] text-[#6B6E68]">Global Anycast Mesh Active</div>
        </div>
      </div>

      {/* Staging Subdomains Table */}
      <div className="bg-white rounded-2xl border border-[#F0F0EE] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#F0F0EE] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111111]">
            Active Staging Environments ({rentals.length})
          </h2>
          <span className="text-xs text-[#0D3B85] font-semibold">
            100% Purchase Rebate Standard
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF9] text-[#666666] font-bold uppercase tracking-wider text-[10px] border-b border-[#F0F0EE]">
              <tr>
                <th className="py-3 px-6">Staging Hostname</th>
                <th className="py-3 px-6">Rental Plan</th>
                <th className="py-3 px-6">Rent Paid</th>
                <th className="py-3 px-6">100% Rebate Credit</th>
                <th className="py-3 px-6">Expires</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EE]">
              {rentals.map((rnt) => (
                <tr key={rnt.id} className="hover:bg-[#F9FBFE] transition-colors">
                  <td className="py-4 px-6 font-bold text-[#111111]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center font-bold">
                        <Repeat className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-[#0D3B85]">{rnt.subdomain}</div>
                        <div className="text-[10px] text-[#008A5E] font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#008A5E]" /> Live Staging Active
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-xs text-[#555555]">
                    {rnt.plan}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-[#111111]">
                    ${rnt.rentPaidUsd.toFixed(2)}
                  </td>

                  <td className="py-4 px-6 font-mono text-xs font-bold text-[#008A5E]">
                    ${rnt.rebateCreditUsd.toFixed(2)} USD
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-[#666666]">
                    {rnt.expiresAt}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/domains/domain-name-search?rebate=${rnt.rebateCreditUsd}&from=${encodeURIComponent(rnt.subdomain)}`}
                      >
                        <button className="h-8 px-3 bg-[#0D3B85] hover:bg-[#1B6FC9] text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs">
                          <span>Convert to Domain</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
