import dns from 'dns';
import net from 'net';

const BLOCKED_HOST_SUFFIXES = ['.local', '.internal', '.lan', '.localhost'];
const BLOCKED_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  'metadata.google.internal.',
]);

export function isPrivateIp(ip: string): boolean {
  const clean = ip.replace(/^\[/, '').replace(/\]$/, '');
  if (clean.startsWith('::ffff:')) return isPrivateIp(clean.slice(7));
  if (clean === '::1' || clean === '0.0.0.0') return true;
  if (net.isIP(clean) === 4) {
    const parts = clean.split('.').map(Number);
    const [a, b] = parts;
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    return false;
  }
  if (net.isIP(clean) === 6) {
    const lower = clean.toLowerCase();
    if (lower === '::1') return true;
    if (lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80')) return true;
    return false;
  }
  return true;
}

export function sanitizeHostname(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.$/, '');
}

export function isBlockedHostname(host: string): boolean {
  const clean = sanitizeHostname(host);
  if (!clean || clean.includes(' ') || clean.includes('@')) return true;
  if (BLOCKED_HOSTS.has(clean)) return true;
  if (BLOCKED_HOST_SUFFIXES.some((s) => clean.endsWith(s))) return true;
  if (net.isIP(clean) && isPrivateIp(clean)) return true;
  return false;
}

export async function assertSafePublicHost(host: string): Promise<string> {
  const clean = sanitizeHostname(host);
  if (!clean) throw new Error('Host is required');
  if (isBlockedHostname(clean)) {
    throw new Error('Access to private, local, or cloud metadata endpoints is prohibited.');
  }
  if (net.isIP(clean)) {
    if (isPrivateIp(clean)) {
      throw new Error('Access to private, local, or cloud metadata endpoints is prohibited.');
    }
    return clean;
  }
  const resolved = await dns.promises.lookup(clean, { all: true });
  if (!resolved.length) throw new Error(`Could not resolve ${clean}`);
  for (const rec of resolved) {
    if (isPrivateIp(rec.address)) {
      throw new Error('Access to private, local, or cloud metadata endpoints is prohibited.');
    }
  }
  return clean;
}

export async function safeFetch(url: string, init: RequestInit = {}, maxRedirects = 2): Promise<Response> {
  const target = new URL(url);
  await assertSafePublicHost(target.hostname);
  const response = await fetch(url, {
    ...init,
    redirect: 'manual',
  });
  if ([301, 302, 303, 307, 308].includes(response.status) && maxRedirects > 0) {
    const location = response.headers.get('location');
    if (!location) return response;
    const next = new URL(location, url);
    if (!['http:', 'https:'].includes(next.protocol)) {
      throw new Error('Blocked non-HTTP redirect');
    }
    return safeFetch(next.toString(), init, maxRedirects - 1);
  }
  return response;
}
