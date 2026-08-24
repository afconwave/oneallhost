import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitStore>();

export function createRateLimiter(options: { maxRequests: number; windowMs: number }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || '127.0.0.1';
    const key = `${ip}_${req.path}`;
    const now = Date.now();

    const record = memoryStore.get(key);

    if (!record || now > record.resetAt) {
      memoryStore.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (record.count >= options.maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait before executing further requests.',
        retryAfterMs: record.resetAt - now,
      });
    }

    record.count += 1;
    return next();
  };
}
