'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo, Button, Input, Card, Badge } from '@oneallhost/ui';
import { ShieldCheck, Lock, Smartphone } from 'lucide-react';

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <BrandLogo variant="horizontal" height={34} />
        </Link>
        <h2 className="mt-4 text-xl font-medium text-[#111111]">
          Two-Factor Authentication
        </h2>
        <p className="mt-1 text-xs text-[#6B6E68]">
          Enter the 6-digit code from your authenticator app (Google Authenticator / 1Password)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card elevation="surface-1" className="p-6 sm:p-8 space-y-5">
          <div className="w-10 h-10 rounded-full bg-[#EDF5FD] border border-[#CCE2FA] flex items-center justify-center text-[#1B6FC9] mx-auto">
            <Smartphone className="w-5 h-5" />
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#111111] block mb-1 text-center">
                6-Digit Security Passcode
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCode(e.target.value.replace(/[^0-9]/g, ''))
                }
                placeholder="000000"
                className="w-full h-12 text-center font-mono text-xl tracking-widest bg-white border border-[#DCDDD8] rounded focus:outline-none focus:border-[#1B6FC9]"
                required
              />
            </div>

            <Button variant="primary" size="md" className="w-full" isLoading={isVerifying}>
              Verify security code
            </Button>
          </form>

          <div className="pt-3 border-t border-[#EBEBE7] text-center text-xs text-[#6B6E68]">
            <Link href="/auth/login" className="text-[#1B6FC9] hover:underline">
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
