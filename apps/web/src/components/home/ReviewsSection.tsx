'use client';

import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    author: 'Serge Nkembe',
    role: 'CTO, Kanza Tech',
    avatar: 'SN',
    rating: 5,
    quote: 'Sub-3-minute Anycast DNS propagation is real. Transferred 24 client domains with zero downtime.',
    domain: 'kanzatech.cm',
  },
  {
    author: 'Aisha Bello',
    role: 'Lead Engineer, PayAfrica',
    avatar: 'AB',
    rating: 5,
    quote: 'Native Mobile Money checkout made domain registration effortless for our engineering team.',
    domain: 'payafrica.africa',
  },
  {
    author: 'Michel Eboa',
    role: 'Fullstack Dev, Douala',
    avatar: 'ME',
    rating: 5,
    quote: 'Subdomain staging rentals with 100% conversion rebates saved our agency over $1,200.',
    domain: 'doualadevs.com',
  },
  {
    author: 'Kofi Mensah',
    role: 'DevOps, Ghana Cloud',
    avatar: 'KM',
    rating: 5,
    quote: 'Instant WHOIS privacy masking included free on all domains without hidden annual upsells.',
    domain: 'ghanacloud.org',
  },
  {
    author: 'David Omondi',
    role: 'Founder, Nairobi Staging',
    avatar: 'DO',
    rating: 5,
    quote: 'Direct mobile money integration is smooth. Instant payment confirmation in seconds.',
    domain: 'nairobistaging.co',
  },
  {
    author: 'Fatou Diop',
    role: 'Architect, Dakar Cloud',
    avatar: 'FD',
    rating: 5,
    quote: 'Top tier ICANN registrar experience. Automated DNS zone record management is flawless.',
    domain: 'dakarcloud.sn',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAFAF9] border-0 shadow-none font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10 text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
          Trusted by Developers &amp; Engineering Teams
        </h2>
      </div>

      {/* Trust Score & Customer Brand Strip */}
      <div className="max-w-4xl mx-auto px-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-2xs border border-[#F0F0EE]">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-[#111111]">4.7 / 5</span>
            <span className="text-[#6B6E68] ml-1">over 2.4M verified reviews</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
          <img src="/images/namecheap/figma-logo.svg" alt="Figma" className="h-5 w-auto grayscale object-contain" />
          <img src="/images/namecheap/imgur-logo.svg" alt="Imgur" className="h-5 w-auto grayscale object-contain" />
          <img src="/images/namecheap/privacy-logo.svg" alt="Privacy" className="h-5 w-auto grayscale object-contain" />
          <img src="/images/namecheap/buffer-logo.svg" alt="Buffer" className="h-5 w-auto grayscale object-contain" />
        </div>
      </div>

      {/* Contained, Smaller Review Flow (Not Full-Width) */}
      <div className="max-w-5xl mx-auto px-4 overflow-hidden py-2">
        <div className="animate-marquee-left flex items-center gap-4 whitespace-nowrap">
          {[...REVIEWS, ...REVIEWS].map((review, idx) => (
            <div
              key={idx}
              className="w-64 sm:w-72 p-4 rounded-xl bg-white border border-[#EBEBE7] shadow-2xs shrink-0 whitespace-normal space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0D3B85] text-white flex items-center justify-center font-bold text-[10px]">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-[#111111]">{review.author}</div>
                    <div className="text-[9px] text-[#6B6E68]">{review.role}</div>
                  </div>
                </div>
                <div className="flex items-center text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-[#555555] leading-relaxed italic">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="text-[9px] font-mono text-[#0D3B85]">
                {review.domain}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
