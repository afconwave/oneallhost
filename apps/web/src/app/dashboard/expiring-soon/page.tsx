'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ShieldCheck, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button, Badge } from '@oneallhost/ui';

export default function ExpiringSoonPage() {
  const [expiringDomains, setExpiringDomains] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/domains')
      .then((res) => (res.ok ? res.json() : { domains: [] }))
      .then((data) => {
        // Filter or display domains
        const domains = data.domains || [];
        setExpiringDomains(domains.filter((d: any) => d.status === 'Expiring' || d.daysLeft < 60));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#EBEBE7] pb-5">
        <h1 className="text-2xl font-bold text-[#111111] font-display">
          Expiring Domains & Auto-Renewal
        </h1>
        <p className="text-xs text-[#6B6E68] mt-1">
          Monitor registrations requiring renewal within the next 90 days to avoid redemption fees.
        </p>
      </div>

      {expiringDomains.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs divide-y divide-[#EBEBE7]">
          {expiringDomains.map((dom) => (
            <div key={dom.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[#111111]">{dom.name}</div>
                <div className="text-xs text-amber-600">Expires: {dom.expiresAt}</div>
              </div>
              <Button variant="primary" size="sm" className="bg-[#0D3B85] text-xs">
                Renew Now
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-2xl border border-[#EBEBE7] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-[#111111]">All Domains Are Up to Date</div>
          <p className="text-xs text-[#6B6E68] max-w-sm mx-auto">
            None of your registered domains are scheduled to expire in the next 60 days. Auto-renewals are monitored automatically.
          </p>
          <Link href="/dashboard/domain-list" className="inline-block pt-2">
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              View All Domains
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
