'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo, Button } from '@oneallhost/ui';

export const Header: React.FC = () => {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'XAF'>('USD');
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);

  // Quick sign-in state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsCurrencyOpen(false);
        setIsLangOpen(false);
        setIsAuthDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setIsCurrencyOpen(false);
    setIsLangOpen(false);
    setIsAuthDropdownOpen(false);
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setTimeout(() => {
      setIsSubmittingLogin(false);
      router.push('/dashboard');
    }, 600);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#EBEBE7] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between" ref={navRef}>
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center shrink-0">
            <BrandLogo variant="horizontal" height={40} />
          </Link>

          {/* Desktop Navigation with 5 Real Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#111111]">
            {/* 1. DOMAINS */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle('domains')}
                onMouseEnter={() => { setActiveDropdown('domains'); setIsAuthDropdownOpen(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                  activeDropdown === 'domains' ? 'bg-[#FAFAF9] text-[#0D3B85]' : 'hover:bg-[#FAFAF9]'
                }`}
              >
                <span>Domains</span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${activeDropdown === 'domains' ? 'rotate-180 text-[#0D3B85]' : 'text-[#6B6E68]'}`} />
              </button>

              {activeDropdown === 'domains' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl border border-[#EBEBE7] shadow-xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/#domains"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAF9] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0D3B85] group-hover:text-white transition-colors">
                      <i className="fa-solid fa-globe text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#111111]">Register a Domain</div>
                      <div className="text-[11px] text-[#6B6E68]">400+ extensions with live Namecheap XML</div>
                    </div>
                  </Link>

                  <Link
                    href="/transfer"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAF9] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#7CB342] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#7CB342] group-hover:text-white transition-colors">
                      <i className="fa-solid fa-bolt text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#111111] flex items-center gap-1.5">
                        <span>Transfer a Domain</span>
                        <span className="px-1.5 py-0.2 bg-[#7CB342] text-white rounded text-[9px] font-bold">+1 YR FREE</span>
                      </div>
                      <div className="text-[11px] text-[#6B6E68]">Seamless transfer with EPP auth code</div>
                    </div>
                  </Link>

                  <Link
                    href="/whois"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAF9] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-[#111111] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                      <i className="fa-solid fa-shield-halved text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#111111]">WHOIS Lookup</div>
                      <div className="text-[11px] text-[#6B6E68]">Verify domain ownership & DNS privacy</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. RENTALS */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle('rentals')}
                onMouseEnter={() => { setActiveDropdown('rentals'); setIsAuthDropdownOpen(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                  activeDropdown === 'rentals' ? 'bg-[#FAFAF9] text-[#0D3B85]' : 'hover:bg-[#FAFAF9]'
                }`}
              >
                <span>Rentals</span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${activeDropdown === 'rentals' ? 'rotate-180 text-[#0D3B85]' : 'text-[#6B6E68]'}`} />
              </button>

              {activeDropdown === 'rentals' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl border border-[#EBEBE7] shadow-xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/rentals"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAF9] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#7CB342] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#7CB342] group-hover:text-white transition-colors">
                      <i className="fa-solid fa-arrows-rotate text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#111111]">Subdomain Leases (100% Rebate)</div>
                      <div className="text-[11px] text-[#6B6E68]">All lease fees credited on purchase</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. HOSTING */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle('hosting')}
                onMouseEnter={() => { setActiveDropdown('hosting'); setIsAuthDropdownOpen(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                  activeDropdown === 'hosting' ? 'bg-[#FAFAF9] text-[#0D3B85]' : 'hover:bg-[#FAFAF9]'
                }`}
              >
                <span>Hosting</span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${activeDropdown === 'hosting' ? 'rotate-180 text-[#0D3B85]' : 'text-[#6B6E68]'}`} />
              </button>

              {activeDropdown === 'hosting' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl border border-[#EBEBE7] shadow-xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/hosting-waitlist"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAF9] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0D3B85] group-hover:text-white transition-colors">
                      <i className="fa-solid fa-server text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#111111] flex items-center gap-1.5">
                        <span>Cloud Hosting</span>
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[9px] font-bold">EARLY ACCESS</span>
                      </div>
                      <div className="text-[11px] text-[#6B6E68]">NVMe SSD with Yaoundé & European edge</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. RESOURCES */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle('resources')}
                onMouseEnter={() => { setActiveDropdown('resources'); setIsAuthDropdownOpen(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                  activeDropdown === 'resources' ? 'bg-[#FAFAF9] text-[#0D3B85]' : 'hover:bg-[#FAFAF9]'
                }`}
              >
                <span>Resources</span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-[#0D3B85]' : 'text-[#6B6E68]'}`} />
              </button>

              {activeDropdown === 'resources' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl border border-[#EBEBE7] shadow-xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/dashboard/support"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAF9] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fa-solid fa-circle-question text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#111111]">Support & Help Desk</div>
                      <div className="text-[11px] text-[#6B6E68]">24/7 technical assistance</div>
                    </div>
                  </Link>
                  <a
                    href="http://localhost:4000/api/v1"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAF9] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fa-solid fa-code text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#111111]">Developer API</div>
                      <div className="text-[11px] text-[#6B6E68]">Domain & DNS automation</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* 5. COMPANY */}
            <div className="relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle('company')}
                onMouseEnter={() => { setActiveDropdown('company'); setIsAuthDropdownOpen(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                  activeDropdown === 'company' ? 'bg-[#FAFAF9] text-[#0D3B85]' : 'hover:bg-[#FAFAF9]'
                }`}
              >
                <span>Company</span>
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${activeDropdown === 'company' ? 'rotate-180 text-[#0D3B85]' : 'text-[#6B6E68]'}`} />
              </button>

              {activeDropdown === 'company' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl border border-[#EBEBE7] shadow-xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/about"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#FAFAF9] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0D3B85] flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fa-solid fa-building text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#111111]">About Oneallhost</div>
                      <div className="text-[11px] text-[#6B6E68]">Our vision & Anycast infrastructure</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Side: Currency, Language & Interactive Sign In Dropdown */}
        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsCurrencyOpen(!isCurrencyOpen);
                setIsLangOpen(false);
                setActiveDropdown(null);
                setIsAuthDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#EBEBE7] text-xs font-bold text-[#111111] hover:bg-[#FAFAF9]"
            >
              <span>{currency === 'USD' ? 'USD ($)' : 'XAF (FCFA)'}</span>
              <i className="fa-solid fa-chevron-down text-[10px] text-[#6B6E68]" />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-[#EBEBE7] shadow-lg p-1.5 space-y-0.5 text-xs z-50">
                <button
                  type="button"
                  onClick={() => {
                    setCurrency('USD');
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-semibold ${
                    currency === 'USD' ? 'bg-blue-50 text-[#0D3B85]' : 'hover:bg-[#FAFAF9] text-[#111111]'
                  }`}
                >
                  <span>USD ($)</span>
                  {currency === 'USD' && <i className="fa-solid fa-check text-[#0D3B85]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrency('XAF');
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-semibold ${
                    currency === 'XAF' ? 'bg-blue-50 text-[#0D3B85]' : 'hover:bg-[#FAFAF9] text-[#111111]'
                  }`}
                >
                  <span>XAF (FCFA)</span>
                  {currency === 'XAF' && <i className="fa-solid fa-check text-[#0D3B85]" />}
                </button>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsCurrencyOpen(false);
                setActiveDropdown(null);
                setIsAuthDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#EBEBE7] text-xs font-bold text-[#111111] hover:bg-[#FAFAF9]"
            >
              <span>{language}</span>
              <i className="fa-solid fa-chevron-down text-[10px] text-[#6B6E68]" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-[#EBEBE7] shadow-lg p-1.5 space-y-0.5 text-xs z-50">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('EN');
                    setIsLangOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-semibold ${
                    language === 'EN' ? 'bg-blue-50 text-[#0D3B85]' : 'hover:bg-[#FAFAF9] text-[#111111]'
                  }`}
                >
                  <span>English (EN)</span>
                  {language === 'EN' && <i className="fa-solid fa-check text-[#0D3B85]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('FR');
                    setIsLangOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg font-semibold ${
                    language === 'FR' ? 'bg-blue-50 text-[#0D3B85]' : 'hover:bg-[#FAFAF9] text-[#111111]'
                  }`}
                >
                  <span>Français (FR)</span>
                  {language === 'FR' && <i className="fa-solid fa-check text-[#0D3B85]" />}
                </button>
              </div>
            )}
          </div>

          {/* Hover / Click Dropdown Login Form */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
              onMouseEnter={() => {
                setIsAuthDropdownOpen(true);
                setActiveDropdown(null);
                setIsCurrencyOpen(false);
                setIsLangOpen(false);
              }}
              className="h-10 px-5 bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs text-white rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <i className="fa-solid fa-user-lock text-xs" />
              <span>Client Portal</span>
              <i className="fa-solid fa-chevron-down text-[10px] ml-0.5 opacity-75" />
            </button>

            {isAuthDropdownOpen && (
              <div
                onMouseLeave={() => setIsAuthDropdownOpen(false)}
                className="absolute right-0 mt-1 w-80 bg-white rounded-2xl border border-[#EBEBE7] shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#EBEBE7] pb-3">
                  <div>
                    <h3 className="font-bold text-xs text-[#111111]">Client Sign In</h3>
                    <p className="text-[11px] text-[#6B6E68]">Access domains, leases & DNS</p>
                  </div>
                  <i className="fa-solid fa-shield-halved text-[#0D3B85]" />
                </div>

                <form onSubmit={handleQuickLogin} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#111111] block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full h-9 px-3 text-xs rounded-lg border border-[#DCDDD8] focus:border-[#0D3B85] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <label className="font-bold text-[#111111]">Password</label>
                      <Link href="/auth/login" className="text-[#0D3B85] hover:underline">
                        Forgot?
                      </Link>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 px-3 text-xs rounded-lg border border-[#DCDDD8] focus:border-[#0D3B85] outline-none"
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-[#0D3B85] hover:bg-[#1B6FC9] font-bold text-xs h-9 rounded-lg"
                    isLoading={isSubmittingLogin}
                  >
                    <span>Sign In to Dashboard</span>
                  </Button>
                </form>

                <div className="pt-2 border-t border-[#EBEBE7] text-center text-[11px] text-[#6B6E68]">
                  <span>Don&apos;t have an account? </span>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsAuthDropdownOpen(false)}
                    className="font-bold text-[#0D3B85] hover:underline"
                  >
                    Sign Up Free
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
