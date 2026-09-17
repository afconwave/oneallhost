import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window store with automated garbage collection
const memoryStore = new Map<string, RateLimitRecord>();

// Automatic garbage collection sweep every 60 seconds to prevent unbounded memory leaks
const GC_INTERVAL_MS = 60 * 1000;
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (now > record.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, GC_INTERVAL_MS);
  if (timer.unref) {
    timer.unref(); // Don't prevent process from exiting
  }
}

/**
 * Extracts client IP accurately from proxy headers or direct connection
 */
export function getClientIp(req: Request): string {
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp) return cfIp.trim();

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp) return realIp.trim();

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }

  return req.socket.remoteAddress || req.ip || '127.0.0.1';
}

export function createRateLimiter(options: { maxRequests: number; windowMs: number }) {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Whitelist health checks and static probes to prevent monitor outages
    if (req.path === '/health' || req.path === '/api/v1/health' || req.path === '/api/health') {
      return next();
    }

    const ip = getClientIp(req);
    const key = `${ip}_${req.baseUrl || ''}${req.path}`;
    const now = Date.now();

    const record = memoryStore.get(key);

    if (!record || now > record.resetAt) {
      const resetAt = now + options.windowMs;
      memoryStore.set(key, { count: 1, resetAt });

      res.setHeader('RateLimit-Limit', String(options.maxRequests));
      res.setHeader('RateLimit-Remaining', String(options.maxRequests - 1));
      res.setHeader('RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
      return next();
    }

    const remaining = Math.max(0, options.maxRequests - record.count);
    res.setHeader('RateLimit-Limit', String(options.maxRequests));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(Math.ceil(record.resetAt / 1000)));

    if (record.count >= options.maxRequests) {
      const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfterSec));

      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait before executing further requests.',
        retryAfterMs: record.resetAt - now,
        retryAfterSeconds: retryAfterSec,
      });
    }

    record.count += 1;
    res.setHeader('RateLimit-Remaining', String(Math.max(0, options.maxRequests - record.count)));
    return next();
  };
}
