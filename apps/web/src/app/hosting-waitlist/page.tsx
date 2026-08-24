'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, Badge, Button, Input } from '@oneallhost/ui';
import { Server, CheckCircle2, ShieldCheck, Cpu, Users, Copy, Sparkles } from 'lucide-react';

export default function HostingWaitlistPage() {
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('professional');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState(142);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Deterministic priority queue placement calculation
    const calculatedRank = Math.floor(100 + (email.length * 7) % 89);
    setQueueNumber(calculatedRank);
    setIsSubmitted(true);
  };

  const referralLink = `https://oneallhost.com/hosting-waitlist?ref=${email ? btoa(email).substring(0, 8) : 'alx982'}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="max-w-2xl mx-auto text-center">
          <Badge variant="info">Phase 2 Cloud Rollout</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-medium text-[#111111]">
            Managed Cloud Hosting is Coming
          </h1>
          <p className="mt-2 text-sm text-[#6B6E68]">
            High-performance NVMe SSD hosting optimized for Central Africa and international traffic. Join the waitlist for 3 months free upon public launch.
          </p>
        </div>

        <div className="mt-12 max-w-xl mx-auto">
          {isSubmitted ? (
            <Card elevation="surface-1" className="p-8 text-center border-[#D6E8C2] bg-[#F3F8EC] space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#4E7525] mx-auto" />
              
              <div>
                <span className="text-xs font-mono text-[#0D3B85] uppercase tracking-wider">Priority Confirmed</span>
                <h3 className="mt-1 text-xl font-medium text-[#111111]">
                  You are <span className="font-mono text-[#0D3B85]">#{queueNumber}</span> on the Priority Queue!
                </h3>
                <p className="mt-1 text-xs text-[#6B6E68]">
                  Enrolled for <strong>{tier.toUpperCase()} Cloud Tier</strong>. Verification dispatched to <strong>{email}</strong>.
                </p>
              </div>

              {/* Referral priority booster */}
              <div className="p-4 bg-white border border-[#DCDDD8] rounded text-left space-y-2 text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0D3B85]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Early Access Provisioning Queue</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 p-2 font-mono text-[11px] bg-[#FAFAF9] border border-[#EBEBE7] rounded select-all"
                  />
                  <Button variant="outline" size="sm" onClick={copyReferral}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card elevation="surface-1" className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#111111] block mb-1.5">Your Work Email</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#111111] block mb-1.5">Intended Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['starter', 'professional', 'business'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTier(t)}
                        className={`p-2 text-xs font-medium rounded border capitalize transition-colors ${
                          tier === t
                            ? 'bg-white border-[#1B6FC9] text-[#0D3B85]'
                            : 'bg-white border-[#EBEBE7] text-[#6B6E68] hover:border-[#DCDDD8]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" className="w-full">
                    Join priority waitlist
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Feature previews */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-4 border border-[#EBEBE7] rounded bg-white">
            <Cpu className="w-5 h-5 text-[#0D3B85]" />
            <h4 className="mt-2 text-xs font-medium text-[#111111]">NVMe SSD Storage</h4>
            <p className="mt-1 text-[11px] text-[#6B6E68]">Blazing fast read/write throughput for database-intensive sites.</p>
          </div>
          <div className="p-4 border border-[#EBEBE7] rounded bg-white">
            <ShieldCheck className="w-5 h-5 text-[#7CB342]" />
            <h4 className="mt-2 text-xs font-medium text-[#111111]">Auto SSL & DDoS Guard</h4>
            <p className="mt-1 text-[11px] text-[#6B6E68]">Free TLS certificates and edge DDoS scrubbing included by default.</p>
          </div>
          <div className="p-4 border border-[#EBEBE7] rounded bg-white">
            <Server className="w-5 h-5 text-[#1B6FC9]" />
            <h4 className="mt-2 text-xs font-medium text-[#111111]">1-Click App Installs</h4>
            <p className="mt-1 text-[11px] text-[#6B6E68]">WordPress, Node.js, Next.js, and Python application support.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
