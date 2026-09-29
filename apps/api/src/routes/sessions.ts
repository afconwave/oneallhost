import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { db, attachAuthSecrets } from '@oneallhost/db';
import { verifyTotpCode } from '../utils/crypto';
import { publicUser, requireAuth, signAuthToken } from '../middleware/auth';
import { mailerService } from '../services/mailer';

const devices = new Map<string, { userId: string; deviceId: string; lastSeen: number }>();
const emailOtps = new Map<string, { hash: string; exp: number }>();

export const sessionsRouter = Router();
export const SESSION_TTL_SECONDS = 60 * 60;

function hashOtp(email: string, code: string) {
  return crypto.createHash('sha256').update(`${email}:${code}`).digest('hex');
}

sessionsRouter.get('/policy', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    ttlSeconds: SESSION_TTL_SECONDS,
    otpChannel: 'smtp',
    smtpReady: mailerService.configured(),
  });
});

sessionsRouter.post('/remember-device', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const deviceId = String(req.body?.deviceId || '').slice(0, 80);
  if (!deviceId) return res.status(400).json({ error: 'deviceId is required' });
  devices.set(`${user.id}:${deviceId}`, { userId: user.id, deviceId, lastSeen: Date.now() });
  return res.json({ success: true, ttlSeconds: SESSION_TTL_SECONDS });
});

sessionsRouter.post('/challenge', async (req: Request, res: Response) => {
  const email = String(req.body?.email || '').toLowerCase().trim();
  const deviceId = String(req.body?.deviceId || '');
  if (!email || !deviceId) return res.status(400).json({ error: 'email and deviceId are required' });
  const user = await db.usersRepo.findByEmail(email);
  if (!user) return res.json({ success: true, sent: false });
  if (!devices.get(`${user.id}:${deviceId}`)) {
    return res.status(403).json({ error: 'Unknown device. Sign in with password.' });
  }
  const code = String(crypto.randomInt(100000, 999999));
  emailOtps.set(email, { hash: hashOtp(email, code), exp: Date.now() + 10 * 60 * 1000 });
  const sent = await mailerService.sendOtp(email, code);
  if (!sent.success) {
    emailOtps.delete(email);
    return res.status(503).json({ error: sent.error || 'Could not send OTP email' });
  }
  return res.json({ success: true, sent: true, channel: 'smtp', expiresInSeconds: 600 });
});

sessionsRouter.post('/resume', async (req: Request, res: Response) => {
  const { email, deviceId, otp } = req.body || {};
  const targetEmail = String(email || '').toLowerCase().trim();
  if (!targetEmail || !deviceId || !otp) {
    return res.status(400).json({ error: 'email, deviceId, and otp are required' });
  }
  const raw = await db.usersRepo.findByEmail(targetEmail);
  const user = raw ? attachAuthSecrets(raw) : undefined;
  if (!user) return res.status(401).json({ error: 'Invalid session resume' });
  const known = devices.get(`${user.id}:${deviceId}`);
  if (!known) return res.status(403).json({ error: 'Unknown device. Sign in with password.' });

  const pending = emailOtps.get(targetEmail);
  const emailOk =
    pending &&
    pending.exp > Date.now() &&
    crypto.timingSafeEqual(Buffer.from(pending.hash), Buffer.from(hashOtp(targetEmail, String(otp))));
  const totpOk = Boolean(user.totpSecret && verifyTotpCode(user.totpSecret, String(otp)));
  if (!emailOk && !totpOk) return res.status(401).json({ error: 'Invalid or expired code' });
  emailOtps.delete(targetEmail);
  known.lastSeen = Date.now();
  return res.json({
    success: true,
    user: publicUser(user),
    token: signAuthToken(user, SESSION_TTL_SECONDS),
    ttlSeconds: SESSION_TTL_SECONDS,
  });
});
