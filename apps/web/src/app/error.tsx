'use client';

import React from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#F6F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-[340px] rounded-[28px] bg-white shadow-[0_18px_50px_rgba(9,31,68,0.12)] p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#FDECEC] text-[#E53935] flex items-center justify-center text-2xl font-black">!</div>
        <h1 className="text-[17px] font-extrabold text-[#111111]">Something went wrong</h1>
        <p className="mt-2 text-[12px] text-[#8A8F88] leading-relaxed">
          {error.message && error.message.length < 140 ? error.message : 'This request could not finish. Try again.'}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <a href="/support" className="h-11 rounded-full border border-[#E4E4E0] text-sm font-semibold leading-[2.75rem]">Support</a>
          <button type="button" onClick={() => reset()} className="h-11 rounded-full bg-[#0D3B85] text-white text-sm font-semibold">Retry</button>
        </div>
      </div>
    </div>
  );
}
