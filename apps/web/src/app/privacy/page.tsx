import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full">
        <h1 className="text-2xl sm:text-3xl font-medium text-[#111111]">Privacy Policy</h1>
        <p className="mt-1 text-xs text-[#6B6E68]">Last revised: January 2026</p>

        <div className="mt-8 space-y-6 text-xs text-[#6B6E68] leading-relaxed">
          <section>
            <h2 className="text-sm font-medium text-[#111111] mb-2">1. Data Collection & Use</h2>
            <p>
              We collect minimal customer information necessary to provision registrar ownership (name, email, phone, billing address) and maintain security. We do not sell or monetize client registry data.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[#111111] mb-2">2. WHOIS Privacy Masking</h2>
            <p>
              To protect domain owners from spam and identity theft, Oneallhost applies proxy WHOIS contact details on all compliant TLD registrations automatically.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-medium text-[#111111] mb-2">3. Storage & Encryption</h2>
            <p>
              All database records and transaction logs are stored with Row Level Security (RLS) and encrypted transport over TLS 1.3.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
