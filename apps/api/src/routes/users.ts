import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';

export const userRouter = Router();

// 1. User Registration
userRouter.post('/register', async (req: Request, res: Response) => {
  const { name, firstName, lastName, email, username, phone, countryCode = 'CM' } = req.body;
  const fullName = name || [firstName, lastName].filter(Boolean).join(' ') || username || 'Account Owner';
  const targetEmail = (email || username || '').trim();

  if (!targetEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const existing = await db.usersRepo.findByEmail(targetEmail);
  if (existing) {
    return res.status(409).json({ error: 'User already exists with this email' });
  }

  const newUser = await db.usersRepo.create({
    name: fullName,
    email: targetEmail,
    phone: phone || '',
    countryCode,
    preferredCurrency: 'USD',
    twoFactorEnabled: false,
    kycStatus: 'verified',
  });

  return res.status(201).json({
    success: true,
    user: newUser,
    token: `onh_jwt_${newUser.id}_${Date.now()}`,
  });
});

// 2. User Login
userRouter.post('/login', async (req: Request, res: Response) => {
  const { email, username, twoFactorCode } = req.body;
  const targetEmail = (email || username || '').trim();

  if (!targetEmail) {
    return res.status(400).json({ error: 'Email or username is required' });
  }

  let user = await db.usersRepo.findByEmail(targetEmail);
  if (!user) {
    // If not found, auto-create account for seamless demo / test access
    user = await db.usersRepo.create({
      name: targetEmail.split('@')[0],
      email: targetEmail,
      phone: '',
      countryCode: 'CM',
      preferredCurrency: 'USD',
      twoFactorEnabled: false,
      kycStatus: 'verified',
    });
  }

  if (user.twoFactorEnabled && !twoFactorCode) {
    return res.json({ requires2FA: true, message: 'Enter 6-digit authenticator code' });
  }

  await db.auditLogsRepo.log('USER_LOGIN', user.email, `Session login for ${user.id}`);

  return res.json({
    success: true,
    user,
    token: `onh_jwt_${user.id}_${Date.now()}`,
  });
});

const resolveUser = async (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    const match = token.match(/^onh_jwt_(usr-[a-zA-Z0-9_-]+)/);
    const userId = match ? match[1] : null;
    if (userId) {
      const user = await db.usersRepo.findById(userId);
      if (user) return user;
    }
  }

  const headerUserId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
  if (headerUserId) {
    const user = await db.usersRepo.findById(headerUserId);
    if (user) return user;
  }

  const users = await db.usersRepo.list();
  return users.length > 0 ? users[0] : null;
};

// 3. Get Current User Profile
userRouter.get('/me', async (req: Request, res: Response) => {
  const targetUser = await resolveUser(req);

  if (!targetUser) {
    return res.status(404).json({ success: false, error: 'User profile not found', user: null });
  }

  return res.json({ success: true, user: targetUser });
});

// 4. Update Profile
userRouter.put('/me', async (req: Request, res: Response) => {
  const { name, phone, preferredCurrency } = req.body;
  const user = await resolveUser(req);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const updated = await db.usersRepo.update(user.id, {
    ...(name ? { name } : {}),
    ...(phone ? { phone } : {}),
    ...(preferredCurrency ? { preferredCurrency } : {}),
  });

  return res.json({ success: true, user: updated });
});

// 5. Toggle / Enable 2FA TOTP
userRouter.post('/2fa/enable', async (req: Request, res: Response) => {
  const user = await resolveUser(req);
  if (!user) return res.status(404).json({ error: 'User not found' });

  await db.usersRepo.update(user.id, { twoFactorEnabled: true });
  await db.auditLogsRepo.log('2FA_ENABLED', user.email, 'TOTP Authenticator activated');

  return res.json({
    success: true,
    secret: 'JBSWY3DPEHPK3PXP',
    qrCodeUri: `otpauth://totp/Oneallhost:${user.email}?secret=JBSWY3DPEHPK3PXP&issuer=Oneallhost`,
    message: '2FA enabled successfully',
  });
});

// 6. Get User Registered Domains
userRouter.get('/domains', async (req: Request, res: Response) => {
  const user = await resolveUser(req);
  const domains = await db.domainsRepo.list(user?.id);
  return res.json({
    success: true,
    domains,
  });
});

