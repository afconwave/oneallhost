'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, Badge, Button, Input } from '@oneallhost/ui';
import { Globe, ArrowRight, ShieldCheck, CheckCircle2, Lock, KeyRound, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DomainTransferPage() {
  const [domainName, setDomainName] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [step, setStep] = useState<'input' | 'verified' | 'success'>('input');

  const handleVerifyTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName || !authCode) return;

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setStep('verified');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="info">ICANN Registrar Inbound Transfer</Badge>
          <h1 className="text-3xl sm:text-4xl font-medium text-[#111111]">
            Transfer Your Domain to Oneallhost
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6E68]">
            Consolidate your domains under Oneallhost with free WHOIS privacy, Anycast DNS, and 1 year extension included with every transfer.
          </p>
        </div>

        <div className="mt-12 max-w-xl mx-auto">
          {step === 'input' && (
            <Card elevation="surface-1" className="p-6 sm:p-8 space-y-5">
              <form onSubmit={handleVerifyTransfer} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#111111] block mb-1">
                    Domain Name to Transfer
                  </label>
                  <Input
                    placeholder="mycompany.com"
                    value={domainName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomainName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#111111]">
                      EPP Authorization Code
                    </label>
                    <span className="text-[11px] text-[#6B6E68]">From current registrar</span>
                  </div>
                  <Input
                    type="password"
                    placeholder="EPP-•••••••••"
                    value={authCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthCode(e.target.value)}
                    required
                  />
                </div>

                {/* Transfer checklist */}
                <div className="p-3 bg-white border border-[#EBEBE7] rounded text-[11px] text-[#6B6E68] space-y-1.5">
                  <div className="font-medium text-[#111111]">Transfer Prerequisites:</div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB342]" />
                    <span>Domain is not under 60-day ICANN lock</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB342]" />
                    <span>WHOIS administrative email is accessible</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" className="w-full" isLoading={isChecking}>
                    Verify domain & authorization code
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {step === 'verified' && (
            <Card elevation="surface-1" className="p-6 sm:p-8 space-y-5 border-[#CCE2FA] bg-[#EDF5FD]">
              <div className="w-10 h-10 rounded-full bg-white border border-[#CCE2FA] flex items-center justify-center text-[#1B6FC9] mx-auto">
                <Globe className="w-5 h-5" />
              </div>

              <div className="text-center">
                <Badge variant="success">Domain Eligible for Transfer</Badge>
                <h3 className="mt-2 text-lg font-medium text-[#111111] font-mono">{domainName}</h3>
                <p className="mt-1 text-xs text-[#6B6E68]">
                  Transfer includes a 1-year registration extension per ICANN consensus policy.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#CCE2FA] rounded space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B6E68]">Transfer & 1-Year Extension:</span>
                  <span className="font-mono">$13.99 (8,611 XAF)</span>
                </div>
                <div className="flex justify-between text-[#4E7525]">
                  <span>WHOIS Privacy:</span>
                  <span>FREE</span>
                </div>
                <div className="pt-2 border-t border-[#EBEBE7] flex justify-between font-medium text-[#0D3B85]">
                  <span>Total Due:</span>
                  <span className="font-mono">$13.99 USD</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep('input')}>
                  Back
                </Button>
                <Link href={`/checkout?domain=${domainName}&amount=13.99`}>
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <span>Proceed to payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
