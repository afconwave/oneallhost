import { Router, Request, Response } from 'express';
import { db, attachAuthSecrets } from '@oneallhost/db';
import { verifyTotpCode } from '../utils/crypto';
import { publicUser, requireAuth, signAuthToken, verifyAuthToken } from '../middleware/auth';

const devices = new Map<string, { userId: string; deviceId: string; lastSeen: number }>();

export const sessionsRouter = Router();

export const SESSION_TTL_SECONDS = 60 * 60;

sessionsRouter.get('/policy', (_req: Request, res: Response) => {
  return res.json({ success: true, ttlSeconds: SESSION_TTL_SECONDS, otpOnExpiry: true });
});

sessionsRouter.post('/remember-device', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const deviceId = String(req.body?.deviceId || '').slice(0, 80);
  if (!deviceId) return res.status(400).json({ error: 'deviceId is required' });
  devices.set(`${user.id}:${deviceId}`, { userId: user.id, deviceId, lastSeen: Date.now() });
  return res.json({ success: true, ttlSeconds: SESSION_TTL_SECONDS });
});

sessionsRouter.post('/resume', async (req: Request, res: Response) => {
  const { email, deviceId, otp, expiredToken } = req.body || {};
  const targetEmail = String(email || '').toLowerCase().trim();
  if (!targetEmail || !deviceId || !otp) {
    return res.status(400).json({ error: 'email, deviceId, and otp are required' });
  }
  const raw = await db.usersRepo.findByEmail(targetEmail);
  const user = raw ? attachAuthSecrets(raw) : undefined;
  if (!user) return res.status(401).json({ error: 'Invalid session resume' });

  const known = devices.get(`${user.id}:${deviceId}`);
  if (!known) return res.status(403).json({ error: 'Unknown device. Sign in with password.' });

  if (expiredToken) {
    const payload = verifyAuthToken(String(expiredToken));
    if (payload && payload.sub !== user.id) {
      return res.status(401).json({ error: 'Token does not match this account' });
    }
  }

  if (!user.totpSecret || !verifyTotpCode(user.totpSecret, String(otp))) {
    return res.status(401).json({ error: 'Invalid authenticator code' });
  }

  known.lastSeen = Date.now();
  return res.json({
    success: true,
    user: publicUser(user),
    token: signAuthToken(user, SESSION_TTL_SECONDS),
    ttlSeconds: SESSION_TTL_SECONDS,
  });
});
