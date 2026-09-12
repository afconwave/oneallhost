'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Card, Button, Badge } from '@oneallhost/ui';
import {
  Search,
  CheckCircle2,
  XCircle,
  Zap,
  Globe,
  Server,
  Lock,
  Clock,
  ArrowRight,
  Sparkles,
  Puzzle,
  Layout,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';

interface WpDetectResult {
  success: boolean;
  domain: string;
  targetUrl: string;
  finalUrl: string;
  pageTitle: string;
  isWordPress: boolean;
  cmsName: string;
  wpVersion: string | null;
  theme: {
    name: string;
    slug: string;
    uri?: string;
  } | null;
  plugins: Array<{
    name: string;
    slug: string;
    detectedFrom: string;
  }>;
  totalPluginsDetected: number;
  server: string;
  caching: {
    isCached: boolean;
    provider: string;
  };
  ssl: {
    isSecure: boolean;
    protocol: string;
  };
  httpStatus: number;
  responseTimeMs: number;
  checkedAt: string;
}

function IsItWpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUrl = searchParams?.get('url') || searchParams?.get('domain') || '';

  const [inputUrl, setInputUrl] = useState(initialUrl || '');
  const [currentUrl, setCurrentUrl] = useState(initialUrl || 'wordpress.org');
  const [data, setData] = useState<WpDetectResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkWebsite = async (urlToCheck: string) => {
    const cleanUrl = urlToCheck
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/.*$/, '');

    if (!cleanUrl) return;

    setIsLoading(true);
    setCurrentUrl(cleanUrl);

    try {
      const res = await fetch(`/api/tools/is-wp?url=${encodeURIComponent(cleanUrl)}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to inspect website');
      }
      const json: WpDetectResult = await res.json();
      setData(json);
    } catch (err: any) {
      console.warn('CMS Inspection error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      checkWebsite(initialUrl);
    } else {
      checkWebsite('wordpress.org');
    }
  }, [initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    checkWebsite(inputUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] font-sans">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-[#EBEBE7] py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21759B]/10 text-[#21759B] text-xs font-bold">
            <i className="fa-brands fa-wordpress text-sm" />
            <span>WordPress Theme &amp; Plugin Detector</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight font-display">
            Is That Site Running WordPress?
          </h1>

          <p className="text-sm sm:text-base text-[#6B6E68] max-w-2xl mx-auto leading-relaxed">
            Scan any website to reveal its underlying CMS, active WordPress theme, installed plugins, web server engine, and caching architecture in seconds.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-xs rounded-2xl bg-white border-2 border-[#21759B] focus-within:ring-4 focus-within:ring-[#21759B]/20 transition-all p-1.5">
              <Search className="w-5 h-5 text-[#6B6E68] ml-3 shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter website URL (e.g. techcrunch.com, wordpress.org, myshop.com)"
                className="w-full px-3 py-2 text-sm sm:text-base font-mono text-[#111111] placeholder:text-[#9CA3AF] bg-transparent outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="rounded-xl px-6 font-bold bg-[#21759B] hover:bg-[#1A5E7D] text-white shrink-0"
                isLoading={isLoading}
              >
                Scan Website
              </Button>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6B6E68]">
            <span>Try popular sites:</span>
            {['wordpress.org', 'techcrunch.com', 'woocommerce.com', 'github.com', 'shopify.com'].map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => {
                  setInputUrl(dom);
                  checkWebsite(dom);
                }}
                className="font-mono text-[#21759B] hover:underline bg-white px-2 py-0.5 rounded border border-[#EBEBE7] text-[11px] cursor-pointer"
              >
                {dom}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Analysis Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {isLoading && !data && (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-[#21759B] animate-spin mx-auto" />
            <p className="text-sm font-medium text-[#6B6E68]">Analyzing HTML source, script tags, themes, and server headers...</p>
          </div>
        )}

        {data && (
          <>
            {/* Verdict Hero Banner */}
            <Card
              elevation="surface-1"
              className={`p-8 rounded-3xl border shadow-xs transition-all ${
                data.isWordPress
                  ? 'bg-gradient-to-br from-[#F0F7FA] to-white border-[#21759B]/30'
                  : 'bg-gradient-to-br from-[#FAFAF9] to-white border-[#EBEBE7]'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xs ${
                        data.isWordPress ? 'bg-[#21759B]' : 'bg-[#111111]'
                      }`}
                    >
                      {data.isWordPress ? (
                        <i className="fa-brands fa-wordpress text-2xl" />
                      ) : (
                        <Globe className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-extrabold tracking-wider text-[#6B6E68]">
                          Detection Verdict
                        </span>
                        {data.isWordPress ? (
                          <Badge variant="success" className="font-bold">WordPress Confirmed</Badge>
                        ) : (
                          <Badge variant="info" className="font-bold">{data.cmsName}</Badge>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#111111] mt-0.5">
                        {data.domain}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-[#111111] font-medium max-w-xl">
                    {data.isWordPress ? (
                      <>
                        Yes! <strong className="text-[#21759B]">{data.domain}</strong> is built on WordPress{' '}
                        {data.wpVersion && <span className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-[#21759B]/30">v{data.wpVersion}</span>}.
                      </>
                    ) : (
                      <>
                        No, <strong>{data.domain}</strong> is not running WordPress. Detected technology: <strong className="text-[#0D3B85]">{data.cmsName}</strong>.
                      </>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B6E68]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0D3B85]" />
                      <span>Response: <strong className="text-[#111111]">{data.responseTimeMs} ms</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-[#0D3B85]" />
                      <span>Server: <strong className="text-[#111111]">{data.server}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SSL: <strong className="text-emerald-700">{data.ssl.protocol}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Free WP Migration Banner CTA */}
                <div className="shrink-0 w-full md:w-auto p-4 rounded-2xl bg-white border border-[#EBEBE7] space-y-2 text-center md:text-left">
                  <div className="text-xs font-bold text-[#111111] flex items-center justify-center md:justify-start gap-1.5">
                    <Zap className="w-4 h-4 text-[#FF5A27]" />
                    <span>Oneallhost Managed WP Cloud</span>
                  </div>
                  <p className="text-[11px] text-[#6B6E68] max-w-xs">
                    Get NVMe LiteSpeed caching, free staging, automated updates, and 100% free migration.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-[#DE3723] hover:bg-[#C52D1C] text-white font-bold rounded-xl gap-1.5 shadow-xs"
                    onClick={() => router.push('/wordpress/migrate')}
                  >
                    <span>Migrate Website Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* WordPress Theme & Plugins Deep Dive */}
            {data.isWordPress && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detected Theme Card */}
                <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                      <Layout className="w-4 h-4 text-[#21759B]" />
                      <span>Active WordPress Theme</span>
                    </h3>
                    {data.theme && <Badge variant="info">Active Theme</Badge>}
                  </div>

                  {data.theme ? (
                    <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EBEBE7] space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#21759B]/10 text-[#21759B] flex items-center justify-center font-bold text-sm">
                          <Layout className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-[#111111]">{data.theme.name}</h4>
                          <span className="font-mono text-xs text-[#6B6E68]">Slug: /{data.theme.slug}/</span>
                        </div>
                      </div>

                      <div className="text-xs text-[#6B6E68] space-y-1 pt-2 border-t border-[#EBEBE7]">
                        <div className="flex justify-between">
                          <span>Theme Directory:</span>
                          <span className="font-mono text-[#111111]">/wp-content/themes/{data.theme.slug}/</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EBEBE7] text-center text-xs text-[#6B6E68]">
                      Custom or obfuscated child theme detected.
                    </div>
                  )}
                </Card>

                {/* Detected Plugins Grid */}
                <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                      <Puzzle className="w-4 h-4 text-[#21759B]" />
                      <span>Detected Plugins ({data.totalPluginsDetected})</span>
                    </h3>
                    <Badge variant={data.totalPluginsDetected > 0 ? 'success' : 'neutral'}>
                      {data.totalPluginsDetected} Found
                    </Badge>
                  </div>

                  {data.plugins.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {data.plugins.map((plugin, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFAF9] border border-[#EBEBE7] text-xs hover:border-[#21759B]/30 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Puzzle className="w-3.5 h-3.5 text-[#21759B]" />
                            <span className="font-bold text-[#111111]">{plugin.name}</span>
                          </div>
                          <span className="font-mono text-[10px] text-[#6B6E68] bg-white px-2 py-0.5 rounded border border-[#EBEBE7]">
                            /{plugin.slug}/
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EBEBE7] text-center text-xs text-[#6B6E68]">
                      No public plugin assets detected in the top-level DOM. (Plugins may be aggregated or minified).
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Architecture & Performance Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Web Server */}
              <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0D3B85] flex items-center justify-center mx-auto">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#111111]">Web Server Engine</h4>
                <p className="text-base font-mono font-bold text-[#0D3B85] truncate" title={data.server}>
                  {data.server}
                </p>
                <p className="text-xs text-[#6B6E68]">
                  Hosting infrastructure responding to HTTP/HTTPS requests.
                </p>
              </Card>

              {/* Caching & CDN */}
              <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#111111]">Caching &amp; Edge Layer</h4>
                <p className="text-base font-bold text-[#111111] truncate" title={data.caching.provider}>
                  {data.caching.provider}
                </p>
                <Badge variant={data.caching.isCached ? 'success' : 'neutral'}>
                  {data.caching.isCached ? 'Edge Cache Active' : 'Standard Browser Cache'}
                </Badge>
              </Card>

              {/* SSL Encryption */}
              <Card elevation="surface-1" className="p-6 bg-white border border-[#EBEBE7] rounded-2xl space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#111111]">Security &amp; SSL</h4>
                <p className="text-base font-bold text-emerald-700">
                  {data.ssl.isSecure ? 'Active TLS Encryption' : 'Unencrypted HTTP'}
                </p>
                <p className="text-xs text-[#6B6E68]">
                  {data.ssl.protocol}
                </p>
              </Card>
            </div>
          </>
        )}

        {/* Informational FAQ / Guide */}
        <section className="pt-10 border-t border-[#EBEBE7] space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-[#111111]">How Does the WordPress Detector Work?</h3>
            <p className="text-xs text-[#6B6E68] max-w-lg mx-auto">
              Our live scanner analyzes DOM markup, CSS stylesheets, script assets, and HTTP headers in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] space-y-2">
              <Sparkles className="w-5 h-5 text-[#21759B]" />
              <h4 className="font-bold text-sm text-[#111111]">Theme Fingerprinting</h4>
              <p className="text-xs text-[#6B6E68]">
                Inspects <code className="text-[#21759B]">/wp-content/themes/</code> paths and parses active stylesheet headers to identify the exact theme name and author.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] space-y-2">
              <Puzzle className="w-5 h-5 text-[#10B981]" />
              <h4 className="font-bold text-sm text-[#111111]">Plugin Asset Discovery</h4>
              <p className="text-xs text-[#6B6E68]">
                Discovers active plugins such as WooCommerce, Yoast, Elementor, and security firewalls from public JavaScript and CSS assets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#EBEBE7] space-y-2">
              <SlidersHorizontal className="w-5 h-5 text-[#DE3723]" />
              <h4 className="font-bold text-sm text-[#111111]">Server &amp; Caching Header Audit</h4>
              <p className="text-xs text-[#6B6E68]">
                Verifies LiteSpeed LSCache, Cloudflare Edge headers, and HTTP response performance metrics directly from the server.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function IsItWpPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-[#6B6E68]">Loading WordPress inspector...</div>}>
      <IsItWpContent />
    </React.Suspense>
  );
}
