'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    title: 'Buy a domain',
    desc: 'Register a domain name and create your online identity. Use our advanced domain name generator to get your ideal choice right away. Already have a domain registered somewhere else? No problem — domain transfers are free and easy.',
    linkText: 'Discover all domain extensions',
    href: '/domains/domain-name-search',
    image: '/images/namecheap/buy-a-domain.svg',
  },
  {
    title: 'Find the right hosting for your domain',
    desc: 'Whether you want speed, simplicity, space, or super-power, we’ve got you covered. Choose from shared, VPS, dedicated, and Managed hosting for WordPress options. Or, try subdomain staging to get a personal site online.',
    linkText: 'Choose a hosting plan',
    href: '/hosting/shared',
    image: '/images/namecheap/find-a-hosting.svg',
  },
  {
    title: 'Add professional email',
    desc: 'Look pro and start sending emails from @yourwebsite.com. Get secure, reliable business email, complete with built-in calendar and AI email assistant, from just $11.88 a year.',
    linkText: 'Get business email',
    href: '/email',
    image: '/images/namecheap/add-email.svg',
  },
];

const WHY_US = [
  {
    title: 'Privacy and security',
    desc: 'Your website security and privacy comes first at Oneallhost, and we will always support the rights of individuals and consumers online. It’s our mission to keep the Internet open, free, and safe for everyone.',
    icon: 'fa-solid fa-user-shield',
    linkText: 'Website security',
    href: '/security',
  },
  {
    title: 'Your business online',
    desc: 'Boost your business with industry-premium products and services, at prices that won’t break your budget. If it doesn’t provide you with a better Internet experience, we simply don’t offer it.',
    icon: 'fa-solid fa-rocket',
    linkText: 'Explore services',
    href: '/hosting',
  },
  {
    title: 'Customer service',
    desc: 'You’re covered by a Support Team that’s renowned for being one of the most knowledgeable, friendly, and professional in the business. Real people are ready to assist you with any issue, any time, 24/7.',
    icon: 'fa-solid fa-headset',
    linkText: 'Support Team',
    href: '/dashboard/support',
  },
];

export const EveryStepFeatureSection: React.FC = () => {
  return (
    <div className="space-y-24 bg-[#FAFAF9] py-24 font-sans">
      {/* 1. Every Step to Online Success */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Every Step to Online Success
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6E68]">
            Domain name registration is only the beginning
          </p>
        </div>

        {/* Flat, Borderless, Shadowless Feature Rows */}
        <div className="space-y-20 max-w-5xl mx-auto">
          {STEPS.map((item, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-12 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="w-full md:w-1/2 flex justify-center shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full max-w-sm h-auto rounded-2xl"
                  />
                </div>

                <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] font-display">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B85] hover:text-[#1B6FC9] hover:underline"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Why Oneallhost: Simple — It's All About You */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 border-t border-[#EBEBE7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-display">
            Simple — It&apos;s All About You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {WHY_US.map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-xs border border-[#F0F0EE] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0D3B85] flex items-center justify-center">
                  <i className={`${card.icon} text-lg`} />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">{card.title}</h3>
                <p className="text-xs text-[#6B6E68] leading-relaxed">{card.desc}</p>
              </div>

              <div className="pt-2">
                <Link
                  href={card.href}
                  className="text-xs font-bold text-[#0D3B85] hover:underline inline-flex items-center gap-1"
                >
                  <span>{card.linkText}</span>
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 3 Visual Action Cards: Support, Discover, Transfer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link
            href="/dashboard/support"
            className="group bg-white p-6 rounded-2xl border border-[#F0F0EE] hover:border-[#0D3B85] hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-comments text-xl" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#111111] group-hover:text-[#0D3B85] transition-colors">
                24/7 Live Support
              </div>
              <p className="text-xs text-[#6B6E68]">Chat with knowledgeable specialists anytime.</p>
            </div>
          </Link>

          <Link
            href="/domains/full-tld-list"
            className="group bg-white p-6 rounded-2xl border border-[#F0F0EE] hover:border-[#0D3B85] hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0D3B85] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-compass text-xl" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#111111] group-hover:text-[#0D3B85] transition-colors">
                Discover All 400+ TLDs
              </div>
              <p className="text-xs text-[#6B6E68]">Explore pricing, rules, and launch dates.</p>
            </div>
          </Link>

          <Link
            href="/domains/transfer"
            className="group bg-white p-6 rounded-2xl border border-[#F0F0EE] hover:border-[#0D3B85] hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-arrow-right-arrow-left text-xl" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#111111] group-hover:text-[#0D3B85] transition-colors">
                Transfer Domains Free
              </div>
              <p className="text-xs text-[#6B6E68]">Move to Oneallhost with +1 Year renewal included.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};
