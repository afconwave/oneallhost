'use client';

import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { ShieldCheck, Lock, Eye, Server, UserCheck } from 'lucide-react';

export const PrivacyContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#111111] font-sans">
      <Header />

      {/* Header Banner */}
      <section className="bg-[#091F44] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00C288]" />
            <span>Privacy &amp; Data Protection Standard</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80">
            Last Updated: January 1, 2026 • GDPR &amp; Global Privacy Standards Compliant
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0D3B85]" />
            <span>1. Commitment to User Privacy</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            At Oneallhost, your privacy is our core priority. We do not sell, rent, or trade your personal information to third-party advertisers. We strictly collect the information necessary to fulfill ICANN registry requirements, process payments, and ensure the reliable delivery of Anycast DNS and cloud services.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#0D3B85]" />
            <span>2. Free Lifetime WHOIS Privacy Protection</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            Every eligible domain name registered through Oneallhost comes with 100% Free Lifetime WHOIS Privacy Guard. We mask your personal phone number, home address, and primary email in public WHOIS directory searches with proxy contact information to prevent spam, scraping, and identity theft.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Server className="w-4 h-4 text-[#0D3B85]" />
            <span>3. Information We Collect</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-[#555555] list-disc list-inside">
            <li><strong>Account Information:</strong> Name, verified email address, phone number, and account login credentials.</li>
            <li><strong>Domain Registrant Data:</strong> Contact information mandated by ICANN and country-code registry authorities.</li>
            <li><strong>Billing Details:</strong> Encrypted transaction tokens processed securely via PCI-DSS compliant gateways (Cards, Mobile Money, Crypto).</li>
            <li><strong>Technical Telemetry:</strong> IP addresses, server logs, and Anycast DNS query volume for performance and DDoS mitigation.</li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#0D3B85]" />
            <span>4. Your Data Rights &amp; Access</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            You retain full rights to inspect, update, export, or request the deletion of your personal data at any time via your Client Dashboard or by contacting our 24/7 Data Protection Officer at <code>privacy@oneallhost.com</code>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
