'use client';

import React from 'react';

export const MtnMomoBadge: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md',
}) => {
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

export const OrangeMoneyBadge: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'sm',
}) => {
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

export const VisaMastercardBadges: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Visa */}
      <div className="px-2 py-0.5 rounded bg-[#1A1F71] text-white font-black italic text-[10px] tracking-wider shadow-xs">
        VISA
      </div>
      {/* Mastercard */}
      <div className="flex items-center -space-x-1.5 px-1 py-0.5">
        <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90" />
        <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
      </div>
    </div>
  );
};
