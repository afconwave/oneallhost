import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';

export const adminRouter = Router();

// 1. Dynamic Computed KPI Stats & Overview
adminRouter.get('/stats', async (req: Request, res: Response) => {
  const stats = await db.computeStats();
  return res.json({
    success: true,
    data: stats,
  });
});

// 1.5 Impersonate User via Support PIN
adminRouter.post('/impersonate', async (req: Request, res: Response) => {
  const { pin } = req.body;
  if (!pin) return res.status(400).json({ success: false, error: 'PIN is required' });

  const users = await db.usersRepo.list();
  const user = users.find(u => u.supportPin === pin);

  if (!user) {
    return res.status(404).json({ success: false, error: 'Invalid Support PIN' });
  }

  // Check expiry (if implemented properly, else just pass)
  if (user.supportPinExpiresAt && new Date(user.supportPinExpiresAt) < new Date()) {
    return res.status(400).json({ success: false, error: 'Support PIN has expired' });
  }

  // Log audit
  await db.auditLogsRepo.log('ADMIN_IMPERSONATION', 'admin@oneallhost.com', user.id, { pin_used: pin });

  // In a real app, generate a short-lived JWT token here.
  return res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email },
    impersonationToken: `imp_${user.id}_${Date.now()}`
  });
});

// 1.6 Staff Management
adminRouter.get('/staff', async (req: Request, res: Response) => {
  const users = await db.usersRepo.list();
  const staff = users.filter(u => u.isStaff);
  return res.json({ success: true, staff });
});

adminRouter.post('/staff/invite', async (req: Request, res: Response) => {
  const { email, role } = req.body;
  
  // Fake invite logic for demo: Create a user with staff role directly
  const newUser = await db.usersRepo.create({
    name: email.split('@')[0],
    email,
    phone: '',
    countryCode: 'US',
    preferredCurrency: 'USD',
    twoFactorEnabled: false,
    kycStatus: 'verified',
    supportPin: Math.floor(100000 + Math.random() * 900000).toString(),
    supportPinExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isStaff: true,
    staffRole: role,
    status: 'active'
  });
  
  // Make them staff
  const users = await db.usersRepo.list();
  const user = users.find(u => u.id === newUser.id);
  if (user) {
    user.isStaff = true;
    user.staffRole = role;
  }
  
  await db.auditLogsRepo.log('STAFF_INVITED', 'admin@oneallhost.com', newUser.id, { role });
  return res.json({ success: true, staff: user });
});

adminRouter.post('/staff/:id/revoke', async (req: Request, res: Response) => {
  const users = await db.usersRepo.list();
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    user.isStaff = false;
    user.staffRole = undefined;
    await db.auditLogsRepo.log('STAFF_REVOKED', 'admin@oneallhost.com', user.id);
    return res.json({ success: true });
  }
  return res.status(404).json({ success: false, error: 'Staff member not found' });
});

// 2. Clients & KYC Management
adminRouter.get('/clients', async (req: Request, res: Response) => {
  const clients = await db.usersRepo.list();
  const allDomains = await db.domainsRepo.list();
  const allRentals = await db.rentalsRepo.list();

  const enhancedClients = clients.map((c: any) => ({
    ...c,
    domainsCount: allDomains.filter((d) => d.userId === c.id).length,
    rentalsCount: allRentals.filter((r) => r.userId === c.id).length,
  }));
  return res.json({
    success: true,
    clients: enhancedClients,
  });
});

adminRouter.post('/clients/:id/status', async (req: Request, res: Response) => {
  const { status, reason } = req.body;
  const users = await db.usersRepo.list();
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  // Update in cache/DB
  user.status = status;
  // Let's pretend there's an update method, but for now we just log it and rely on cache
  await db.auditLogsRepo.log('USER_STATUS_CHANGED', 'admin@oneallhost.com', user.id, { new_status: status, reason });
  
  return res.json({ success: true, status });
});

// 3. Domain Registry Overview
adminRouter.get('/domains', async (req: Request, res: Response) => {
  const domains = await db.domainsRepo.list();
  return res.json({
    success: true,
    domains,
  });
});

// 4. Suspend / Flag Domain for Abuse
adminRouter.post('/domains/:id/suspend', async (req: Request, res: Response) => {
  const { reason = 'Terms of Service violation' } = req.body;
  const updated = await db.domainsRepo.update(String(req.params.id), { status: 'suspended' });
  await db.auditLogsRepo.log('DOMAIN_SUSPENDED_BY_ADMIN', 'admin@oneallhost.com', String(req.params.id), { reason });

  return res.json({
    success: true,
    domain: updated,
    message: `Domain ${req.params.id} has been suspended`,
    reason,
    timestamp: new Date().toISOString(),
  });
});

// 5. Subdomain Rentals Management & Conversion Rebate Audits
adminRouter.get('/rentals', async (req: Request, res: Response) => {
  const rentals = await db.rentalsRepo.list();
  return res.json({
    success: true,
    rentals,
  });
});

// 6. Payment Ledger & Settlements (Dynamic Computed Records)
adminRouter.get('/payments', async (req: Request, res: Response) => {
  const payments = await db.paymentsRepo.list();
  return res.json({
    success: true,
    payments,
  });
});

// 7. Dynamic Immutable Audit Logs (Spec §8g)
adminRouter.get('/audit-logs', async (req: Request, res: Response) => {
  const logs = await db.auditLogsRepo.list();
  return res.json({
    success: true,
    logs,
  });
});

// 8. System Announcements
adminRouter.post('/announcements', async (req: Request, res: Response) => {
  const { title, message, type } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, error: 'Title and message are required' });
  }
  const record = await db.announcementsRepo.setActive(title, message, type || 'info');
  return res.json({ success: true, announcement: record });
});

adminRouter.delete('/announcements/active', async (req: Request, res: Response) => {
  await db.announcementsRepo.clearActive();
  return res.json({ success: true });
});

// 9. Pricing & Margins
adminRouter.get('/pricing', async (req: Request, res: Response) => {
  const pricing = await db.pricingRepo.get();
  return res.json({ success: true, pricing });
});

adminRouter.put('/pricing', async (req: Request, res: Response) => {
  const updated = await db.pricingRepo.update(req.body);
  return res.json({ success: true, pricing: updated });
});
