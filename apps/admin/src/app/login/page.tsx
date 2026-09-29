'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@oneallhost.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || 'Login failed');
      if (!data.user?.isStaff) throw new Error('Staff access required');
      localStorage.setItem(
        'oneallhost_admin_session',
        JSON.stringify({ token: data.token, email: data.user.email, role: data.user.staffRole })
      );
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#091F44] flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-2xl p-8 space-y-4 shadow-xl">
        <h1 className="text-lg font-bold text-[#091F44]">Admin sign in</h1>
        <p className="text-xs text-neutral-500">Use a staff account. Dev default password is DEV_ADMIN_PASSWORD.</p>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <input className="w-full border rounded-lg px-3 py-2 text-sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="w-full border rounded-lg px-3 py-2 text-sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" disabled={loading} className="w-full bg-[#0D3B85] text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
