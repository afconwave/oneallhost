import express, { Request, Response } from 'express';
import dns from 'dns';
import tls from 'tls';

export const toolsRouter = express.Router();

/**
 * Common WordPress Theme Names lookup helper
 */
const KNOWN_THEMES: Record<string, string> = {
  astra: 'Astra Pro',
  hello_elementor: 'Hello Elementor',
  'hello-elementor': 'Hello Elementor',
  divi: 'Divi Theme (Elegant Themes)',
  generatepress: 'GeneratePress',
  oceanwp: 'OceanWP',
  neve: 'Neve (ThemeIsle)',
  avada: 'Avada Website Builder',
  woodmart: 'WoodMart WooCommerce Theme',
  flatsome: 'Flatsome Responsive WooCommerce',
  enfold: 'Enfold Multi-Purpose Theme',
  kadence: 'Kadence Theme',
  twentytwentyfour: 'Twenty Twenty-Four',
  twentytwentythree: 'Twenty Twenty-Three',
  twentytwentytwo: 'Twenty Twenty-Two',
  salient: 'Salient Multi-Purpose',
  betheme: 'Betheme Responsive Theme',
  the7: 'The7 — Multi-Purpose Website',
  blocksy: 'Blocksy Supercharged Theme',
};

/**
 * Common WordPress Plugin Names lookup helper
 */
const KNOWN_PLUGINS: Record<string, string> = {
  woocommerce: 'WooCommerce Store Engine',
  elementor: 'Elementor Page Builder',
  'elementor-pro': 'Elementor Pro',
  'js_composer': 'WPBakery Page Builder',
  'contact-form-7': 'Contact Form 7',
  'wordpress-seo': 'Yoast SEO',
  'seo-by-rank-math': 'Rank Math SEO',
  'all-in-one-seo-pack': 'All in One SEO',
  'litespeed-cache': 'LiteSpeed Cache',
  'wp-rocket': 'WP Rocket Performance',
  'w3-total-cache': 'W3 Total Cache',
  'wp-super-cache': 'WP Super Cache',
  wordfence: 'Wordfence Security',
  'better-wp-security': 'iThemes Security',
  'all-in-one-wp-migration': 'All-in-One WP Migration',
  'revslider': 'Slider Revolution',
  'advanced-custom-fields': 'Advanced Custom Fields (ACF)',
  'advanced-custom-fields-pro': 'Advanced Custom Fields PRO',
  'wpforms-lite': 'WPForms',
  'gravityforms': 'Gravity Forms',
  'jetpack': 'Jetpack by Automattic',
  'sitepress-multilingual-cms': 'WPML Multilingual CMS',
  polylang: 'Polylang Translation',
  updraftplus: 'UpdraftPlus WordPress Backup',
  'smush': 'Smush Image Optimization',
  'autoptimize': 'Autoptimize Speed Booster',
  'cookie-law-info': 'CookieYes GDPR Cookie Consent',
};

