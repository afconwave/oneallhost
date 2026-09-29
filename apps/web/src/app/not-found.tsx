import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F6F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-[340px] rounded-[28px] bg-white shadow-[0_18px_50px_rgba(9,31,68,0.12)] p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#E8EEF8] text-[#0D3B85] flex items-center justify-center text-lg font-black">404</div>
        <h1 className="text-[17px] font-extrabold text-[#111111]">Page not found</h1>
        <p className="mt-2 text-[12px] text-[#8A8F88] leading-relaxed">That link does not exist, or it moved.</p>
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <Link href="/support" className="h-11 rounded-full border border-[#E4E4E0] text-sm font-semibold leading-[2.75rem]">Support</Link>
          <Link href="/" className="h-11 rounded-full bg-[#0D3B85] text-white text-sm font-semibold leading-[2.75rem]">Home</Link>
        </div>
      </div>
    </div>
  );
}
