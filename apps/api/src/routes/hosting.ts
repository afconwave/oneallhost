import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';
import { requireStaff } from '../middleware/auth';

export const hostingRouter = Router();

hostingRouter.post('/waitlist', async (req: Request, res: Response) => {
  try {
    const { email, tier = 'professional' } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const result = await db.waitlistRepo.join(email, tier, ip);
    return res.status(201).json({
      success: true,
      message: `Enrolled for ${tier.toUpperCase()} Cloud Tier`,
      queueNumber: result.queueNumber,
      email,
      tier,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to join waitlist' });
  }
});

hostingRouter.get('/waitlist', requireStaff, async (_req: Request, res: Response) => {
  try {
    const list = await db.waitlistRepo.list();
    return res.json({ success: true, total: list.length, waitlist: list });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch waitlist' });
  }
});
