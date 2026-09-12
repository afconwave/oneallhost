'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Oneallhost an ICANN-accredited and trusted domain registrar?',
      a: 'Yes. Oneallhost operates on fully ICANN-compliant, high-availability registry infrastructure. When you register any domain through Oneallhost, your registration is provisioned directly into global authoritative registries with sub-3-minute global root DNS propagation, automated DNSSEC signing, and lifetime WHOIS privacy masking.',
    },
    {
      q: 'Can government ministries, public agencies, and schools register .gov and .edu domains?',
      a: 'Yes. Oneallhost supports official government and institutional extensions across Africa and worldwide (including .gov, .gov.cm, .gov.ng, .gov.gh, .gov.rw, .gov.za, .gov.ke, and .edu.cm). Our compliance desk provides dedicated verification assistance for official public sector bodies, municipal entities, and accredited educational institutions.',
    },
    {
      q: 'Which African country-code domains (ccTLDs) are supported?',
      a: 'We provide direct registration for all top African ccTLDs including Cameroon (.cm, .co.cm), Nigeria (.ng, .com.ng), Ghana (.gh, .com.gh), Kenya (.ke, .co.ke), Rwanda (.rw, .co.rw), South Africa (.za, .co.za), Côte d\'Ivoire (.ci), Senegal (.sn), Tanzania (.tz), Uganda (.ug), and the pan-African .africa extension, with instant local Mobile Money settlement.',
    },
    {
      q: 'How does instant domain registration work on Oneallhost?',
      a: 'Oneallhost operates on enterprise Anycast registry infrastructure. When you search and complete your order, our automated provisioning engine immediately reserves your domain in the global authoritative registry, applies free lifetime WHOIS identity privacy protection, and activates Anycast DNS zone routing worldwide within seconds.',
    },
    {
      q: 'What is a developer staging rental and how does the 100% rebate work?',
      a: 'If you need a domain for a staging launch, client presentation, or temporary project, you can lease a staging subdomain (e.g. yourname.oneall.app) starting at $1.99. When you decide to register the permanent top-level domain (e.g. yourname.com), 100% of the rental fees paid are automatically applied as a direct rebate discount at checkout.',
    },
    {
      q: 'Which local and international payment methods are accepted?',
      a: 'We support direct in-app African Mobile Money (MTN MoMo, Orange Money, Wave) across 18 African nations with real-time settlement, international credit/debit cards (Visa, Mastercard, American Express), and Tether USDT (TRC-20 / ERC-20) with zero external redirects.',
    },
    {
      q: 'Is WHOIS identity privacy protection included for free?',
      a: 'Yes. All eligible domain registrations (.com, .cm, .org, .net, .io, .africa, .tech, etc.) include lifetime WHOIS privacy masking free of charge, keeping your personal name, address, and phone number shielded from spammers and scraping bots.',
    },
    {
      q: 'How does the Account Wallet and Auto-Debit renewal system work?',
      a: 'You can fund your account wallet balance at any time using Mobile Money, Card, or Crypto. When Auto-Debit is enabled, expiring domains and hosting instances automatically renew 7 days prior to expiration from your wallet balance, guaranteeing 100% uptime with zero service interruptions.',
    },
    {
      q: 'Can I transfer my existing domains and web hosting to Oneallhost?',
      a: 'Yes. Inbound domain transfers receive an automatic 1-year registration extension and free DNS management. In addition, our migration team moves your existing cPanel files, databases, and mailboxes with zero downtime at no cost.',
    },
    {
      q: 'What security features protect my domains and websites from theft or hijacking?',
      a: 'Every Oneallhost domain includes Registrar Transfer Lock (clientTransferProhibited), 2-Factor Authentication (2FA) for your account, automated DNSSEC record generation, and real-time DNS modification alerts to prevent unauthorized transfers or unauthorized record tampering.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAFAF9] border-0 shadow-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white overflow-hidden transition-all border-0 shadow-none"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#F6F7F5]"
                >
                  <span className="text-sm font-bold text-[#111111]">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B6E68] transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-[#0D3B85]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[#444444] leading-relaxed border-t border-[#EBEBE7]/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
