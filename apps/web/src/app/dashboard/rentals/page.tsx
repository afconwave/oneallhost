'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Repeat, Plus, ArrowRight, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { clientAuthHeaders } from '../../../lib/session';

interface StagingLease {
  id: string;
  subdomain: string;
  plan?: string;
  rentPaidUsd?: number;
  priceUsd?: number;
  rebateCreditUsd: number;
  status: string;
  expiresAt: string;
}

export default function RentalsManagementPage() {
  const [rentals, setRentals] = useState<StagingLease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users/rentals', { headers: clientAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success && data?.error) {
          setError(data.error);
          setRentals([]);
          return;
        }
        const rows = Array.isArray(data.rentals) ? data.rentals : [];
        setRentals(
          rows.map((r: any) => ({
            id: r.id,
            subdomain: r.subdomain,
            plan: r.durationType ? `${r.durationValue} ${r.durationType}` : 'lease',
            rentPaidUsd: Number(r.priceUsd || r.rentPaidUsd || 0),
            rebateCreditUsd: Number(r.rebateCreditUsd || r.priceUsd || 0),
            status: r.status,
            expiresAt: r.expiresAt,
          }))
        );
      })
      .catch(() => setError('Could not load rentals'))
      .finally(() => setIsLoading(false));
  }, []);

  const totalRebate = rentals.reduce((acc, r) => acc + (r.rebateCreditUsd || 0), 0);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">Subdomain Staging &amp; Leases</h1>
          <p className="text-xs text-[#6B6E68] mt-1">Rent is credited toward a later domain purchase after the lease is paid.</p>
        </div>
        <Link href="/domains/rentals" className="h-10 px-4 bg-[#FF5A27] text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Lease Staging Subdomain
        </Link>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#F0F0EE]">
          <div className="flex justify-between text-xs text-[#6B6E68]"><span className="font-bold text-[#111111]">Active leases</span><Repeat className="w-4 h-4" /></div>
          <div className="text-2xl font-black font-mono">{isLoading ? '—' : rentals.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#F0F0EE]">
          <div className="flex justify-between text-xs"><span className="font-bold">Accrued rebates</span><Sparkles className="w-4 h-4" /></div>
          <div className="text-2xl font-black text-[#008A5E] font-mono">${totalRebate.toFixed(2)}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#F0F0EE]">
          <div className="flex justify-between text-xs"><span className="font-bold">DNS</span><Globe className="w-4 h-4" /></div>
          <div className="text-sm font-semibold flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> CNAME after paid create</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#F0F0EE] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFAF9] text-[10px] uppercase">
            <tr>
              <th className="py-3 px-6">Hostname</th>
              <th className="py-3 px-6">Plan</th>
              <th className="py-3 px-6">Paid</th>
              <th className="py-3 px-6">Rebate</th>
              <th className="py-3 px-6">Expires</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rnt) => (
              <tr key={rnt.id} className="border-t border-[#F0F0EE]">
                <td className="py-4 px-6 font-extrabold text-[#0D3B85]">{rnt.subdomain}</td>
                <td className="py-4 px-6">{rnt.plan}</td>
                <td className="py-4 px-6 font-mono">${Number(rnt.rentPaidUsd || 0).toFixed(2)}</td>
                <td className="py-4 px-6 font-mono text-[#008A5E]">${Number(rnt.rebateCreditUsd || 0).toFixed(2)}</td>
                <td className="py-4 px-6 font-mono">{rnt.expiresAt}</td>
                <td className="py-4 px-6 text-right">
                  <Link href={`/domains/domain-name-search?rebate=${rnt.rebateCreditUsd}&from=${encodeURIComponent(rnt.subdomain)}`} className="inline-flex items-center gap-1 h-8 px-3 bg-[#0D3B85] text-white rounded-lg font-bold">
                    Convert <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
            {!isLoading && rentals.length === 0 ? (
              <tr><td className="py-8 px-6 text-[#6B6E68]" colSpan={6}>No leases yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
