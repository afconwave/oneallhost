'use client';

import React from 'react';
import Link from 'next/link';

export const SubPromoBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#0D3B85] via-[#7E5BEF] to-[#0D3B85] text-white text-xs py-2.5 px-4 text-center font-bold">
      <Link href="/domains" className="hover:underline flex items-center justify-center gap-2">
        <span>Grab your first .store domain for just $0.98 and any additional ones for $2.88.</span>
        <i className="fa-solid fa-arrow-right text-[11px]" />
      </Link>
    </div>
  );
};
