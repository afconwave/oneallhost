'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo, Button } from '@oneallhost/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the Terms of Service to continue.');
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SIDE: Clean Visual Background with High-Tech Photography */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 text-white bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            'url("/images/DomainandHosting/hostingservers.png")',
        }}
      >
        {/* Deep Royal Blue Backdrop Overlay for maximum contrast */}
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
                CLIENT ACCOUNT BENEFITS
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#7CB342] text-white">
                FREE SETUP
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold font-display text-white">
                Launch in Minutes
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Register permanent domains with free WHOIS privacy or lease staging subdomains with 100% purchase rebates.
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/15 text-xs text-white">
              <div className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-[#7CB342]" />
                <span>Full Anycast DNS Zone file management</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-[#7CB342]" />
                <span>Automated MTN MoMo & Orange Money billing</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-[#7CB342]" />
                <span>60-Day Transfer Lock & EPP Auth-Code control</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-10 text-xs text-blue-100/70 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Oneallhost Inc.</span>
          <span>ICANN Accredited Infrastructure</span>
        </div>
      </div>

      {/* RIGHT SIDE: Clean High-Trust Registration Form */}
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
              Create your account
            </h1>
            <p className="text-sm text-[#6B6E68]">
              Get started with ICANN domain registration and short-term staging.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aloah Milton"
                className="w-full h-12 px-4 rounded-xl border border-[#DCDDD8] bg-white text-sm text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-xs font-bold text-[#111111]">
                  Phone (MoMo / Orange)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="675405180"
                  className="w-full h-12 px-4 rounded-xl border border-[#DCDDD8] bg-white text-sm text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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

            <div className="pt-2 flex items-start gap-2 text-xs text-[#6B6E68]">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#DCDDD8] text-[#0D3B85] focus:ring-[#0D3B85]"
              />
              <label htmlFor="agree">
                I agree to the{' '}
                <Link href="/terms" className="text-[#0D3B85] font-semibold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#0D3B85] font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full h-12 bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-sm rounded-xl shadow-sm mt-2"
              isLoading={isLoading}
            >
              <span>Create Account</span>
            </Button>
          </form>

          <div className="pt-4 border-t border-[#EBEBE7] text-center text-xs text-[#6B6E68]">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-[#0D3B85] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
