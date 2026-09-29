'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Button } from '@oneallhost/ui';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { rememberThisDevice, requestEmailOtp, resumeWithOtp } from '../../../lib/device-session';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [emailOtp, setEmailOtp] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [info, setInfo] = useState('');

  const finishLogin = async (token: string, emailResolved: string, name?: string) => {
    localStorage.setItem(
      'oneallhost_user_session',
      JSON.stringify({ username: emailResolved, name: name || emailResolved.split('@')[0], token, loggedIn: true, loginTime: new Date().toISOString() })
    );
    await rememberThisDevice();
    window.dispatchEvent(new Event('auth-changed'));
    router.push('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setInfo('');
    try {
      if (emailOtp) {
        await resumeWithOtp(username, twoFactorCode);
        await rememberThisDevice();
        router.push('/dashboard');
        return;
      }
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password, twoFactorCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }
      if (data.requires2FA) {
        setRequires2FA(true);
        return;
      }
      if (!data.token) {
        alert('Login failed: no session token returned');
        return;
      }
      await finishLogin(data.token, data.user?.email || username, data.user?.name);
    } catch (err: any) {
      alert(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailCode = async () => {
    if (!username.includes('@')) {
      alert('Enter your email first');
      return;
    }
    setIsLoading(true);
    try {
      await requestEmailOtp(username);
      setEmailOtp(true);
      setInfo('We sent a 6-digit code to your email.');
    } catch (err: any) {
      alert(err.message || 'Could not send email code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F9]/40 text-[#111111] flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-xl mx-auto bg-[#FAFAF9] rounded-2xl border border-[#EBEBE7] p-8 space-y-6">
          <h1 className="text-2xl font-extrabold">Log in</h1>
          {info ? <p className="text-xs text-[#0D3B85]">{info}</p> : null}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!requires2FA && !emailOtp ? (
              <>
                <input className="w-full h-11 px-4 rounded-xl border text-xs" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email" autoComplete="username" />
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="w-full h-11 px-4 pr-11 rounded-xl border text-xs" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6E68]">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="button" onClick={sendEmailCode} className="text-xs font-bold text-[#0D3B85]">
                  Session expired on this device? Email me a code
                </button>
              </>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B85]"><Shield className="w-4 h-4" /> {emailOtp ? 'Email code' : 'Authenticator code'}</div>
                <input type="text" maxLength={6} required value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} placeholder="123456" className="w-full h-11 text-center tracking-widest font-bold rounded-xl border" />
              </div>
            )}
            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full h-12 bg-[#D32F2F] text-white font-extrabold text-xs rounded-xl">
              {emailOtp || requires2FA ? 'Verify & continue' : 'Log in'}
            </Button>
          </form>
          <Link href="/auth/register" className="text-xs font-bold text-[#0D3B85]">Sign up</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
