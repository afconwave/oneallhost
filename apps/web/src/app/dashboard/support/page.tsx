'use client';

import React, { useState } from 'react';
import { Button, Input } from '@oneallhost/ui';
import { LifeBuoy, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function SupportPage() {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('domains');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the 60-day ICANN registrar lock work?',
      a: 'Per ICANN consensus policy, all freshly registered domain names and recent registrar transfers cannot be transferred out to a third-party registrar for 60 days following the transaction.',
    },
    {
      q: 'How do I convert my rental subdomain into a full domain purchase?',
      a: 'Navigate to the Rentals tab in your dashboard, locate your active lease, and click "Convert to purchase". 100% of your paid rental fees are subtracted from the standard domain registration price.',
    },
    {
      q: 'What payment methods are supported for billing?',
      a: 'We natively support MTN Mobile Money, Orange Money, Visa, and Mastercard with instant automated receipt generation.',
    },
    {
      q: 'How long does DNS propagation take after updating records?',
      a: 'Our nameservers operate globally with typical record propagation taking between 2 to 3 minutes.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#EBEBE7] pb-4">
        <h1 className="text-2xl font-bold text-[#111111] font-display">Support & Help Desk</h1>
        <p className="text-xs text-[#6B6E68] mt-1">
          Submit technical tickets, query DNS guidance, or review frequently asked questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TICKET FORM */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#111111]">
            Open Support Ticket
          </h2>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl text-center space-y-3 bg-[#F3F8EC] border border-[#D6E8C2]">
              <CheckCircle2 className="w-8 h-8 text-[#4E7525] mx-auto" />
              <h3 className="text-sm font-bold text-[#111111]">Ticket Received (TICK-98214)</h3>
              <p className="text-xs text-[#6B6E68]">
                Our support engineering team will respond within 2 business hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                Submit another ticket
              </Button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111111] block">Subject</label>
                  <input
                    placeholder="e.g. DNS Propagation issue on mydomain.com"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#DCDDD8] text-xs bg-white text-[#111111] focus:border-[#0D3B85] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111111] block">Department</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-[#DCDDD8] rounded-xl text-xs text-[#111111] focus:border-[#0D3B85] outline-none"
                  >
                    <option value="domains">Domain Management & DNS</option>
                    <option value="rentals">Rentals & Lease Conversion</option>
                    <option value="hosting">Cloud Hosting Layer</option>
                    <option value="billing">Billing & Mobile Money</option>
                    <option value="technical">Technical Inquiries</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111111] block">Details & Context</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Describe the issue in detail..."
                    className="w-full p-3.5 rounded-xl border border-[#DCDDD8] text-xs bg-white text-[#111111] focus:border-[#0D3B85] outline-none"
                  />
                </div>

                <Button variant="primary" size="sm" className="w-full bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs h-11 rounded-xl">
                  <Send className="w-3.5 h-3.5 mr-2" />
                  <span>Submit Support Ticket</span>
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* FAQs ACCORDION */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#111111]">
            Frequently Answered Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EBEBE7] overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#111111] hover:bg-[#FAFAF9]"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#6B6E68] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B6E68] shrink-0" />
                  )}
                </button>

                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#6B6E68] leading-relaxed border-t border-[#EBEBE7] pt-3 bg-[#FAFAF9]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
