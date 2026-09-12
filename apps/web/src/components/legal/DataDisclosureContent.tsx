'use client';

import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

export const DataDisclosureContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#111111] font-sans">
      <Header />

      {/* Header Banner */}
      <section className="bg-[#091F44] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
            <Shield className="w-3.5 h-3.5 text-[#00C288]" />
            <span>WHOIS &amp; Registry Data Protection Standard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Domain Registration Data Disclosure Policy
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80">
            Last Updated: January 1, 2026 • Handling of Third-Party Requests for Non-Public WHOIS Registration Data
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0D3B85]" />
            <span>1. Overview &amp; Redacted WHOIS Data</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            In compliance with global data protection laws (including GDPR) and the ICANN Temporary Specification for gTLD Registration Data, Oneallhost redacts personal registrant data from public WHOIS directory queries by default. This policy outlines the standards under which non-public registration data may be requested and disclosed to third parties with legitimate legal interests.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#0D3B85]" />
            <span>2. Categories of Eligible Requesters</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            Oneallhost evaluates disclosure requests strictly on a case-by-case basis from:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#555555] list-disc list-inside">
            <li><strong>Law Enforcement &amp; Government Agencies:</strong> Subpoenas, court orders, or formal mutual legal assistance treaty (MLAT) requests.</li>
            <li><strong>Intellectual Property &amp; Trademark Owners:</strong> Verifiable evidence of trademark infringement, fraud, or consumer deception where private WHOIS prevents dispute initiation.</li>
            <li><strong>Cybersecurity Researchers &amp; CERT Teams:</strong> Urgent mitigation of active phishing infrastructure, malware hosting, or network compromise.</li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0D3B85]" />
            <span>3. Submission Requirements &amp; Due Process</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            All disclosure requests must be submitted in writing to <code>legal@oneallhost.com</code> with:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[#555555] list-disc list-inside">
            <li>Full legal identity and contact information of the requesting entity.</li>
            <li>Exact domain name(s) and specific data fields requested.</li>
            <li>Clear legal basis and documentation supporting legitimate interest.</li>
            <li>Declaration that requested data will be used solely for the stated lawful purpose.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};
