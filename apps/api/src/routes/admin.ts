import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';
import { publicUser, signAuthToken } from '../middleware/auth';

export const adminRouter = Router();

adminRouter.get('/stats', async (_req: Request, res: Response) => {
  return res.json({ success: true, data: await db.computeStats() });
});

adminRouter.post('/impersonate', async (req: Request, res: Response) => {
  const staff = (req as any).user;
  const { pin } = req.body || {};
  if (!pin) return res.status(400).json({ success: false, error: 'PIN is required' });
  const users = await db.usersRepo.list();
  const user = users.find((u) => u.supportPin === pin);
  if (!user) return res.status(404).json({ success: false, error: 'Invalid Support PIN' });
  if (user.supportPinExpiresAt && new Date(user.supportPinExpiresAt) < new Date()) {
    return res.status(400).json({ success: false, error: 'Support PIN has expired' });
  }
  await db.auditLogsRepo.log('ADMIN_IMPERSONATION', staff.email, user.id, { pin_used: 'redacted' });
  return res.json({
    success: true,
    user: publicUser(user),
    impersonationToken: signAuthToken(user, 15 * 60),
  });
});

adminRouter.get('/staff', async (_req: Request, res: Response) => {
  const staff = (await db.usersRepo.list()).filter((u) => u.isStaff);
  return res.json({ success: true, staff: staff.map(publicUser) });
});

adminRouter.post('/staff/invite', async (req: Request, res: Response) => {
  const actor = (req as any).user;
  const { email, role } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email is required' });
  const existing = await db.usersRepo.findByEmail(String(email).toLowerCase());
  if (existing) {
    const updated = await db.usersRepo.update(existing.id, { isStaff: true, staffRole: role || 'support' });
    await db.auditLogsRepo.log('STAFF_INVITED', actor.email, existing.id, { role });
    return res.json({ success: true, staff: updated ? publicUser(updated) : publicUser(existing) });
  }
  return res.status(404).json({ error: 'User must register before they can be promoted to staff' });
});

adminRouter.post('/staff/:id/revoke', async (req: Request, res: Response) => {
  const actor = (req as any).user;
  const updated = await db.usersRepo.update(String(req.params.id), { isStaff: false, staffRole: undefined });
  if (!updated) return res.status(404).json({ success: false, error: 'Staff member not found' });
  await db.auditLogsRepo.log('STAFF_REVOKED', actor.email, updated.id);
  return res.json({ success: true });
});

adminRouter.get('/clients', async (_req: Request, res: Response) => {
  const clients = await db.usersRepo.list();
  const allDomains = await db.domainsRepo.list();
  const allRentals = await db.rentalsRepo.list();
  return res.json({
    success: true,
    clients: clients.map((c) => ({
      ...publicUser(c),
      domainsCount: allDomains.filter((d) => d.userId === c.id).length,
      rentalsCount: allRentals.filter((r) => r.userId === c.id).length,
    })),
  });
});

adminRouter.post('/clients/:id/status', async (req: Request, res: Response) => {
  const { status, reason } = req.body || {};
  const updated = await db.usersRepo.update(String(req.params.id), { status });
  if (!updated) return res.status(404).json({ success: false, error: 'User not found' });
  await db.auditLogsRepo.log('USER_STATUS_CHANGED', (req as any).user.email, updated.id, { new_status: status, reason });
  return res.json({ success: true, status });
});

adminRouter.get('/domains', async (_req: Request, res: Response) => {
  return res.json({ success: true, domains: await db.domainsRepo.list() });
});

adminRouter.post('/domains/:id/suspend', async (req: Request, res: Response) => {
  const { reason = 'Terms of Service violation' } = req.body || {};
  const updated = await db.domainsRepo.update(String(req.params.id), { status: 'suspended' });
  await db.auditLogsRepo.log('DOMAIN_SUSPENDED_BY_ADMIN', (req as any).user.email, String(req.params.id), { reason });
  return res.json({ success: true, domain: updated, reason });
});

adminRouter.get('/rentals', async (_req: Request, res: Response) => {
  return res.json({ success: true, rentals: await db.rentalsRepo.list() });
});

adminRouter.get('/payments', async (_req: Request, res: Response) => {
  return res.json({ success: true, payments: await db.paymentsRepo.list() });
});

adminRouter.get('/audit-logs', async (_req: Request, res: Response) => {
  return res.json({ success: true, logs: await db.auditLogsRepo.list() });
});

adminRouter.post('/announcements', async (req: Request, res: Response) => {
  const { title, message, type } = req.body || {};
  if (!title || !message) return res.status(400).json({ success: false, error: 'Title and message are required' });
  const record = await db.announcementsRepo.setActive(title, message, type || 'info');
  return res.json({ success: true, announcement: record });
});

adminRouter.delete('/announcements/active', async (_req: Request, res: Response) => {
  await db.announcementsRepo.clearActive();
  return res.json({ success: true });
});

adminRouter.get('/pricing', async (_req: Request, res: Response) => {
  return res.json({ success: true, pricing: await db.pricingRepo.get() });
});

adminRouter.put('/pricing', async (req: Request, res: Response) => {
  const updated = await db.pricingRepo.update(req.body || {});
  await db.auditLogsRepo.log('PRICING_UPDATED', (req as any).user.email, 'catalog');
  return res.json({ success: true, pricing: updated });
});