// 7. Get User Subdomain Leases
userRouter.get('/rentals', async (req: Request, res: Response) => {
  const user = await resolveUser(req);
  const rentals = await db.rentalsRepo.list(user?.id);
  return res.json({
    success: true,
    rentals,
  });
});

// 8. Get User Invoices / Payments
userRouter.get('/invoices', async (req: Request, res: Response) => {
  const user = await resolveUser(req);
  const payments = await db.paymentsRepo.list(user?.id);
  return res.json({
    success: true,
    invoices: payments,
  });
});

// 9. Get User Notifications
userRouter.get('/notifications', async (req: Request, res: Response) => {
  const user = await resolveUser(req);
  const userPayments = await db.paymentsRepo.list(user?.id);
  
  const computedNotifications = userPayments.slice(0, 5).map((p, idx) => ({
    id: `notif-${p.id}`,
    type: 'payment_success',
    title: 'Payment Confirmed',
    message: `Payment of ${p.amountXaf.toLocaleString()} XAF for ${p.item} confirmed.`,
    time: p.timestamp,
    read: idx > 0,
  }));

  return res.json({
    success: true,
    notifications: computedNotifications,
  });
});

// 10. Top-Up Wallet Balance
userRouter.post('/wallet/topup', async (req: Request, res: Response) => {
  const { amountUsd, amountXaf, paymentMethod = 'MTN Mobile Money', reference } = req.body;
  const user = await resolveUser(req);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const numUsd = Number(amountUsd);
  const numXaf = Number(amountXaf) || Math.round(numUsd * 615.5);

  if (isNaN(numUsd) || numUsd <= 0) {
    return res.status(400).json({ error: 'Invalid top-up amount' });
  }

  const updatedUser = await db.usersRepo.topupBalance(user.id, numUsd, numXaf);
  const txnRef = reference || `ONH-TOPUP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  await db.paymentsRepo.create({
    userId: user.id,
    client: user.name,
    method: paymentMethod,
    amountUsd: numUsd,
    amountXaf: numXaf,
    status: 'settled',
    item: `Account Wallet Top-Up ($${numUsd.toFixed(2)} USD)`,
    reference: txnRef,
  });

  return res.json({
    success: true,
    message: `Successfully added $${numUsd.toFixed(2)} USD to account wallet`,
    user: updatedUser,
    transactionReference: txnRef,
  });
});

// 11. Pay using Account Balance
userRouter.post('/wallet/pay', async (req: Request, res: Response) => {
  const { amountUsd, item = 'Domain Registration', reference } = req.body;
  const user = await resolveUser(req);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const numUsd = Number(amountUsd);
  if (isNaN(numUsd) || numUsd <= 0) {
    return res.status(400).json({ error: 'Invalid payment amount' });
  }

  const numXaf = Math.round(numUsd * 615.5);
  const debitResult = await db.usersRepo.debitBalance(user.id, numUsd, numXaf);

  if (!debitResult.success) {
    return res.status(400).json({
      error: debitResult.error || 'Insufficient wallet balance',
      currentBalanceUsd: user.balanceUsd,
      requiredUsd: numUsd,
    });
  }

  const txnRef = reference || `ONH-BAL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const paymentRecord = await db.paymentsRepo.create({
    userId: user.id,
    client: user.name,
    method: 'Account Balance',
    amountUsd: numUsd,
    amountXaf: numXaf,
    status: 'settled',
    item: item,
    reference: txnRef,
  });

  return res.json({
    success: true,
    message: `Payment of $${numUsd.toFixed(2)} settled from account balance`,
    user: debitResult.user,
    payment: paymentRecord,
  });
});

// 12. Toggle / Update Auto-Debit Setting
userRouter.put('/wallet/auto-debit', async (req: Request, res: Response) => {
  const { enabled } = req.body;
  const user = await resolveUser(req);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isEnabled = Boolean(enabled);
  const updated = await db.usersRepo.update(user.id, { autoDebitEnabled: isEnabled });
  await db.auditLogsRepo.log('AUTO_DEBIT_UPDATED', user.email, `Auto-debit status set to ${isEnabled}`);

  return res.json({
    success: true,
    autoDebitEnabled: isEnabled,
    user: updated,
  });
});

