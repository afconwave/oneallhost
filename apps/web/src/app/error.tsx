'use client';

import React from 'react';
import { BrandLogo, Button } from '@oneallhost/ui';
import { RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <BrandLogo variant="mark-only" height={44} className="mx-auto" />

        <div>
          <div className="font-mono text-xs text-red-600 uppercase tracking-wider">Service Exception</div>
          <h1 className="mt-2 text-xl font-medium text-[#111111]">Action Could Not Complete</h1>
          <p className="mt-2 text-xs text-[#6B6E68] leading-relaxed">
            The system encountered an error executing this request. Please retry or contact support if the issue persists.
          </p>
        </div>

        <div className="pt-2">
          <Button variant="primary" size="md" className="gap-2" onClick={() => reset()}>
            <RotateCcw className="w-4 h-4" />
            <span>Retry action</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
