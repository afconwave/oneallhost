import { Router, Request, Response } from 'express';
import { db } from '@oneallhost/db';

export const userRouter = Router();

// 1. User Registration
userRouter.post('/register', (req: Request, res: Response) => {
  const { name, email, phone, countryCode = 'CM' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.usersRepo.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'User already exists with this email' });
  }

  const newUser = db.usersRepo.create({
    name,
    email,
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
userRouter.post('/login', (req: Request, res: Response) => {
  const { email, twoFactorCode } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.usersRepo.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.twoFactorEnabled && !twoFactorCode) {
    return res.json({ requires2FA: true, message: 'Enter 6-digit authenticator code' });
  }

  db.auditLogsRepo.log('USER_LOGIN', user.email, `Session login for ${user.id}`);

  return res.json({
    success: true,
    user,
    token: `onh_jwt_${user.id}_${Date.now()}`,
  });
});

// 3. Get Current User Profile
userRouter.get('/me', (req: Request, res: Response) => {
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  return res.json({ success: true, user });
});

// 4. Update Profile
userRouter.put('/me', (req: Request, res: Response) => {
  const { name, phone, preferredCurrency } = req.body;
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const updated = db.usersRepo.update(user.id, {
    ...(name ? { name } : {}),
    ...(phone ? { phone } : {}),
    ...(preferredCurrency ? { preferredCurrency } : {}),
  });

  return res.json({ success: true, user: updated });
});

// 5. Toggle / Enable 2FA TOTP
userRouter.post('/2fa/enable', (req: Request, res: Response) => {
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  if (!user) return res.status(404).json({ error: 'User not found' });

  db.usersRepo.update(user.id, { twoFactorEnabled: true });
  db.auditLogsRepo.log('2FA_ENABLED', user.email, 'TOTP Authenticator activated');

  return res.json({
    success: true,
    secret: 'JBSWY3DPEHPK3PXP',
    qrCodeUri: `otpauth://totp/Oneallhost:${user.email}?secret=JBSWY3DPEHPK3PXP&issuer=Oneallhost`,
    message: '2FA enabled successfully',
  });
});

// 6. Get User Registered Domains (Dynamic Compute from db)
userRouter.get('/domains', (req: Request, res: Response) => {
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  const domains = db.domainsRepo.list(user?.id);
  return res.json({
    success: true,
    domains,
  });
});

// 7. Get User Subdomain Leases (Dynamic Compute from db)
userRouter.get('/rentals', (req: Request, res: Response) => {
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  const rentals = db.rentalsRepo.list(user?.id);
  return res.json({
    success: true,
    rentals,
  });
});

// 8. Get User Invoices / Payments (Dynamic Compute from db)
userRouter.get('/invoices', (req: Request, res: Response) => {
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  const payments = db.paymentsRepo.list(user?.id);
  return res.json({
    success: true,
    invoices: payments,
  });
});

// 9. Get User Notifications (Computed dynamically from real activity)
userRouter.get('/notifications', (req: Request, res: Response) => {
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  const userPayments = db.paymentsRepo.list(user?.id);
  
  // Dynamically derive notifications from real transactions & events
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
userRouter.post('/wallet/topup', (req: Request, res: Response) => {
  const { amountUsd, amountXaf, paymentMethod = 'MTN Mobile Money', reference } = req.body;
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const numUsd = Number(amountUsd);
  const numXaf = Number(amountXaf) || Math.round(numUsd * 615.5);

  if (isNaN(numUsd) || numUsd <= 0) {
    return res.status(400).json({ error: 'Invalid top-up amount' });
  }

  const updatedUser = db.usersRepo.topupBalance(user.id, numUsd, numXaf);
  const txnRef = reference || `ONH-TOPUP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Record settled transaction in ledger
  db.paymentsRepo.create({
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
userRouter.post('/wallet/pay', (req: Request, res: Response) => {
  const { amountUsd, item = 'Domain Registration', reference } = req.body;
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const numUsd = Number(amountUsd);
  if (isNaN(numUsd) || numUsd <= 0) {
    return res.status(400).json({ error: 'Invalid payment amount' });
  }

  const numXaf = Math.round(numUsd * 615.5);
  const debitResult = db.usersRepo.debitBalance(user.id, numUsd, numXaf);

  if (!debitResult.success) {
    return res.status(400).json({
      error: debitResult.error || 'Insufficient wallet balance',
      currentBalanceUsd: user.balanceUsd,
      requiredUsd: numUsd,
    });
  }

  const txnRef = reference || `ONH-BAL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Record settled payment in ledger
  const paymentRecord = db.paymentsRepo.create({
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
userRouter.put('/wallet/auto-debit', (req: Request, res: Response) => {
  const { enabled } = req.body;
  const user = db.usersRepo.findById('usr-1') || db.usersRepo.list()[0];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isEnabled = Boolean(enabled);
  const updated = db.usersRepo.update(user.id, { autoDebitEnabled: isEnabled });
  db.auditLogsRepo.log('AUTO_DEBIT_UPDATED', user.email, `Auto-debit status set to ${isEnabled}`);

  return res.json({
    success: true,
    autoDebitEnabled: isEnabled,
    user: updated,
  });
});
