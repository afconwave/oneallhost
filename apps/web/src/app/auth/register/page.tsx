'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Button } from '@oneallhost/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      try {
        localStorage.setItem(
          'oneallhost_user_session',
          JSON.stringify({ username: username || 'client@oneallhost.com', loggedIn: true, loginTime: new Date().toISOString() })
        );
        window.dispatchEvent(new Event('auth-changed'));
      } catch {}
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F0F3F9]/40 text-[#111111] flex flex-col font-sans">
      {/* 1. Integrated Header */}
      <Header />

      {/* 2. Sub Breadcrumb Bar */}
      <div className="bg-[#EAEFF8] py-2.5 px-4 sm:px-8 text-xs font-semibold text-[#6B6E68]">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/dashboard/profile" className="hover:text-[#0D3B85]">
            My Account
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-bold">Signup</span>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 sm:px-6">
        {/* 3. Centered Registration Card */}
        <div className="max-w-xl mx-auto bg-[#FAFAF9] rounded-2xl shadow-xs p-8 sm:p-10 space-y-6">
          {/* Card Title & Sign In Link */}
          <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-4">
            <h1 className="text-2xl font-extrabold font-display text-[#111111]">
              Create an account
            </h1>
            <Link href="/auth/login" className="text-xs font-bold text-[#0D3B85] hover:underline">
              Sign in
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-[#6B6E68]">
            New to Oneallhost? Quickly sign up for an account now.
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#111111]">
                  First name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#111111]">
                  Last name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
              />
            </div>

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
                placeholder="Enter username"
                className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter password again"
                className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none"
              />
            </div>

            {/* Newsletter Checkbox */}
            <div className="pt-2 flex items-start gap-2.5 text-xs text-[#6B6E68]">
              <input
                type="checkbox"
                id="newsletter"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-0.5 rounded border-[#DCDDD8] text-[#0D3B85] focus:ring-[#0D3B85]"
              />
              <label htmlFor="newsletter" className="leading-tight">
                Yes, sign me up for Oneallhost&apos;s newsletter &amp; Marketing Communication (optional)
              </label>
            </div>

            {/* Terms Disclaimer Text */}
            <div className="text-[11px] text-[#6B6E68] text-center pt-2">
              By creating an account, you agree with our{' '}
              <Link href="/terms" className="text-[#0D3B85] font-semibold hover:underline">
                Terms of Service
              </Link>
              .
            </div>

            {/* Red Action Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full h-12 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md font-display"
              >
                Create account &amp; continue
              </Button>
            </div>
          </form>
        </div>

        {/* 4. Live Support Help Strip */}
        <div className="max-w-xl mx-auto mt-8 p-4 rounded-2xl bg-[#EAEFF8] flex items-center justify-between text-xs text-[#111111]">
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
