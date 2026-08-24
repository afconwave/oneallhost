'use client';

import React from 'react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Oneallhost solved our DNS latency completely. Managing our .CM domains and paying directly via MTN Mobile Money without international card declines has been a game-changer.",
    author: "Marc Ngassa",
    role: "Lead Systems Architect",
    location: "Douala, Cameroon",
    rating: 5,
  },
  {
    quote: "The 100% rebate on subdomain leases let us test three staging environments before purchasing our permanent brand domain. Sub-3-minute DNS propagation is real.",
    author: "Fatima Al-Hassan",
    role: "DevOps Engineer",
    location: "Yaoundé, Cameroon",
    rating: 5,
  },
  {
    quote: "Instant WHOIS privacy guard without extra fees and direct Orange Money billing made domain management completely frictionless for our client roster.",
    author: "Christian Ewane",
    role: "Digital Agency Director",
    location: "Bafoussam, Cameroon",
    rating: 5,
  },
];

export const TestimonialsTrustSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-[#EBEBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Clean Header - Zero AI Overhead Tags */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Trusted by developers and growing businesses
          </h2>
          <p className="text-sm sm:text-base text-[#6B6E68] font-medium leading-relaxed">
            See why engineering teams and agencies choose Oneallhost for mission-critical domain infrastructure.
          </p>
        </div>

        {/* Clean Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#FAFAF9] border border-[#EBEBE7] flex flex-col justify-between space-y-6 hover:border-[#DCDDD8] transition-all shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {[...Array(t.rating)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <p className="text-sm text-[#111111] font-medium leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#EBEBE7] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#111111]">{t.author}</div>
                  <div className="text-xs text-[#6B6E68] font-medium">{t.role}</div>
                </div>
                <div className="text-xs text-[#0D3B85] font-bold">{t.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
