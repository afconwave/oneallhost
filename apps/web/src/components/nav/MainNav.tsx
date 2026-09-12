'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@oneallhost/ui';
import { NAV_ITEMS } from './navData';

export const MainNav: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 140);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 h-22 sm:h-24 flex items-center justify-between gap-6" ref={navRef}>
      {/* Left: Brand Logo (Prominently zoomed and enlarged) */}
      <Link href="/" className="flex items-center shrink-0 py-1">
        <BrandLogo variant="horizontal" height={76} className="h-14 sm:h-16 md:h-20 w-auto scale-110 origin-left" />
      </Link>

      {/* Desktop Navigation Link Cluster with Top Floating Badges */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isOpen = activeDropdown === item.label;
          return (
            <div
              key={item.label}
              className="relative h-full flex flex-col justify-center items-start cursor-pointer"
              onMouseEnter={() => openDropdown(item.label)}
              onMouseLeave={scheduleClose}
            >
              {/* Floating Top Badge Tag */}
              <div className="h-4 flex items-center mb-0.5">
                {item.badge ? (
                  <span
                    className={`px-1.5 py-0.2 text-[8px] font-black uppercase text-white rounded tracking-wide ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <span className="h-3" />
                )}
              </div>

              <Link
                href={item.href}
                className={`text-sm font-extrabold text-[#111111] hover:text-[#0D3B85] transition-colors py-0.5 ${
                  isOpen ? 'text-[#0D3B85]' : ''
                }`}
              >
                {item.label}
              </Link>

              {/* Clean, Simple Dropdown Popover (Attached Directly to Menu - Zero gap) */}
              {isOpen && item.items && (
                <div className="absolute top-full left-0 mt-0 pt-0 z-50">
                  <div className="w-[20rem] bg-white rounded-xl shadow-xl p-2 border-0 animate-in fade-in duration-150 space-y-0.5">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F5F7FA] transition-colors group"
                      >
                        <i className={`${sub.icon} text-xs text-[#6B6E68] group-hover:text-[#0D3B85] shrink-0 mt-1`} />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-[#111111] group-hover:text-[#0D3B85] flex items-center gap-2 transition-colors">
                            <span>{sub.label}</span>
                            {sub.badge && (
                              <span className="px-1.5 py-0.2 bg-[#7CB342] text-white rounded text-[8px] font-black uppercase tracking-wider">{sub.badge}</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6B6E68] leading-snug mt-0.5 font-normal">{sub.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-[#111111] hover:bg-gray-100 transition-colors"
      >
        <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'} text-lg`} />
      </button>

      {/* Mobile Panel with Touch-Friendly Buttons */}
      {isMobileOpen && (
        <div className="absolute top-full left-0 w-full lg:hidden bg-white border-b border-gray-200 p-4 space-y-3 shadow-xl z-50">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-[#111111] hover:bg-gray-50 rounded-xl"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white rounded ${item.badgeColor || 'bg-[#FF5A27]'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/auth/login"
              onClick={() => setIsMobileOpen(false)}
              className="w-full min-h-[42px] px-4 bg-[#0D3B85] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-user text-xs" />
              <span>Sign In to Dashboard</span>
            </Link>
            <Link
              href="/checkout"
              onClick={() => setIsMobileOpen(false)}
              className="w-full min-h-[42px] px-4 bg-[#F8FAF6] text-[#4E7525] border border-[#D6E8C2] font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-cart-shopping text-xs" />
              <span>View Cart &amp; Checkout</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
