import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db, UserRecord } from '@oneallhost/db';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  staff: boolean;
  role: string;
  iat: number;
  exp: number;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || '';
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a strong value in production');
  }
  return 'dev-only-jwt-secret-change-me';
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

export function signAuthToken(user: UserRecord, ttlSeconds = 60 * 60): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AuthTokenPayload = {
    sub: user.id,
    email: user.email,
    staff: Boolean(user.isStaff),
    role: user.staffRole || (user.isStaff ? 'staff' : 'client'),
    iat: now,
    exp: now + ttlSeconds,
  };
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const sig = crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const data = `${parts[0]}.${parts[1]}`;
    const expected = crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64url');
    const given = parts[2];
    const a = Buffer.from(expected);
    const b = Buffer.from(given);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as AuthTokenPayload;
    if (!payload?.sub || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function publicUser(user: UserRecord) {
  const { passwordHash, totpSecret, ...safe } = user as UserRecord & { passwordHash?: string; totpSecret?: string };
  return safe;
}

export async function resolveAuthenticatedUser(req: Request): Promise<UserRecord | null> {
  const header = String(req.headers.authorization || '');
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  const payload = verifyAuthToken(token);
  if (!payload) return null;
  const user = await db.usersRepo.findById(payload.sub);
  if (!user || user.status !== 'active') return null;
  return user;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await resolveAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required', code: 'SESSION_EXPIRED' });
    }
    (req as any).user = user;
    return next();
  } catch (err: any) {
    return res.status(401).json({ success: false, error: err.message || 'Authentication failed', code: 'SESSION_EXPIRED' });
  }
}

export async function requireStaff(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await resolveAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required', code: 'SESSION_EXPIRED' });
    }
    if (!user.isStaff) {
      return res.status(403).json({ success: false, error: 'Staff access required' });
    }
    (req as any).user = user;
    return next();
  } catch (err: any) {
    return res.status(401).json({ success: false, error: err.message || 'Authentication failed' });
  }
}

export function requireWebhookSecret(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.SWYCHR_WEBHOOK_SECRET || process.env.PAYMENTS_WEBHOOK_SECRET || '';
  if (!expected) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({ error: 'Webhook secret is not configured' });
    }
    return next();
  }
  const provided =
    String(req.headers['x-webhook-secret'] || '') ||
    String(req.headers['x-swychr-signature'] || '') ||
    String(req.body?.signature || '');
  if (!provided || provided.length !== expected.length) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (!crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }
  return next();
}
