'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Badge } from '@oneallhost/ui';
import { Server, Cpu, ShieldCheck, ArrowRight, HardDrive, CheckCircle2 } from 'lucide-react';

export default function HostingManagementPage() {
  const [hasJoined, setHasJoined] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasJoined(true);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#EBEBE7] pb-5">
        <h1 className="text-2xl font-bold text-[#111111] font-display">Cloud Hosting Infrastructure</h1>
        <p className="text-xs text-[#6B6E68] mt-1">
          High-performance NVMe cloud hosting with Central & West Africa edge deployment.
        </p>
      </div>

      {/* Early Access Control Panel */}
      <div className="p-8 rounded-2xl bg-white border border-[#EBEBE7] text-center max-w-2xl mx-auto space-y-5 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0D3B85] flex items-center justify-center font-bold mx-auto">
          <Server className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#111111] font-display">
            Managed Cloud Layer in Provisioning
          </h2>
          <p className="text-xs text-[#6B6E68] max-w-md mx-auto leading-relaxed">
            Edge server nodes in Yaoundé, Douala, and Frankfurt are currently undergoing final stress testing. Reserve early provisioning priority for your domains.
          </p>
        </div>

        {!hasJoined ? (
          <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for priority rollout..."
              className="flex-1 h-11 px-3.5 rounded-xl border border-[#DCDDD8] text-xs bg-white text-[#111111] focus:border-[#0D3B85] outline-none"
            />
            <Button
              variant="primary"
              size="sm"
              className="h-11 px-5 bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs rounded-xl shadow-xs shrink-0"
              isLoading={isLoading}
            >
              <span>Reserve Early Access</span>
            </Button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-4 h-4 text-[#7CB342]" />
            <span>Priority reservation confirmed for {email}</span>
          </div>
        )}
      </div>

      {/* Planned Edge Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-3">
          <div className="text-[11px] font-bold text-[#0D3B85]">STARTER EDGE</div>
          <h3 className="text-base font-bold text-[#111111]">10 GB NVMe Cloud</h3>
          <ul className="space-y-2 text-xs text-[#6B6E68]">
            <li className="flex items-center gap-2"><HardDrive className="w-3.5 h-3.5 text-[#0D3B85]" /> 10 GB NVMe Storage</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-[#7CB342]" /> 1 Hosted Domain</li>
            <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-[#1B6FC9]" /> Automated Daily Backups</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-3">
          <div className="text-[11px] font-bold text-[#7CB342]">PRO CLOUD</div>
          <h3 className="text-base font-bold text-[#111111]">50 GB NVMe Multi-Region</h3>
          <ul className="space-y-2 text-xs text-[#6B6E68]">
            <li className="flex items-center gap-2"><HardDrive className="w-3.5 h-3.5 text-[#0D3B85]" /> 50 GB NVMe Storage</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-[#7CB342]" /> 5 Hosted Domains</li>
            <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-[#1B6FC9]" /> Node.js & Python Runtimes</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-3">
          <div className="text-[11px] font-bold text-[#1B6FC9]">ENTERPRISE CLUSTER</div>
          <h3 className="text-base font-bold text-[#111111]">Dedicated Edge Node</h3>
          <ul className="space-y-2 text-xs text-[#6B6E68]">
            <li className="flex items-center gap-2"><HardDrive className="w-3.5 h-3.5 text-[#0D3B85]" /> 250 GB NVMe Storage</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-[#7CB342]" /> Unlimited Domains</li>
            <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-[#1B6FC9]" /> Dedicated IP & 100% SLA</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
