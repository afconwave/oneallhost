import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#111111]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-14 w-full space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-display">Terms of Service</h1>
          <p className="mt-1 text-xs text-[#6B6E68]">Last revised: January 2026</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
            <h2 className="text-base font-bold text-[#111111] font-display">1. Overview & Agreement</h2>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              By accessing Oneallhost, registering domains, leasing subdomains, or provisioning hosting, you agree to be bound by these Terms of Service and applicable ICANN registry consensus policies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
            <h2 className="text-base font-bold text-[#111111] font-display">2. Domain Registration & WHOIS Accuracy</h2>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Registrants must maintain accurate contact data per ICANN specifications. Free WHOIS privacy masking is enabled where supported by the underlying registry operator.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-2">
            <h2 className="text-base font-bold text-[#111111] font-display">3. Payments, Invoicing & Refunds</h2>
            <p className="text-xs text-[#6B6E68] leading-relaxed">
              Payments processed through Oneallhost Billing (Card, MTN MoMo, Orange Money) generate official sequential tax invoices (ONH-YYYY-XXXXXX). Disputed transactions are subject to internal reconciliation.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
