'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGeoCurrency, GEO_CURRENCY_REGISTRY } from '../../lib/geoCurrency';

const CURRENCIES = [
  { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA', countryCode: 'CM' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA', countryCode: 'CI' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', countryCode: 'NG' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', countryCode: 'GH' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', countryCode: 'KE' },
  { code: 'USD', symbol: '$', name: 'U.S. Dollar', countryCode: 'GLOBAL' },
  { code: 'EUR', symbol: '€', name: 'Euro', countryCode: 'GLOBAL' },
  { code: 'GBP', symbol: '£', name: 'British Pound', countryCode: 'GLOBAL' },
];

const SITE_LINKS = [
  { title: 'Domain Name Search', href: '/domains/domain-name-search', category: 'Domains' },
  { title: 'Subdomain Staging Rentals', href: '/domains/rentals', category: 'Domains' },
  { title: 'Shared Web Hosting', href: '/hosting/shared', category: 'Hosting' },
  { title: 'Managed WordPress Cloud', href: '/wordpress', category: 'WordPress' },
  { title: 'Private Business Email', href: '/email', category: 'Email' },
  { title: 'Cameroon Business Registration', href: '/apps/business-registration-cameroon', category: 'Apps' },
  { title: 'SSL Certificates', href: '/security/ssl-certificates', category: 'Security' },
  { title: 'Domain Transfer (+1 Yr Free)', href: '/domains/transfer', category: 'Transfer' },
  { title: 'Knowledgebase & Help Guides', href: '/help-center', category: 'Help' },
];

export const TopAuxiliaryBar: React.FC = () => {
  const router = useRouter();
  const { geoConfig, setCountry } = useGeoCurrency();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currencies = CURRENCIES;
  const filteredLinks = searchQuery.trim()
    ? SITE_LINKS.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SITE_LINKS;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string } | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const signInRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const signInTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currencyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check authentication session
    const checkAuth = async () => {
      try {
        const session = typeof window !== 'undefined' ? localStorage.getItem('oneallhost_user_session') : null;
        if (!session) {
          setIsLoggedIn(false);
          setLoggedInUser(null);
          return;
        }

        const parsed = JSON.parse(session);
        if (parsed && parsed.loggedIn) {
          setIsLoggedIn(true);
          setLoggedInUser({
            name: parsed.name || parsed.username?.split('@')[0] || 'Account Owner',
            email: parsed.username || 'client@oneallhost.com',
          });

          if (parsed.token) {
            const res = await fetch('/api/users/me', {
              headers: { Authorization: `Bearer ${parsed.token}` },
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.user) {
                setLoggedInUser({ name: data.user.name, email: data.user.email });
              }
            }
          }
        } else {
          setIsLoggedIn(false);
          setLoggedInUser(null);
        }
      } catch {
        setIsLoggedIn(false);
        setLoggedInUser(null);
      }
    };

    checkAuth();

    const handleAuthEvent = () => {
      checkAuth();
    };
    window.addEventListener('storage', handleAuthEvent);
    window.addEventListener('auth-changed', handleAuthEvent);

    try {
      const savedUser = localStorage.getItem('oneallhost_remembered_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.username) setUsername(parsed.username);
        if (parsed.password) setPassword(parsed.password);
      }
    } catch {
      // ignore
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (signInRef.current && !signInRef.current.contains(e.target as Node)) {
        setIsSignInOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setIsCartOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', handleAuthEvent);
      window.removeEventListener('auth-changed', handleAuthEvent);
    };
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('oneallhost_user_session');
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setIsSignInOpen(false);
    router.push('/');
  };

  const openSignIn = () => {
    if (signInTimer.current) clearTimeout(signInTimer.current);
    setIsSignInOpen(true);
  };
  const closeSignIn = () => {
    if (signInTimer.current) clearTimeout(signInTimer.current);
    signInTimer.current = setTimeout(() => setIsSignInOpen(false), 200);
  };

  const openCurrency = () => {
    if (currencyTimer.current) clearTimeout(currencyTimer.current);
    setIsCurrencyOpen(true);
  };
  const closeCurrency = () => {
    if (currencyTimer.current) clearTimeout(currencyTimer.current);
    currencyTimer.current = setTimeout(() => setIsCurrencyOpen(false), 200);
  };

  const openCart = () => {
    if (cartTimer.current) clearTimeout(cartTimer.current);
    setIsCartOpen(true);
  };
  const closeCart = () => {
    if (cartTimer.current) clearTimeout(cartTimer.current);
    cartTimer.current = setTimeout(() => setIsCartOpen(false), 200);
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (rememberMe) {
      localStorage.setItem(
        'oneallhost_remembered_user',
        JSON.stringify({ username, password })
      );
    } else {
      localStorage.removeItem('oneallhost_remembered_user');
    }

    const sessionObj = {
      username: username || 'client@oneallhost.com',
      loggedIn: true,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem('oneallhost_user_session', JSON.stringify(sessionObj));
    window.dispatchEvent(new Event('auth-changed'));

    setIsLoggedIn(true);
    setLoggedInUser({
      name: username.split('@')[0] || 'Account Owner',
      email: username || 'client@oneallhost.com',
    });

    setTimeout(() => {
      setIsLoading(false);
      setIsSignInOpen(false);
      router.push('/dashboard');
    }, 400);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/help-center?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const closeAll = () => {
    setIsSignInOpen(false);
    setIsCurrencyOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <div className="bg-[#F0F3F9] text-[#333333] text-xs py-1 px-3 sm:px-8 border-0 relative z-50 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left Aux Links */}
        <div className="flex items-center gap-2.5 sm:gap-4 font-medium shrink-0">
          <Link href="/dashboard/support" className="hidden md:inline-block hover:text-[#0D3B85] transition-colors">
            Contact us
          </Link>

          {!isLoggedIn ? (
            <Link href="/auth/register" className="hidden sm:inline-block hover:text-[#0D3B85] transition-colors">
              Sign up
            </Link>
          ) : (
            <Link href="/dashboard/domain-list" className="hidden sm:inline-block hover:text-[#0D3B85] transition-colors">
              My Domains
            </Link>
          )}

          {/* Quick Sign In / User Dashboard Dropdown Popover */}
          <div
            className="relative flex items-center"
            ref={signInRef}
            onMouseEnter={openSignIn}
            onMouseLeave={closeSignIn}
          >
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignInOpen(!isSignInOpen);
                }}
                className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#0D3B85] hover:bg-[#1B6FC9] text-white font-bold rounded-lg transition-colors shadow-2xs cursor-pointer text-[11px] sm:text-xs gap-1"
              >
                <i className="fa-solid fa-gauge-high text-[10px] sm:text-[11px]" />
                <span>Dashboard</span>
                <i className="fa-solid fa-chevron-down text-[8px] sm:text-[9px] opacity-80" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignInOpen(!isSignInOpen);
                }}
                className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white hover:bg-white/90 text-[#111111] font-bold rounded-lg transition-colors shadow-2xs cursor-pointer text-[11px] sm:text-xs"
              >
                <i className="fa-solid fa-user text-[10px] sm:text-[11px] mr-1 text-[#0D3B85]" />
                <span>Sign in</span>
                <i className="fa-solid fa-chevron-down text-[8px] sm:text-[9px] ml-1 opacity-60" />
              </Link>
            )}

            {isSignInOpen && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setIsSignInOpen(false)} />
                <div className="fixed top-12 left-3 right-3 sm:absolute sm:top-full sm:left-0 sm:right-auto mt-0.5 z-50 animate-in fade-in duration-150 max-w-sm sm:max-w-none sm:w-80 mx-auto">
                  {isLoggedIn ? (
                    <div className="w-full bg-white rounded-xl shadow-2xl p-4 sm:p-5 border border-[#EBEBE7] sm:border-0 text-[#111111] space-y-3">
                      <div className="pb-3 border-b border-[#F0F0EE] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-[#111111] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{loggedInUser?.name || 'Active Client'}</span>
                          </div>
                          <div className="text-[11px] text-[#6B6E68] truncate max-w-[200px]">
                            {loggedInUser?.email}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsSignInOpen(false)}
                          className="sm:hidden text-gray-400 hover:text-gray-700"
                        >
                          <i className="fa-solid fa-xmark text-sm" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsSignInOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-[#111111] hover:bg-[#F0F3F9] hover:text-[#0D3B85] transition-colors"
                        >
                          <i className="fa-solid fa-gauge-high text-xs text-[#0D3B85]" />
                          <span>Console Overview</span>
                        </Link>
                        <Link
                          href="/dashboard/domain-list"
                          onClick={() => setIsSignInOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#111111] hover:bg-[#F0F3F9] hover:text-[#0D3B85] transition-colors"
                        >
                          <i className="fa-solid fa-globe text-xs text-gray-500" />
                          <span>Domain Manager</span>
                        </Link>
                        <Link
                          href="/dashboard/hosting-list"
                          onClick={() => setIsSignInOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#111111] hover:bg-[#F0F3F9] hover:text-[#0D3B85] transition-colors"
                        >
                          <i className="fa-solid fa-server text-xs text-gray-500" />
                          <span>Hosting Instances</span>
                        </Link>
                        <Link
                          href="/dashboard/billing"
                          onClick={() => setIsSignInOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#111111] hover:bg-[#F0F3F9] hover:text-[#0D3B85] transition-colors"
                        >
                          <i className="fa-solid fa-wallet text-xs text-gray-500" />
                          <span>Wallet &amp; Invoices</span>
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsSignInOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#111111] hover:bg-[#F0F3F9] hover:text-[#0D3B85] transition-colors"
                        >
                          <i className="fa-solid fa-user-shield text-xs text-gray-500" />
                          <span>Profile &amp; 2FA Security</span>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-[#F0F0EE] flex items-center justify-between">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsSignInOpen(false)}
                          className="text-xs font-bold text-[#0D3B85] hover:underline"
                        >
                          Open Dashboard
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-white rounded-xl shadow-2xl p-4 sm:p-5 border border-[#EBEBE7] sm:border-0 text-[#111111] space-y-4">
                      <div className="font-bold text-sm text-[#111111] pb-2 border-b border-[#F0F0EE] flex items-center justify-between">
                        <span>Sign in to Oneallhost</span>
                        <button
                          type="button"
                          onClick={() => setIsSignInOpen(false)}
                          className="sm:hidden text-gray-400 hover:text-gray-700"
                        >
                          <i className="fa-solid fa-xmark text-sm" />
                        </button>
                      </div>

                      <form onSubmit={handleQuickLogin} className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#666666] block mb-1">
                            Username or Email
                          </label>
                          <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="client@example.com"
                            className="w-full h-9 px-3 rounded-lg border border-[#E2E4E8] text-xs outline-none focus:border-[#0D3B85] bg-[#FDFDFD]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-semibold text-[#666666]">
                              Password
                            </label>
                            <Link
                              href="/auth/forgot-password"
                              className="text-[11px] text-[#0D3B85] hover:underline"
                            >
                              Forgot?
                            </Link>
                          </div>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-9 px-3 rounded-lg border border-[#E2E4E8] text-xs outline-none focus:border-[#0D3B85] bg-[#FDFDFD]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-3.5 h-3.5 rounded text-[#0D3B85] accent-[#0D3B85]"
                          />
                          <label htmlFor="rememberMe" className="text-[11px] text-[#666666] cursor-pointer">
                            Remember details for auto-fill
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-9 bg-[#0D3B85] hover:bg-[#1B6FC9] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? 'Signing In...' : 'Log In Directly'}
                        </button>
                      </form>

                      <div className="pt-2 border-t border-[#F0F0EE] text-center text-[11px] text-[#666666]">
                        New to Oneallhost?{' '}
                        <Link href="/auth/register" className="font-bold text-[#0D3B85] hover:underline">
                          Create an account
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Aux Links: Currency, Cart, Search */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Cart Popover */}
          <div
            className="relative flex items-center"
            ref={cartRef}
            onMouseEnter={openCart}
            onMouseLeave={closeCart}
          >
            <Link
              href="/checkout"
              className="hover:text-[#0D3B85] transition-colors py-0.5 sm:py-1 flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
            >
              <i className="fa-solid fa-cart-shopping text-xs sm:text-sm" />
              <span className="hidden sm:inline font-bold">Cart ($0.00)</span>
            </Link>

            {isCartOpen && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setIsCartOpen(false)} />
                <div className="fixed top-12 left-3 right-3 sm:absolute sm:top-full sm:right-0 sm:left-auto mt-0.5 z-50 animate-in fade-in duration-150 max-w-sm sm:max-w-none sm:w-72 mx-auto">
                  <div className="w-full bg-white rounded-xl shadow-2xl p-4 border border-[#EBEBE7] sm:border-0 text-[#111111] space-y-3">
                    <div className="font-bold text-xs text-[#111111] pb-2 border-b border-[#F0F0EE] flex items-center justify-between">
                      <span>Shopping Cart</span>
                      <span className="text-[11px] text-[#6B6E68]">0 items</span>
                    </div>

                    <div className="text-center py-4 space-y-1">
                      <i className="fa-solid fa-cart-arrow-down text-2xl text-[#888888]/40 mb-1" />
                      <div className="text-xs font-semibold text-[#111111]">Your cart is empty</div>
                      <p className="text-[11px] text-[#6B6E68]">Explore domains and hosting plans.</p>
                    </div>

                    <div className="pt-2 border-t border-[#F0F0EE] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Subtotal:</span>
                        <span>$0.00 USD</span>
                      </div>

                      <Link href="/checkout" className="block">
                        <button className="w-full h-8 bg-[#FF5A27] hover:bg-[#e04a1b] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                          View Cart &amp; Checkout
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Currency Switcher */}
          <div
            className="relative flex items-center"
            ref={currencyRef}
            onMouseEnter={openCurrency}
            onMouseLeave={closeCurrency}
          >
            <button
              type="button"
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="hover:text-[#0D3B85] transition-colors font-bold flex items-center gap-1 py-0.5 sm:py-1 cursor-pointer text-[11px] sm:text-xs"
            >
              <span>{geoConfig.currencySymbol} {geoConfig.currencyCode}</span>
              <i className="fa-solid fa-chevron-down text-[8px] sm:text-[9px] opacity-60" />
            </button>

            {isCurrencyOpen && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setIsCurrencyOpen(false)} />
                <div className="fixed top-12 left-3 right-3 sm:absolute sm:top-full sm:right-0 sm:left-auto mt-0.5 z-50 animate-in fade-in duration-150 max-w-sm sm:max-w-none sm:w-60 mx-auto">
                  <div className="w-full bg-white rounded-xl shadow-2xl p-2 border border-[#EBEBE7] sm:border-0 text-[#111111] space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B6E68] border-b border-[#F0F0EE] flex items-center justify-between">
                      <span>Select Currency</span>
                      <button
                        type="button"
                        onClick={() => setIsCurrencyOpen(false)}
                        className="sm:hidden text-gray-400 hover:text-gray-700"
                      >
                        <i className="fa-solid fa-xmark text-xs" />
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          type="button"
                          onClick={() => {
                            setCountry(curr.countryCode);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-[#F5F7FA] transition-colors cursor-pointer ${
                            geoConfig.currencyCode === curr.code ? 'font-bold text-[#0D3B85] bg-[#F0F3F9]' : 'text-[#333333]'
                          }`}
                        >
                          <span><strong className="mr-1.5">{curr.symbol}</strong>{curr.code}</span>
                          <span className="text-[11px] text-[#6B6E68]">{curr.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#F0F0EE] px-3 py-1 text-center">
                      <Link
                        href="/support/payment/currency-exchange-rates"
                        onClick={() => setIsCurrencyOpen(false)}
                        className="text-[11px] font-bold text-[#0D3B85] hover:underline"
                      >
                        Currency Exchange Rates
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Site-Wide Search Button & Attached Dropdown Popover */}
          <div className="relative flex items-center" ref={searchRef}>
            <button
              type="button"
              aria-label="Search site"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`hover:text-[#0D3B85] transition-colors py-0.5 sm:py-1 cursor-pointer text-xs sm:text-sm ${
                isSearchOpen ? 'text-[#0D3B85]' : ''
              }`}
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>

            {/* Site Search Popover Attached Directly Under Top Nav */}
            {isSearchOpen && (
              <>
                <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setIsSearchOpen(false)} />
                <div className="fixed top-12 left-3 right-3 sm:absolute sm:top-full sm:right-0 sm:left-auto mt-0.5 z-50 animate-in fade-in duration-150 max-w-sm sm:max-w-none sm:w-96 mx-auto">
                  <div className="w-full bg-white rounded-xl shadow-2xl p-4 border border-[#EBEBE7] sm:border-0 text-[#111111] space-y-3">
                    <div className="font-bold text-xs text-[#111111] pb-2 border-b border-[#F0F0EE] flex items-center justify-between">
                      <span>Search Oneallhost</span>
                      <button
                        type="button"
                        onClick={() => setIsSearchOpen(false)}
                        className="text-[#6B6E68] hover:text-[#111111] text-xs cursor-pointer p-1"
                      >
                        <i className="fa-solid fa-xmark text-sm" />
                      </button>
                    </div>

                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search pages, hosting, SSL, guides..."
                        className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#E2E4E8] text-xs outline-none focus:border-[#0D3B85] bg-[#FDFDFD]"
                      />
                      <i className="fa-solid fa-magnifying-glass text-xs text-[#6B6E68] absolute left-3 top-1/2 -translate-y-1/2" />
                    </form>

                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B6E68] px-1">
                        Quick Links &amp; Pages
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-0.5">
                        {filteredLinks.map((link) => (
                          <Link
                            key={link.title}
                            href={link.href}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#F5F7FA] transition-colors text-[#111111]"
                          >
                            <span className="font-medium truncate">{link.title}</span>
                            <span className="text-[10px] text-[#6B6E68] font-normal shrink-0 ml-2">
                              {link.category}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
