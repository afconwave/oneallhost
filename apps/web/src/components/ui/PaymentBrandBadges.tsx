'use client';

import React from 'react';
import { GEO_CURRENCY_REGISTRY } from '../../lib/geoCurrency';

interface BadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MtnMomoBadge: React.FC<BadgeProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFCC00] text-black font-bold tracking-tight shadow-xs select-none ${
        isSm ? 'text-[10px] px-2 py-0.5' : isLg ? 'text-xs px-3 py-1.5' : 'text-[11px]'
      } ${className}`}
    >
      <div className="w-4 h-4 rounded-full bg-black text-[#FFCC00] flex items-center justify-center text-[9px] font-black leading-none">
        M
      </div>
      <span className="font-extrabold text-[#000000]">MTN MoMo</span>
    </div>
  );
};

export const OrangeMoneyBadge: React.FC<BadgeProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF7900] text-white font-bold tracking-tight shadow-xs select-none ${
        isSm ? 'text-[10px] px-2 py-0.5' : isLg ? 'text-xs px-3 py-1.5' : 'text-[11px]'
      } ${className}`}
    >
      <div className="w-3.5 h-3.5 bg-black rounded-xs flex items-center justify-center text-white text-[8px] font-black">
        O
      </div>
      <span className="font-bold text-white">orange money</span>
    </div>
  );
};

export const WaveBadge: React.FC<BadgeProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1DC3F9] text-white font-bold tracking-tight shadow-xs select-none ${
        isSm ? 'text-[10px] px-2 py-0.5' : isLg ? 'text-xs px-3 py-1.5' : 'text-[11px]'
      } ${className}`}
    >
      <div className="w-4 h-4 rounded-full bg-white text-[#1DC3F9] flex items-center justify-center text-[9px] font-black leading-none">
        W
      </div>
      <span className="font-extrabold text-white">Wave</span>
    </div>
  );
};

export const MpesaBadge: React.FC<BadgeProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#008751] text-white font-bold tracking-tight shadow-xs select-none ${
        isSm ? 'text-[10px] px-2 py-0.5' : isLg ? 'text-xs px-3 py-1.5' : 'text-[11px]'
      } ${className}`}
    >
      <div className="w-4 h-4 rounded-full bg-white text-[#E20613] flex items-center justify-center text-[9px] font-black leading-none">
        M
      </div>
      <span className="font-extrabold text-white">M-PESA</span>
    </div>
  );
};

export const AirtelMoneyBadge: React.FC<BadgeProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E20613] text-white font-bold tracking-tight shadow-xs select-none ${
        isSm ? 'text-[10px] px-2 py-0.5' : isLg ? 'text-xs px-3 py-1.5' : 'text-[11px]'
      } ${className}`}
    >
      <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center text-[#E20613] text-[8px] font-black">
        a
      </div>
      <span className="font-bold text-white">airtel money</span>
    </div>
  );
};

export const MoovMoneyBadge: React.FC<BadgeProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#005CA9] text-white font-bold tracking-tight shadow-xs select-none ${
        isSm ? 'text-[10px] px-2 py-0.5' : isLg ? 'text-xs px-3 py-1.5' : 'text-[11px]'
      } ${className}`}
    >
      <span className="font-extrabold text-[#FF7900]">MOOV</span>
      <span className="font-bold text-white">money</span>
    </div>
  );
};

export const VisaMastercardBadges: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Visa */}
      <div className="px-2 py-0.5 rounded bg-[#1A1F71] text-white font-black italic text-[10px] tracking-wider shadow-xs">
        VISA
      </div>
      {/* Mastercard */}
      <div className="flex items-center -space-x-1.5 px-1 py-0.5 bg-[#222222] rounded">
        <div className="w-3 h-3 rounded-full bg-[#EB001B]" />
        <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-90" />
      </div>
    </div>
  );
};

export const ApplePayBadge: React.FC<BadgeProps> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black text-white text-[11px] font-bold shadow-xs select-none ${className}`}>
      <i className="fa-brands fa-apple text-xs" />
      <span>Pay</span>
    </div>
  );
};

export const CryptoBadge: React.FC<BadgeProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#26A17B]/10 border border-[#26A17B]/30 text-[#0E7154] font-bold shadow-xs select-none ${
      isSm ? 'text-[10px] px-2 py-0.5' : 'text-[11px]'
    } ${className}`}>
      <img
        src="/images/payments/usdt-svgrepo-com.png"
        alt="USDT"
        className={isSm ? 'w-3.5 h-3.5 object-contain' : 'w-4 h-4 object-contain'}
      />
      <span className="font-extrabold text-[#111111]">USDT</span>
    </div>
  );
};

/**
 * Dynamic Local Payment Method Badge Renderer based on Country/Currency
 */
export const DynamicLocalPaymentBadges: React.FC<{
  countryCode?: string;
  currencyCode?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ countryCode = 'CM', currencyCode, className = '', size = 'md' }) => {
  const config =
    GEO_CURRENCY_REGISTRY[countryCode] ||
    Object.values(GEO_CURRENCY_REGISTRY).find((c) => c.currencyCode === currencyCode) ||
    GEO_CURRENCY_REGISTRY.GLOBAL;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {config.paymentMethods.map((pm) => {
        if (pm.logoType === 'mtn') return <MtnMomoBadge key={pm.id} size={size} />;
        if (pm.logoType === 'orange') return <OrangeMoneyBadge key={pm.id} size={size} />;
        if (pm.logoType === 'wave') return <WaveBadge key={pm.id} size={size} />;
        if (pm.logoType === 'mpesa') return <MpesaBadge key={pm.id} size={size} />;
        if (pm.logoType === 'airtel') return <AirtelMoneyBadge key={pm.id} size={size} />;
        if (pm.logoType === 'moov') return <MoovMoneyBadge key={pm.id} size={size} />;
        if (pm.logoType === 'card') return <VisaMastercardBadges key={pm.id} />;
        if (pm.logoType === 'apple_pay') return <ApplePayBadge key={pm.id} size={size} />;
        if (pm.logoType === 'crypto') return <CryptoBadge key={pm.id} size={size} />;
        return (
          <span key={pm.id} className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-[#111111]">
            {pm.name}
          </span>
        );
      })}
    </div>
  );
};