function isPrivateOrReservedHost(host: string): boolean {
  const clean = host.toLowerCase().trim();
  if (
    clean === 'localhost' ||
    clean === '127.0.0.1' ||
    clean === '0.0.0.0' ||
    clean === '::1' ||
    clean.endsWith('.local') ||
    clean.endsWith('.internal') ||
    clean.endsWith('.lan')
  ) {
    return true;
  }
  // Check private IP ranges
  if (/^127\./.test(clean)) return true;
  if (/^10\./.test(clean)) return true;
  if (/^192\.168\./.test(clean)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
  if (/^169\.254\./.test(clean)) return true; // Link-local & cloud instance metadata (169.254.169.254)
  return false;
}

/**
 * 1. Is WP Site (WordPress & Technology Stack Detector)
 * Endpoint: GET /api/v1/tools/is-wp?url=example.com
 */
toolsRouter.get('/is-wp', async (req: Request, res: Response) => {
  try {
    const rawInput = ((req.query.url as string) || (req.query.domain as string) || '').trim();
    if (!rawInput) {
      return res.status(400).json({ error: 'url or domain query parameter is required' });
    }

    // Sanitize domain / URL
    const domain = rawInput
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')
      .trim();

    if (isPrivateOrReservedHost(domain)) {
      return res.status(400).json({
        error: 'Access to private, local, or cloud metadata endpoints is prohibited.',
        domain,
      });
    }

    const targetUrl = `https://${domain}`;
    const startTime = Date.now();

    let html = '';
    let responseHeaders: Record<string, string> = {};
    let httpStatus = 200;
    let finalUrl = targetUrl;
    let isHttps = true;
    let serverHeader = 'Cloud / Edge';

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Oneallhost-WP-Inspector/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(6000),
      });

      httpStatus = response.status;
      finalUrl = response.url;
      response.headers.forEach((val, key) => {
        responseHeaders[key.toLowerCase()] = val;
      });
      serverHeader = responseHeaders['server'] || 'Edge Server';
      html = await response.text();
    } catch (fetchErr) {
      // Fallback to HTTP
      try {
        const httpFallback = await fetch(`http://${domain}`, {
          method: 'GET',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Oneallhost-WP-Inspector/1.0',
          },
          signal: AbortSignal.timeout(5000),
        });
        httpStatus = httpFallback.status;
        finalUrl = httpFallback.url;
        isHttps = false;
        httpFallback.headers.forEach((val, key) => {
          responseHeaders[key.toLowerCase()] = val;
        });
        serverHeader = responseHeaders['server'] || 'Edge Server';
        html = await httpFallback.text();
      } catch (err: any) {
        return res.status(422).json({
          error: `Could not connect to domain '${domain}'. Please check if the website is online.`,
          domain,
        });
      }
    }

    const responseTimeMs = Date.now() - startTime;

    // Extract Page Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : domain;

    // 1. Check WordPress Indicators
    const hasWpContent = /wp-content\//i.test(html);
    const hasWpIncludes = /wp-includes\//i.test(html);
    const hasWpJson = /wp-json/i.test(html) || /api\.w\.org/i.test(html);
    const generatorMatch = html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i);
    const generatorContent = generatorMatch ? generatorMatch[1] : '';
    const isWpGenerator = /wordpress/i.test(generatorContent);

    const isWordPress = hasWpContent || hasWpIncludes || hasWpJson || isWpGenerator;

    // 2. Extract WordPress Version
    let wpVersion: string | null = null;
    if (isWpGenerator) {
      const vMatch = generatorContent.match(/wordpress\s+([0-9.]+)/i);
      if (vMatch) wpVersion = vMatch[1];
    }
    if (!wpVersion) {
      const verRegex = /wp-(?:includes|content)\/js\/[^"']+\?ver=([0-9.]+)/i;
      const verMatch = html.match(verRegex);
      if (verMatch && /^[0-9]\.[0-9]/.test(verMatch[1])) {
        wpVersion = verMatch[1];
      }
    }

    // 3. Extract Theme
    let detectedTheme: { name: string; slug: string; uri?: string } | null = null;
    const themeMatches = html.matchAll(/\/wp-content\/themes\/([a-zA-Z0-9_-]+)\//gi);
    const themeSlugs = new Set<string>();
    for (const m of themeMatches) {
      if (m[1] && m[1].toLowerCase() !== 'child') {
        themeSlugs.add(m[1].toLowerCase());
      }
    }
    const themeArray = Array.from(themeSlugs);
    if (themeArray.length > 0) {
      const mainSlug = themeArray[0];
      const friendlyName = KNOWN_THEMES[mainSlug] || mainSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      detectedTheme = {
        slug: mainSlug,
        name: friendlyName,
      };
    }

    // 4. Extract Plugins
    const pluginMatches = html.matchAll(/\/wp-content\/plugins\/([a-zA-Z0-9_-]+)\//gi);
    const pluginSlugs = new Set<string>();
    for (const m of pluginMatches) {
      if (m[1]) {
        pluginSlugs.add(m[1].toLowerCase());
      }
    }
    const detectedPlugins = Array.from(pluginSlugs).map((slug) => ({
      slug,
      name: KNOWN_PLUGINS[slug] || slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      detectedFrom: `/wp-content/plugins/${slug}/`,
    }));

    // 5. Detect Non-WordPress CMS
    let cmsName = 'Custom / HTML / Static';
    if (isWordPress) {
      cmsName = 'WordPress';
    } else if (/cdn\.shopify\.com/i.test(html) || /Shopify\.theme/i.test(html)) {
      cmsName = 'Shopify';
    } else if (/__NEXT_DATA__/i.test(html) || /_next\/static/i.test(html)) {
      cmsName = 'Next.js (React)';
    } else if (/drupal/i.test(generatorContent) || /Drupal\.settings/i.test(html) || /\/sites\/default\/files/i.test(html)) {
      cmsName = 'Drupal';
    } else if (/joomla/i.test(generatorContent) || /\/media\/system\/js/i.test(html)) {
      cmsName = 'Joomla!';
    } else if (/wixsite\.com/i.test(html) || /_wix_/i.test(html)) {
      cmsName = 'Wix';
    } else if (/squarespace\.com/i.test(html) || /static1\.squarespace\.com/i.test(html)) {
      cmsName = 'Squarespace';
    } else if (/data-wf-page/i.test(html) || /webflow\.com/i.test(html)) {
      cmsName = 'Webflow';
    } else if (/ghost\.org/i.test(generatorContent) || /ghost-url/i.test(html)) {
      cmsName = 'Ghost CMS';
    } else if (responseHeaders['x-powered-by']?.toLowerCase().includes('php')) {
      cmsName = 'PHP Framework';
    }

    // 6. Caching & Performance Layer
    const hasLitespeed =
      Boolean(responseHeaders['x-litespeed-cache']) || /litespeed/i.test(serverHeader);
    const hasCloudflare =
      Boolean(responseHeaders['cf-cache-status']) ||
      Boolean(responseHeaders['cf-ray']) ||
      /cloudflare/i.test(serverHeader);
    const hasWpRocket = /wp-rocket/i.test(html) || detectedPlugins.some((p) => p.slug === 'wp-rocket');

    let cacheProvider = 'Default Browser Caching';
    if (hasLitespeed) cacheProvider = 'LiteSpeed Enterprise LSCache';
    else if (hasCloudflare) cacheProvider = `Cloudflare CDN (${responseHeaders['cf-cache-status'] || 'HIT'})`;
    else if (hasWpRocket) cacheProvider = 'WP Rocket Static Cache';

    return res.json({
      success: true,
      domain,
      targetUrl,
      finalUrl,
      pageTitle,
      isWordPress,
      cmsName,
      wpVersion: isWordPress ? (wpVersion || 'Detected (Hidden for Security)') : null,
      theme: detectedTheme,
      plugins: detectedPlugins,
      totalPluginsDetected: detectedPlugins.length,
      server: serverHeader,
      caching: {
        isCached: hasLitespeed || hasCloudflare || hasWpRocket,
        provider: cacheProvider,
      },
      ssl: {
        isSecure: isHttps,
        protocol: isHttps ? 'TLS 1.3 / HTTPS Active' : 'Unencrypted HTTP',
      },
      httpStatus,
      responseTimeMs,
      checkedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'CMS detection failed' });
  }
});

