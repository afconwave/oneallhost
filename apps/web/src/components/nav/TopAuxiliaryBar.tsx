'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGeoCurrency, GEO_CURRENCY_REGISTRY } from '../../lib/geoCurrency';

export const TopAuxiliaryBar: React.FC = () => {
  const router = useRouter();
  const { geoConfig, setCountry } = useGeoCurrency();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const currencies = [
    { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA', countryCode: 'CM' },
    { code: 'XOF', symbol: 'CFA', name: 'West African CFA', countryCode: 'CI' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', countryCode: 'NG' },
    { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', countryCode: 'GH' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', countryCode: 'KE' },
    { code: 'USD', symbol: '$', name: 'U.S. Dollar', countryCode: 'GLOBAL' },
    { code: 'EUR', symbol: '€', name: 'Euro', countryCode: 'GLOBAL' },
    { code: 'GBP', symbol: '£', name: 'British Pound', countryCode: 'GLOBAL' },
  ];

  const siteLinks = [
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

  const filteredLinks = searchQuery.trim()
    ? siteLinks.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : siteLinks;

  useEffect(() => {
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    localStorage.setItem(
      'oneallhost_user_session',
      JSON.stringify({ username, loggedIn: true, loginTime: new Date().toISOString() })
    );

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

  return (
    <div className="bg-[#F0F3F9] text-[#333333] text-xs py-1.5 px-4 sm:px-8 border-0 relative z-50 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 font-medium">
          <Link href="/dashboard/support" className="hover:text-[#0D3B85] transition-colors">
            Contact us
          </Link>
          <Link href="/auth/register" className="hover:text-[#0D3B85] transition-colors">
            Sign up
          </Link>

          {/* Quick Sign In Hover / Click Dropdown Popover */}
          <div
            className="relative flex items-center"
            ref={signInRef}
            onMouseEnter={openSignIn}
            onMouseLeave={closeSignIn}
          >
            <Link
              href="/auth/login"
              onClick={(e) => {
                e.preventDefault();
                setIsSignInOpen(!isSignInOpen);
              }}
              className="inline-flex items-center px-3 py-1 bg-white/80 hover:bg-white text-[#111111] font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <i className="fa-solid fa-user text-[11px] mr-1.5 text-[#0D3B85]" />
              <span>Sign in</span>
              <i className="fa-solid fa-chevron-down text-[9px] ml-1.5 opacity-60" />
            </Link>

            {isSignInOpen && (
              <div className="fixed sm:absolute top-10 sm:top-full left-3 sm:left-0 right-3 sm:right-auto mt-0.5 z-50 animate-in fade-in duration-150 max-w-[calc(100vw-1.5rem)] sm:w-80">
                <div className="w-full bg-white rounded-xl shadow-2xl p-5 border border-[#EBEBE7] sm:border-0 text-[#111111] space-y-4">
                  <div className="font-bold text-sm text-[#111111] pb-2 border-b border-[#F0F0EE]">
                    Sign in to Oneallhost
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
              </div>
            )}
          </div>
        </div>

        {/* Right Aux Links: Currency, Cart, Search */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cart Popover */}
          <div
            className="relative flex items-center"
            ref={cartRef}
            onMouseEnter={openCart}
            onMouseLeave={closeCart}
          >
            <Link
              href="/checkout"
              className="hover:text-[#0D3B85] transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-cart-shopping text-sm" />
              <span className="hidden sm:inline font-bold">Cart ($0.00)</span>
            </Link>

            {isCartOpen && (
              <div className="fixed sm:absolute top-10 sm:top-full right-3 sm:right-0 left-3 sm:left-auto mt-0.5 z-50 animate-in fade-in duration-150 max-w-[calc(100vw-1.5rem)] sm:w-72">
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
              className="hover:text-[#0D3B85] transition-colors font-bold flex items-center gap-1 py-1 cursor-pointer"
            >
              <span>{geoConfig.currencySymbol} {geoConfig.currencyCode}</span>
              <i className="fa-solid fa-chevron-down text-[9px] opacity-60" />
            </button>

            {isCurrencyOpen && (
              <div className="fixed sm:absolute top-10 sm:top-full right-3 sm:right-0 left-3 sm:left-auto mt-0.5 z-50 animate-in fade-in duration-150 max-w-[calc(100vw-1.5rem)] sm:w-60">
                <div className="w-full bg-white rounded-xl shadow-2xl p-2 border border-[#EBEBE7] sm:border-0 text-[#111111] space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B6E68] border-b border-[#F0F0EE]">
                    Select Currency
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
            )}
          </div>

          {/* Site-Wide Search Button & Attached Dropdown Popover */}
          <div className="relative flex items-center" ref={searchRef}>
            <button
              type="button"
              aria-label="Search site"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`hover:text-[#0D3B85] transition-colors py-1 cursor-pointer ${
                isSearchOpen ? 'text-[#0D3B85]' : ''
              }`}
            >
              <i className="fa-solid fa-magnifying-glass text-sm" />
            </button>

            {/* Site Search Popover Attached Directly Under Top Nav */}
            {isSearchOpen && (
              <div className="fixed sm:absolute top-10 sm:top-full right-3 sm:right-0 left-3 sm:left-auto mt-0.5 z-50 animate-in fade-in duration-150 max-w-[calc(100vw-1.5rem)] sm:w-96">
                <div className="w-full bg-white rounded-xl shadow-2xl p-4 border border-[#EBEBE7] sm:border-0 text-[#111111] space-y-3">
                  <div className="font-bold text-xs text-[#111111] pb-2 border-b border-[#F0F0EE] flex items-center justify-between">
                    <span>Search Oneallhost</span>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[#6B6E68] hover:text-[#111111] text-xs cursor-pointer"
                    >
                      <i className="fa-solid fa-xmark" />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
