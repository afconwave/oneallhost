import { Request, Response, NextFunction } from 'express';

interface CachedResponse {
  statusCode: number;
  body: any;
  headers: Record<string, string>;
  timestamp: number;
}

const idempotencyStore: Map<string, CachedResponse> = new Map();
const inFlightRequests: Set<string> = new Set();

/**
 * Idempotency & Latency Tracking Middleware
 * Protects financial and domain provisioning routes from duplicate execution.
 */
export const idempotencyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Intercept json response to attach latency and cache response
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    const latency = Date.now() - startTime;
    if (!res.headersSent) {
      res.setHeader('X-Response-Time-Ms', `${latency}ms`);
    }

    const idempotencyKey = (req.headers['x-idempotency-key'] || req.headers['idempotency-key']) as string;
    if (idempotencyKey) {
      inFlightRequests.delete(idempotencyKey);

      // Cache successful and client responses
      if (res.statusCode < 500) {
        idempotencyStore.set(idempotencyKey, {
          statusCode: res.statusCode,
          body,
          headers: {},
          timestamp: Date.now(),
        });
      }
    }

    return originalJson(body);
  };

  // Only enforce idempotency replay checks on mutating operations (POST, PUT, PATCH, DELETE)
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  const idempotencyKey = (req.headers['x-idempotency-key'] || req.headers['idempotency-key']) as string;

  if (!idempotencyKey) {
    return next();
  }

  // 1. Check if request is currently being processed concurrently
  if (inFlightRequests.has(idempotencyKey)) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A concurrent request with the same X-Idempotency-Key is currently processing.',
    });
  }

  // 2. Check if a response is already cached for this idempotency key
  const cached = idempotencyStore.get(idempotencyKey);
  if (cached) {
    if (!res.headersSent) {
      res.setHeader('X-Idempotency-Replay', 'true');
      res.setHeader('X-Response-Time-Ms', `${Date.now() - startTime}ms`);
    }
    return res.status(cached.statusCode).json(cached.body);
  }

  // Mark in-flight
  inFlightRequests.add(idempotencyKey);

  next();
};