/**
 * 2. DNS Zone & Records Inspector
 * Endpoint: GET /api/v1/tools/dns-lookup?domain=example.com
 */
toolsRouter.get('/dns-lookup', async (req: Request, res: Response) => {
  try {
    const rawDomain = ((req.query.domain as string) || '').trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    if (!rawDomain) {
      return res.status(400).json({ error: 'domain query parameter is required' });
    }

    const dnsPromises = dns.promises;
    const [aRes, aaaaRes, cnameRes, mxRes, nsRes, txtRes, soaRes] = await Promise.allSettled([
      dnsPromises.resolve4(rawDomain, { ttl: true }),
      dnsPromises.resolve6(rawDomain, { ttl: true }),
      dnsPromises.resolveCname(rawDomain),
      dnsPromises.resolveMx(rawDomain),
      dnsPromises.resolveNs(rawDomain),
      dnsPromises.resolveTxt(rawDomain),
      dnsPromises.resolveSoa(rawDomain),
    ]);

    const records: Array<{ type: string; host: string; value: string; ttl: number; priority?: number }> = [];

    if (aRes.status === 'fulfilled') {
      aRes.value.forEach((rec) => {
        records.push({ type: 'A', host: '@', value: rec.address, ttl: rec.ttl });
      });
    }

    if (aaaaRes.status === 'fulfilled') {
      aaaaRes.value.forEach((rec) => {
        records.push({ type: 'AAAA', host: '@', value: rec.address, ttl: rec.ttl });
      });
    }

    if (cnameRes.status === 'fulfilled') {
      cnameRes.value.forEach((cname) => {
        records.push({ type: 'CNAME', host: 'www', value: cname, ttl: 3600 });
      });
    }

    if (mxRes.status === 'fulfilled') {
      mxRes.value.forEach((mx) => {
        records.push({ type: 'MX', host: '@', value: mx.exchange, priority: mx.priority, ttl: 3600 });
      });
    }

    if (nsRes.status === 'fulfilled') {
      nsRes.value.forEach((ns) => {
        records.push({ type: 'NS', host: '@', value: ns, ttl: 86400 });
      });
    }

    if (txtRes.status === 'fulfilled') {
      txtRes.value.forEach((txtChunks) => {
        records.push({ type: 'TXT', host: '@', value: txtChunks.join(' '), ttl: 3600 });
      });
    }

    return res.json({
      success: true,
      domain: rawDomain,
      recordsCount: records.length,
      records,
      soa: soaRes.status === 'fulfilled' ? soaRes.value : null,
      queriedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'DNS lookup failed' });
  }
});

