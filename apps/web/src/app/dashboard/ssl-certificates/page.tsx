'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Plus, ExternalLink, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button, Badge } from '@oneallhost/ui';

export default function SslCertificatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">
            SSL / TLS Certificates
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Free Let's Encrypt Wildcard SSL certificates and Sectigo/Comodo PositiveSSL certificates.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-[#DCDDD8]">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Status</span>
        </Button>
      </div>

      {/* SSL Certificates List */}
      <div className="p-8 rounded-2xl bg-white border border-[#EBEBE7] text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="text-base font-bold text-[#111111]">Automated Zero-SSL / Let's Encrypt</div>
          <p className="text-xs text-[#6B6E68] max-w-md mx-auto">
            All registered domains and active web hosting packages come with automated HTTPS certificate provisioning via HTTP-01 and DNS-01 ACME challenges.
          </p>
        </div>

        <div className="pt-2">
          <Badge variant="success" className="px-3 py-1 text-xs">
            Auto-Renewing HTTPS Active
          </Badge>
        </div>
      </div>
    </div>
  );
}
