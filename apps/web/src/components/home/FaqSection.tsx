'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does live domain registration work with Namecheap & Oneallhost?',
      a: 'Oneallhost is directly connected to the Namecheap XML registry infrastructure. When you search and pay for a domain, our automated backend provisions the domain in real time, applies free WHOIS privacy protection, and initializes Anycast DNS zone files immediately.',
    },
    {
      q: 'What is a short-term subdomain rental and how does the 100% rebate work?',
      a: 'If you only need a domain for a 24-hour launch, a weekend hackathon, or a 7-day client demo, you can lease a staging subdomain (e.g. yourname.oah.link) starting at $1.99. If you later decide to buy the full permanent domain (e.g. yourname.com), 100% of the rental fee you paid is deducted as a direct rebate at checkout.',
    },
    {
      q: 'Which payment methods are supported?',
      a: 'We support native in-app MTN Mobile Money and Orange Money across Cameroon and CEMAC countries via direct API, as well as Visa, Mastercard, and USDT cryptocurrency with zero external redirects.',
    },
    {
      q: 'Is WHOIS identity privacy protection included for free?',
      a: 'Yes. All eligible TLD registrations (.com, .africa, .org, .net, .io, etc.) include free lifetime WHOIS privacy masking to protect your personal contact information from spammers and scraping.',
    },
    {
      q: 'Can I transfer my existing domain to Oneallhost?',
      a: 'Yes. You can transfer any existing domain from other registrars. All inbound transfers include an automatic 1-year registration extension and free DNS management.',
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
