'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Cookie, ToggleLeft, ToggleRight, Check, Save } from 'lucide-react';

export const CookiePreferencesContent: React.FC = () => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('oneallhost_cookie_consent');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.analytics !== undefined) setAnalyticsEnabled(parsed.analytics);
        if (parsed.marketing !== undefined) setMarketingEnabled(parsed.marketing);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'oneallhost_cookie_consent',
      JSON.stringify({
        essential: true,
        analytics: analyticsEnabled,
        marketing: marketingEnabled,
        savedAt: new Date().toISOString(),
      })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#111111] font-sans">
      <Header />

      {/* Header Banner */}
      <section className="bg-[#091F44] text-white py-14 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
            <Cookie className="w-3.5 h-3.5 text-[#FF5A27]" />
            <span>Consent &amp; Privacy Management</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Cookie Preferences
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80">
            Control which cookies and telemetry technologies Oneallhost uses during your browsing sessions.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Essential Cookies (Always Active) */}
          <div className="bg-white p-6 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#111111]">Strictly Necessary &amp; Essential Cookies</h3>
                <p className="text-xs text-[#6B6E68] mt-0.5">
                  Required for core site security, shopping cart persistence, session tokens, and Anycast DNS telemetry.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F8F3] text-[#008A5E] shrink-0">
                ALWAYS ACTIVE
              </span>
            </div>
          </div>

          {/* Analytical Cookies */}
          <div className="bg-white p-6 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <h3 className="font-bold text-sm text-[#111111]">Performance &amp; Analytics Cookies</h3>
                <p className="text-xs text-[#6B6E68] mt-0.5">
                  Help us understand how users navigate domain search results and monitor server response latencies.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className="cursor-pointer shrink-0"
              >
                {analyticsEnabled ? (
                  <ToggleRight className="w-8 h-8 text-[#008A5E]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="bg-white p-6 rounded-2xl border border-[#F0F0EE] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <h3 className="font-bold text-sm text-[#111111]">Personalized Marketing &amp; Promotion Cookies</h3>
                <p className="text-xs text-[#6B6E68] mt-0.5">
                  Used to deliver relevant TLD discounts, renewal reminders, and promotional codes based on your interests.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMarketingEnabled(!marketingEnabled)}
                className="cursor-pointer shrink-0"
              >
                {marketingEnabled ? (
                  <ToggleRight className="w-8 h-8 text-[#008A5E]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="h-11 px-6 bg-[#0D3B85] hover:bg-[#1B6FC9] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Cookie Preferences</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-[#008A5E] flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved successfully!
              </span>
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};
