'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Button } from '@oneallhost/ui';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (!requires2FA && username.toLowerCase().includes('2fa')) {
        setRequires2FA(true);
        return;
      }
      router.push('/dashboard');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F0F3F9]/40 text-[#111111] flex flex-col font-sans">
      {/* 1. Integrated Header */}
      <Header />

      {/* 2. Sub Breadcrumb Bar */}
      <div className="bg-[#EAEFF8] py-2.5 px-4 sm:px-8 text-xs font-semibold text-[#6B6E68]">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/dashboard" className="hover:text-[#0D3B85]">
            My Account
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-bold">Log in</span>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 sm:px-6">
        {/* 3. Centered Login Card matching Namecheap Architecture */}
        <div className="max-w-xl mx-auto bg-[#FAFAF9] rounded-2xl shadow-xs border border-[#EBEBE7] p-8 sm:p-10 space-y-6">
          {/* Card Title & Sign Up Link */}
          <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-4">
            <h1 className="text-2xl font-extrabold font-display text-[#111111]">
              Log in to your account
            </h1>
            <Link href="/auth/register" className="text-xs font-bold text-[#0D3B85] hover:underline">
              Sign up
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-[#6B6E68]">
            Enter your username and password to manage your domains, hosting, and staging environments.
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!requires2FA ? (
              <>
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111]">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
                    autoComplete="username"
                  />
                </div>

                {/* Password */}
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
                      placeholder="Enter your password"
                      className="w-full h-11 px-4 pr-11 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6E68] hover:text-[#111111]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Username or Password Link & Remember Me */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#6B6E68]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#DCDDD8] text-[#0D3B85] focus:ring-[#0D3B85]"
                    />
                    <span>Remember username</span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="font-bold text-[#0D3B85] hover:underline"
                  >
                    Forgot username or password?
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B85]">
                  <Shield className="w-4 h-4" />
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
                  className="w-full h-11 px-4 text-center tracking-widest text-base font-bold rounded-xl border border-[#DCDDD8] bg-white text-[#111111] focus:border-[#0D3B85] outline-none"
                  autoFocus
                />
              </div>
            )}

            {/* Red Action Button */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full h-12 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md font-display"
              >
                {requires2FA ? 'Verify & Continue' : 'Log in & continue'}
              </Button>
            </div>
          </form>
        </div>

        {/* 4. Live Support Help Strip */}
        <div className="max-w-xl mx-auto mt-8 p-4 rounded-2xl bg-[#EAEFF8] flex items-center justify-between text-xs text-[#111111] border border-[#CCE2FA]">
          <span className="font-semibold">Need help? We&apos;re always here for you.</span>
          <Link href="/dashboard/support">
            <Button variant="primary" className="h-9 px-4 bg-[#2C6E63] hover:bg-[#205249] text-white font-bold text-xs rounded-xl">
              Chat with a Live Person
            </Button>
          </Link>
        </div>
      </main>

      {/* 5. Integrated Footer */}
      <Footer />
    </div>
  );
}
