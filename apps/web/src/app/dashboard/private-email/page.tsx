'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ShieldCheck, Plus, ExternalLink, Server, CheckCircle2 } from 'lucide-react';
import { Button, Badge } from '@oneallhost/ui';

export default function PrivateEmailPage() {
  const [emailAddress, setEmailAddress] = useState('');
  const [created, setCreated] = useState(false);

  const handleCreateMailbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress) return;
    setCreated(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">
            Private Email & Business Mailboxes
          </h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Secure, ad-free business email on your custom domain with DKIM, SPF, and DMARC enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://webmail.oneallhost.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCDDD8] text-xs font-semibold text-[#0D3B85] hover:bg-[#FAFAF9]"
          >
            <span>Open Webmail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Mailboxes List / Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0D3B85]" />
              <span>Active Mailboxes (0 / Unlimited)</span>
            </h2>

            {!created ? (
              <form onSubmit={handleCreateMailbox} className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-[#111111]">Create New Mailbox</div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center rounded-xl border border-[#DCDDD8] bg-white overflow-hidden px-3">
                    <input
                      type="text"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="info"
                      className="w-full h-10 text-xs bg-transparent outline-none"
                    />
                    <span className="text-xs text-[#6B6E68] shrink-0 font-medium">@yourdomain.com</span>
                  </div>
                  <Button variant="primary" size="sm" className="bg-[#0D3B85] text-xs font-bold h-10 px-4">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Create Mailbox</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mailbox {emailAddress}@yourdomain.com created. MX records configured automatically.</span>
              </div>
            )}
          </div>
        </div>

        {/* Security & DNS Help */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-3">
            <div className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Email Authentication</span>
            </div>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              SPF, DKIM, and DMARC records are automatically injected into your Anycast DNS zone to guarantee 100% inbox delivery rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
