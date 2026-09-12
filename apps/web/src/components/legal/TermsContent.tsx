'use client';

import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Scale, FileText, Globe, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

export const TermsContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#111111] font-sans">
      <Header />

      {/* Header Banner */}
      <section className="bg-[#091F44] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
            <Scale className="w-3.5 h-3.5 text-[#FF5A27]" />
            <span>Legal Agreement &amp; Operating Policies</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Terms and Conditions
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80">
            Last Updated: January 1, 2026 • Universal Registrar &amp; Cloud Infrastructure Agreement
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0D3B85]" />
            <span>1. Introduction &amp; Scope of Services</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            These Terms and Conditions constitute a legally binding agreement between you (&ldquo;Customer&rdquo;, &ldquo;User&rdquo;, or &ldquo;Registrant&rdquo;) and Oneallhost Inc. (&ldquo;Oneallhost&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account, registering a top-level domain (gTLD or ccTLD), leasing a developer staging subdomain, purchasing web hosting, or provisioning SSL certificates, you agree to comply with all provisions herein.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0D3B85]" />
            <span>2. ICANN Domain Registration Consensus Policies</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            As an ICANN-accredited registrar, Oneallhost adheres to the Uniform Domain Name Dispute Resolution Policy (UDRP), the Transfer Dispute Resolution Policy (TDRP), and ICANN&apos;s Registrar Accreditation Agreement (RAA).
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#555555] list-disc list-inside">
            <li><strong>Accuracy of WHOIS Data:</strong> You certify that the administrative, technical, and registrant contact details provided during registration are accurate and up-to-date.</li>
            <li><strong>Free Lifetime Privacy:</strong> Where supported by the registry, free WHOIS Privacy Guard is enabled by default to mask personal identities.</li>
            <li><strong>Grace Periods &amp; Redemption:</strong> Expired domains enter an auto-renewal grace period followed by a mandatory registry redemption period before release to the public.</li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0D3B85]" />
            <span>3. Subdomain Staging Leases &amp; 100% Purchase Rebates</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            Oneallhost provides developer staging subdomain rentals (e.g., <code>yourname.oneall.app</code>). All rental fees paid on staging subdomains accrue toward your account rebate wallet and can be 100% redeemed as a checkout discount on permanent domain name registrations.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#0D3B85]" />
            <span>4. Acceptable Use Policy &amp; Prohibited Activities</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            You agree not to use Oneallhost infrastructure, Anycast DNS, hosting servers, or staging domains for malicious activities including malware distribution, phishing, spam transmission, or trademark infringement.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D3B85]" />
            <span>5. Payment Methods, Billing &amp; Automated Renewals</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            Oneallhost supports payment via Credit/Debit Cards, Mobile Money (MTN MoMo &amp; Orange Money), and Cryptocurrency. Subscriptions are set to auto-renew by default to prevent accidental expiration, and can be managed directly in the client dashboard.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
