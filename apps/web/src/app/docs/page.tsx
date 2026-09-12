import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export const metadata = {
  title: 'Developer API Documentation — Oneallhost',
  description: 'REST API documentation for domain registration, DNS management, subdomain rentals, and Anycast cloud infrastructure.',
};

export default function DocsPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/domains/search?q={query}',
      desc: 'Search available domain names and retrieve real-time registration pricing across TLDs.',
      badge: 'Public',
    },
    {
      method: 'GET',
      path: '/api/v1/rentals',
      desc: 'List available staging subdomains available for instant rental.',
      badge: 'Public',
    },
    {
      method: 'GET',
      path: '/api/v1/users/me',
      desc: 'Retrieve current user profile, security settings, and 2FA status.',
      badge: 'Bearer Auth',
    },
    {
      method: 'GET',
      path: '/api/v1/users/domains',
      desc: 'Fetch active domains owned by the authenticated account.',
      badge: 'Bearer Auth',
    },
    {
      method: 'GET',
      path: '/api/v1/domains/:id/dns',
      desc: 'Retrieve Anycast DNS records for a managed domain.',
      badge: 'Bearer Auth',
    },
    {
      method: 'POST',
      path: '/api/v1/domains/:id/dns',
      desc: 'Add a new DNS record (A, AAAA, CNAME, MX, TXT) with automatic global propagation.',
      badge: 'Bearer Auth',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {/* Hero Section */}
        <div className="border-b border-[#EBEBE7] pb-10 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#111111] tracking-tight">
            Developer API Documentation
          </h1>

          <p className="mt-3 text-sm text-[#6B6E68] max-w-2xl leading-relaxed">
            Automate domain search, Anycast DNS zone management, WHOIS protection, and staging subdomain provisioning directly using our RESTful endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6E68]">Getting Started</h3>
              <nav className="space-y-1 text-xs">
                <a href="#overview" className="block px-3 py-2 rounded-lg bg-blue-50 text-[#0D3B85] font-semibold">Overview</a>
                <a href="#authentication" className="block px-3 py-2 rounded-lg text-[#6B6E68] hover:bg-gray-50 hover:text-[#111111] transition-colors">Authentication</a>
                <a href="#endpoints" className="block px-3 py-2 rounded-lg text-[#6B6E68] hover:bg-gray-50 hover:text-[#111111] transition-colors">API Endpoints</a>
                <a href="#rate-limits" className="block px-3 py-2 rounded-lg text-[#6B6E68] hover:bg-gray-50 hover:text-[#111111] transition-colors">Rate Limits</a>
              </nav>
            </div>
          </aside>

          {/* Main Docs Content */}
          <section className="lg:col-span-3 space-y-12">
            {/* Overview */}
            <div id="overview" className="space-y-4">
              <h2 className="text-xl font-bold text-[#111111]">Base URL</h2>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                All API requests should be sent to the following base endpoint:
              </p>
              <div className="p-4 rounded-xl bg-[#091F44] text-white font-mono text-xs shadow-inner flex items-center justify-between">
                <code>https://api.oneallhost.com/v1</code>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">v1.0 active</span>
              </div>
            </div>

            {/* Authentication */}
            <div id="authentication" className="space-y-4">
              <h2 className="text-xl font-bold text-[#111111]">Authentication</h2>
              <p className="text-xs text-[#6B6E68] leading-relaxed">
                Authenticated endpoints require an HTTP Authorization header containing a valid Bearer token obtained upon user sign-in.
              </p>
              <div className="p-4 rounded-xl bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto">
                <pre>{`Authorization: Bearer <YOUR_ACCESS_TOKEN>`}</pre>
              </div>
            </div>

            {/* Endpoints */}
            <div id="endpoints" className="space-y-6">
              <h2 className="text-xl font-bold text-[#111111]">Endpoints Summary</h2>

              <div className="space-y-4">
                {endpoints.map((ep, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-[#DCDDD8] bg-white shadow-sm space-y-3 hover:border-[#0D3B85]/40 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] ${
                          ep.method === 'GET' ? 'bg-blue-100 text-[#0D3B85]' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="text-[#111111]">{ep.path}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-[#6B6E68]">
                        {ep.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6E68] leading-relaxed">
                      {ep.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Example */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#111111]">Example Request (Domain Availability)</h3>
              <div className="p-4 rounded-xl bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-gray-400">// JavaScript fetch example</div>
                <pre>{`const response = await fetch('/api/domains/search?q=mybrand.org');
const data = await response.json();
console.log(data);`}</pre>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
