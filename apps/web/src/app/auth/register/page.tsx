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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || username;
    const targetEmail = email || username;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email: targetEmail, username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        alert(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }
      localStorage.setItem(
        'oneallhost_user_session',
        JSON.stringify({
          username: data.user?.email || targetEmail,
          name: data.user?.name || fullName,
          token: data.token,
          loggedIn: true,
          loginTime: new Date().toISOString(),
        })
      );
      window.dispatchEvent(new Event('auth-changed'));
      router.push('/dashboard');
    } catch {
      alert('Registration failed. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F9]/40 text-[#111111] flex flex-col font-sans">
      <Header />
      <div className="bg-[#EAEFF8] py-2.5 px-4 sm:px-8 text-xs font-semibold text-[#6B6E68]">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/dashboard/profile" className="hover:text-[#0D3B85]">My Account</Link>
          <span>/</span>
          <span className="text-[#111111] font-bold">Signup</span>
        </div>
      </div>
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-[#FAFAF9] rounded-2xl shadow-xs p-8 sm:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-4">
            <h1 className="text-2xl font-extrabold font-display text-[#111111]">Create an account</h1>
            <Link href="/auth/login" className="text-xs font-bold text-[#0D3B85] hover:underline">Sign in</Link>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#111111]">First name</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#111111]">Last name</label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111111]">Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Enter password again" className="w-full h-11 px-4 rounded-xl border border-[#DCDDD8] bg-white text-xs outline-none" />
            </div>
            <div className="pt-2 flex items-start gap-2.5 text-xs text-[#6B6E68]">
              <input type="checkbox" id="newsletter" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-0.5" />
              <label htmlFor="newsletter">Yes, sign me up for Oneallhost's newsletter (optional)</label>
            </div>
            <div className="text-[11px] text-[#6B6E68] text-center pt-2">
              By creating an account, you agree with our <Link href="/terms" className="text-[#0D3B85] font-semibold hover:underline">Terms of Service</Link>.
            </div>
            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full h-12 bg-[#D32F2F] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl">
              Create account & continue
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
