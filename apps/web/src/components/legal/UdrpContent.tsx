'use client';

import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Scale, ShieldCheck, FileCheck, ExternalLink, Globe } from 'lucide-react';

export const UdrpContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#111111] font-sans">
      <Header />

      {/* Header Banner */}
      <section className="bg-[#091F44] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
            <Scale className="w-3.5 h-3.5 text-[#FF5A27]" />
            <span>ICANN Consensus Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Uniform Domain-Name Dispute-Resolution Policy (UDRP)
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80">
            Adopted by ICANN • Mandatory Administrative Dispute Proceedings for gTLD Registrations
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#0D3B85]" />
            <span>1. Purpose of the UDRP</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            This Uniform Domain-Name Dispute-Resolution Policy (the &ldquo;Policy&rdquo;) has been adopted by the Internet Corporation for Assigned Names and Numbers (&ldquo;ICANN&rdquo;) and is incorporated by reference into your Registration Agreement with Oneallhost. It sets forth the terms and conditions in connection with a dispute between you and any party other than us over the registration and use of an Internet domain name registered by you.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#0D3B85]" />
            <span>2. Mandatory Administrative Proceedings</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            You are required to submit to a mandatory administrative proceeding in the event that a third party (&ldquo;Complainant&rdquo;) asserts to an approved dispute-resolution service provider (such as WIPO or FORUM) that:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#555555] list-disc list-inside">
            <li>Your domain name is identical or confusingly similar to a trademark or service mark in which the complainant has rights; and</li>
            <li>You have no rights or legitimate interests in respect of the domain name; and</li>
            <li>Your domain name has been registered and is being used in bad faith.</li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D3B85]" />
            <span>3. Oneallhost Registrar Obligations</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            We will not participate in the administration or conduct of any proceeding before an administrative panel. Upon receipt of a formal determination from an accredited dispute provider or court order, Oneallhost will implement the required domain lock, transfer, or cancellation.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0D3B85]" />
            <span>4. Official ICANN References &amp; Providers</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            For the complete unedited ICANN Policy and approved Dispute Resolution Service Providers, visit the official ICANN portal:
          </p>
          <div className="pt-2">
            <a
              href="https://www.icann.org/resources/pages/help/dndr/udrp-en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#0D3B85] hover:underline inline-flex items-center gap-1.5"
            >
              <span>View Official ICANN UDRP Documentation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
