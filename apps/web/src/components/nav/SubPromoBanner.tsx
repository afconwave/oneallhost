'use client';

import React from 'react';
import Link from 'next/link';

export const SubPromoBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#0D3B85] via-[#7E5BEF] to-[#0D3B85] text-white text-[11px] sm:text-xs py-2 sm:py-2.5 px-3 sm:px-4 text-center font-bold leading-snug">
      <Link href="/domains" className="hover:underline inline-flex items-center justify-center gap-1.5 flex-wrap">
        <span>Grab your first .store domain for just $0.98 and any additional ones for $2.88.</span>
        <i className="fa-solid fa-arrow-right text-[10px] sm:text-[11px] shrink-0" />
      </Link>
    </div>
  );
};
