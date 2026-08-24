'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo, Button } from '@oneallhost/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (!requires2FA && email.includes('2fa')) {
        setRequires2FA(true);
        return;
      }
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE: Clean Visual Background with High-Tech Photography */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 text-white bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            'url("/images/DomainandHosting/lookuptooneallhost.png")',
        }}
      >
        {/* Deep Royal Blue Backdrop Overlay for maximum legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#091F44]/95 via-[#0D3B85]/90 to-[#091F44]/95 backdrop-blur-[2px]" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/">
            <BrandLogo variant="horizontal" height={44} />
          </Link>
        </div>

        {/* Center High-Impact Visual Card */}
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7CB342] font-mono tracking-wide">
                ANYCAST CLOUD REGISTRY
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live 100% SLA
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold font-display text-white">
                Direct Domain Management
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Control your DNS zone records, WHOIS identity masking, 60-day transfer locks, and subdomain leases with zero latency.
              </p>
            </div>

            <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-200 font-medium">
              <span>Sub-3-minute Anycast DNS</span>
              <span className="font-bold text-white">150+ Edge Nodes</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-blue-100/80">
            <div className="flex items-center gap-2">
              <i className="bi bi-shield-check text-[#7CB342] text-sm" />
              <span>256-Bit SSL Encrypted Session</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-phone-fill text-amber-400 text-sm" />
              <span>Native MTN MoMo & Orange Money Checkout</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-10 text-xs text-blue-100/70 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Oneallhost Inc.</span>
          <span>ICANN Accredited Infrastructure</span>
        </div>
      </div>

      {/* RIGHT SIDE: Clean High-Trust Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Mobile Logo Only */}
          <div className="lg:hidden">
            <Link href="/">
              <BrandLogo variant="horizontal" height={40} />
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#111111] font-display">
              Welcome back
            </h1>
            <p className="text-sm text-[#6B6E68]">
              Sign in to manage your domains, staging subdomains, and DNS records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!requires2FA ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full h-12 px-4 rounded-xl border border-[#DCDDD8] bg-white text-sm text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#111111]">
                      Password
                    </label>
                    <Link href="/auth/forgot-password" className="text-xs text-[#0D3B85] font-semibold hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 px-4 pr-11 rounded-xl border border-[#DCDDD8] bg-white text-sm text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6E68] hover:text-[#111111]"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-sm`} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B85]">
                  <i className="bi bi-shield-lock-fill text-base" />
                  <span>Two-Factor Authentication Required</span>
                </div>
                <p className="text-xs text-[#6B6E68]">
                  Enter the 6-digit TOTP code from your authenticator app.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="123456"
                  className="w-full h-12 px-4 text-center tracking-widest text-lg font-bold rounded-xl border border-[#DCDDD8] bg-white text-[#111111] focus:border-[#0D3B85] outline-none"
                  autoFocus
                />
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full h-12 bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-sm rounded-xl shadow-sm"
              isLoading={isLoading}
            >
              <span>{requires2FA ? 'Verify & Sign In' : 'Sign In to Portal'}</span>
            </Button>
          </form>

          <div className="pt-4 border-t border-[#EBEBE7] text-center text-xs text-[#6B6E68]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-bold text-[#0D3B85] hover:underline">
              Create Client Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
