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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password, twoFactorCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }
      if (data.requires2FA) {
        setRequires2FA(true);
        setIsLoading(false);
        return;
      }

      if (!data.token) {
        alert('Login failed: no session token returned');
        setIsLoading(false);
        return;
      }
      const emailResolved = data.user?.email || username;
      localStorage.setItem(
        'oneallhost_user_session',
        JSON.stringify({
          username: emailResolved,
          name: data.user?.name || username.split('@')[0],
          token: data.token,
          loggedIn: true,
          loginTime: new Date().toISOString(),
        })
      );
      window.dispatchEvent(new Event('auth-changed'));
      router.push('/dashboard');
    } catch {
      alert('Login failed. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F9]/40 text-[#111111] flex flex-col font-sans">
      <Header />
      <div className="bg-[#EAEFF8] py-2.5 px-4 sm:px-8 text-xs font-semibold text-[#6B6E68]">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/dashboard" className="hover:text-[#0D3B85]">My Account</Link>
          <span>/</span>
          <span className="text-[#111111] font-bold">Log in</span>
        </div>
      </div>
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-[#FAFAF9] rounded-2xl shadow-xs border border-[#EBEBE7] p-8 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-4">
            <h1 className="text-2xl font-extrabold font-display text-[#111111]">Log in to your account</h1>
            <Link href="/auth/register" className="text-xs font-bold text-[#0D3B85] hover:underline">Sign up</Link>
          </div>
          <p className="text-xs sm:text-sm text-[#6B6E68]">Enter your username and password to manage your domains, hosting, and staging environments.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!requires2FA ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111]">Username</label>
                  <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username or email" className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none" autoComplete="username" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111]">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full h-11 px-4 pr-11 rounded-xl border border-[#DCDDD8] bg-white text-xs text-[#111111] placeholder:text-[#6B6E68] focus:border-[#0D3B85] outline-none" autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6E68] hover:text-[#111111]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#6B6E68]">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-[#DCDDD8] text-[#0D3B85] focus:ring-[#0D3B85]" />
                    <span>Remember username</span>
                  </label>
                  <Link href="/auth/forgot-password" className="font-bold text-[#0D3B85] hover:underline">Forgot username or password?</Link>
                </div>
              </>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B85]">
                  <Shield className="w-4 h-4" />
                  <span>Two-Factor Authentication Required</span>
                </div>
                <p className="text-xs text-[#6B6E68]">Enter the 6-digit TOTP code from your authenticator app.</p>
                <input type="text" maxLength={6} required value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} placeholder="123456" className="w-full h-11 px-4 text-center tracking-widest text-base font-bold rounded-xl border border-[#DCDDD8] bg-white text-[#111111] focus:border-[#0D3B85] outline-none" autoFocus />
              </div>
            )}
            <div className="pt-3">
              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full h-12 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md font-display">
                {requires2FA ? 'Verify & Continue' : 'Log in & continue'}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
