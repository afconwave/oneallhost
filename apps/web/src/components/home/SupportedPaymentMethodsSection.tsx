'use client';

import React from 'react';

const PAYMENT_METHODS = [
  { name: 'MTN MoMo', file: '/images/payments/mtn-momo.svg' },
  { name: 'Orange Money', file: '/images/payments/orange-money.svg' },
  { name: 'Wave Mobile', file: '/images/payments/wave.svg' },
  { name: 'Moov Money', file: '/images/payments/moov-money.svg' },
  { name: 'Airtel Money', file: '/images/payments/airtel-money.svg' },
  { name: 'Express Union', file: '/images/payments/express-union.svg' },
  { name: 'Visa', file: '/images/payments/visa.svg' },
  { name: 'Mastercard', file: '/images/payments/mastercard.svg' },
  { name: 'Tether USDT', file: '/images/payments/usdt-svgrepo-com.png' },
];

export const SupportedPaymentMethodsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAFAF9] border-t border-[#EBEBE7] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
            Instant Checkout in Local &amp; Global Currencies
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6E68] max-w-xl mx-auto font-medium">
            Auto-detected regional currencies with native Mobile Money, Cards, Bank Transfer, and Tether USDT.
          </p>
        </div>

        {/* Static Clean Centered Block Design (No Flow / No Marquee) */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {PAYMENT_METHODS.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-center h-10 px-2 transition-transform hover:scale-105"
            >
              <img
                src={item.file}
                alt={item.name}
                title={item.name}
                className="h-7 sm:h-8 w-auto max-w-[100px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