/**
 * 3. SSL Certificate & Security Inspector
 * Endpoint: GET /api/v1/tools/ssl-checker?domain=example.com
 */
toolsRouter.get('/ssl-checker', async (req: Request, res: Response) => {
  try {
    const rawDomain = ((req.query.domain as string) || '').trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    if (!rawDomain) {
      return res.status(400).json({ error: 'domain query parameter is required' });
    }

    const sslData = await new Promise<{
      isValid: boolean;
      issuer: string;
      subject: string;
      validFrom: string;
      validTo: string;
      daysRemaining: number;
      protocol: string;
    }>((resolve) => {
      const socket = tls.connect(
        443,
        rawDomain,
        { servername: rawDomain, timeout: 5000 },
        () => {
          const cert = socket.getPeerCertificate();
          if (!cert || Object.keys(cert).length === 0) {
            socket.destroy();
            return resolve({
              isValid: false,
              issuer: 'None',
              subject: rawDomain,
              validFrom: 'N/A',
              validTo: 'N/A',
              daysRemaining: 0,
              protocol: 'None',
            });
          }

          const validToDate = new Date(cert.valid_to);
          const daysRemaining = Math.max(0, Math.floor((validToDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const rawIssuer = cert.issuer ? (cert.issuer.O || cert.issuer.CN || 'Trusted CA') : 'Sectigo / Let\'s Encrypt';
          const issuerName = Array.isArray(rawIssuer) ? rawIssuer.join(', ') : String(rawIssuer);
          const rawSubject = cert.subject?.CN || rawDomain;
          const subjectName = Array.isArray(rawSubject) ? rawSubject.join(', ') : String(rawSubject);

          const result = {
            isValid: socket.authorized,
            issuer: issuerName,
            subject: subjectName,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            daysRemaining,
            protocol: socket.getProtocol() || 'TLSv1.3',
          };

          socket.destroy();
          resolve(result);
        }
      );

      socket.on('error', () => {
        resolve({
          isValid: false,
          issuer: 'No SSL / Connection Error',
          subject: rawDomain,
          validFrom: 'N/A',
          validTo: 'N/A',
          daysRemaining: 0,
          protocol: 'HTTP',
        });
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve({
          isValid: false,
          issuer: 'Timeout',
          subject: rawDomain,
          validFrom: 'N/A',
          validTo: 'N/A',
          daysRemaining: 0,
          protocol: 'Timeout',
        });
      });
    });

    return res.json({
      success: true,
      domain: rawDomain,
      ssl: sslData,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'SSL inspection failed' });
  }
});
