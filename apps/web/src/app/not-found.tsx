import React from 'react';
import Link from 'next/link';
import { BrandLogo, Button, Card } from '@oneallhost/ui';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <BrandLogo variant="mark-only" height={44} className="mx-auto" />

        <div>
          <div className="font-mono text-xs text-[#0D3B85] uppercase tracking-wider">Error 404</div>
          <h1 className="mt-2 text-xl font-medium text-[#111111]">Page Not Found</h1>
          <p className="mt-2 text-xs text-[#6B6E68] leading-relaxed">
            The requested route does not exist or has been relocated to another path.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="md" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to homepage</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
