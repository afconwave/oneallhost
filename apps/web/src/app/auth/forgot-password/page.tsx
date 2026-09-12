'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Button } from '@oneallhost/ui';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [resetType, setResetType] = useState<'password' | 'username'>('password');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
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
          <span className="text-[#111111] font-bold">Reset Password &amp; Username</span>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 sm:px-6">
        {/* 3. Centered Reset Card */}
        <div className="max-w-xl mx-auto bg-[#FAFAF9] rounded-2xl shadow-xs border border-[#EBEBE7] p-8 sm:p-10 space-y-6">
          {/* Card Title & Log In Link */}
          <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-4">
            <h1 className="text-2xl font-extrabold font-display text-[#111111]">
              {resetType === 'password' ? 'Reset your password' : 'Find your username'}
            </h1>
            <Link href="/auth/login" className="text-xs font-bold text-[#0D3B85] hover:underline">
              Log in
            </Link>
          </div>

          {/* Reset Type Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#EBEBE7] rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setResetType('password'); setIsSubmitted(false); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                resetType === 'password'
                  ? 'bg-white text-[#111111] shadow-2xs'
                  : 'text-[#6B6E68] hover:text-[#111111]'
              }`}
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => { setResetType('username'); setIsSubmitted(false); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                resetType === 'username'
                  ? 'bg-white text-[#111111] shadow-2xs'
                  : 'text-[#6B6E68] hover:text-[#111111]'
              }`}
            >
              Find Username
            </button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs sm:text-sm text-[#6B6E68]">
                {resetType === 'password'
                  ? 'Enter your username or verified email address. We will send you instructions to safely reset your password.'
                  : 'Enter the email address associated with your Oneallhost account to receive your username reminder.'}
              </p>

              {resetType === 'password' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111]">
                    Username or Email Address
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111]">
                    Verified Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
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
                  {resetType === 'password' ? 'Send Password Reset Link' : 'Send Username Reminder'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#111111] font-display">Check your inbox</h2>
                <p className="text-xs text-[#6B6E68] leading-relaxed max-w-sm mx-auto">
                  We have sent instructions to your verified email address if an active account is matched.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EBEBE7]">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full h-11 text-xs font-bold rounded-xl">
                    Back to Log in
                  </Button>
                </Link>
              </div>
            </div>
          )}
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
