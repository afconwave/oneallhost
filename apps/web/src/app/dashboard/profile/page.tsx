'use client';

import React, { useState, useEffect } from 'react';
import { Button, Badge } from '@oneallhost/ui';
import { User, ShieldCheck, KeyRound, Smartphone, Mail, Globe, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  preferredCurrency: 'USD' | 'XAF';
  twoFactorEnabled: boolean;
  kycStatus: string;
  createdAt: string;
}

export default function ProfileManagementPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form edit state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'XAF'>('USD');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 2FA state
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/v1/users/me');
      if (!res.ok) throw new Error('Failed to load user profile from server');
      const data = await res.json();
      if (data && data.user) {
        setProfile(data.user);
        setName(data.user.name || '');
        setPhone(data.user.phone || '');
        setCurrency(data.user.preferredCurrency || 'USD');
      }
    } catch (err: any) {
      console.error('[Profile Fetch Error]', err);
      setError(err.message || 'Unable to connect to Profile API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('http://localhost:4000/api/v1/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          preferredCurrency: currency,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('[Profile Update Error]', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/users/2fa/enable', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setTwoFactorSecret(data.secret);
        setProfile((prev) => prev ? { ...prev, twoFactorEnabled: true } : null);
      }
    } finally {
      setIsEnabling2FA(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBEBE7] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-display">Account Profile & Security</h1>
          <p className="text-xs text-[#6B6E68] mt-1">
            Manage your registrant identity, mobile billing numbers, and multi-factor security.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchProfile}
          className="text-xs font-semibold gap-1.5 border-[#DCDDD8]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* STATE 1: LOADING SKELETON */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-44 bg-gray-100 rounded-2xl border border-gray-200" />
          <div className="h-44 bg-gray-100 rounded-2xl border border-gray-200" />
        </div>
      )}

      {/* STATE 2: ERROR STATE WITH RETRY */}
      {!isLoading && error && (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="text-sm font-bold text-red-900">Profile Service Unavailable</h3>
          <p className="text-xs text-red-700 max-w-sm mx-auto">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchProfile} className="bg-red-700 hover:bg-red-800 text-xs">
            Retry Connection
          </Button>
        </div>
      )}

      {/* STATES 3 & 4: POPULATED PROFILE FORM */}
      {!isLoading && !error && profile && (
        <div className="space-y-8">
          {/* Section 1: Personal Profile Details */}
          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-4">
              <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <User className="w-4 h-4 text-[#0D3B85]" />
                <span>Registrant Profile Information</span>
              </h2>
              <Badge variant="success">Verified Registrant</Badge>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111111] block">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#DCDDD8] text-xs bg-white text-[#111111] focus:border-[#0D3B85] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111111] block">Account Email</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EBEBE7] text-xs bg-[#FAFAF9] text-[#6B6E68] cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111111] block">Mobile Money Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="675405180"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#DCDDD8] text-xs bg-white text-[#111111] focus:border-[#0D3B85] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#111111] block">Preferred Invoicing Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-[#DCDDD8] text-xs bg-white text-[#111111] focus:border-[#0D3B85] outline-none"
                  >
                    <option value="USD">USD ($ - United States Dollar)</option>
                    <option value="XAF">XAF (FCFA - Central African Franc)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  className="bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs px-5 h-10 rounded-xl"
                >
                  Save Profile Changes
                </Button>

                {saveSuccess && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Profile updated successfully
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Section 2: Two-Factor Authentication (2FA TOTP) */}
          <div className="p-6 rounded-2xl bg-white border border-[#EBEBE7] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-4">
              <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0D3B85]" />
                <span>Multi-Factor Authentication (2FA TOTP)</span>
              </h2>
              {profile.twoFactorEnabled ? (
                <Badge variant="success">2FA Active</Badge>
              ) : (
                <Badge variant="warning">Disabled</Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#111111]">Authenticator App Protection</div>
                <p className="text-xs text-[#6B6E68]">
                  Require a 6-digit TOTP verification code from Google Authenticator or Authy when signing in.
                </p>
              </div>

              {!profile.twoFactorEnabled ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEnable2FA}
                  isLoading={isEnabling2FA}
                  className="text-xs font-bold border-[#DCDDD8] text-[#0D3B85] shrink-0"
                >
                  Enable 2FA Protection
                </Button>
              ) : (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Account Secured
                </span>
              )}
            </div>

            {twoFactorSecret && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-2">
                <div className="font-bold text-[#0D3B85]">Manual Setup Key:</div>
                <div className="font-mono bg-white p-2 rounded border border-blue-200 text-sm font-bold tracking-widest text-[#0D3B85]">
                  {twoFactorSecret}
                </div>
                <div className="text-[11px] text-[#6B6E68]">
                  Add this key to your authenticator app to complete 2FA setup.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
