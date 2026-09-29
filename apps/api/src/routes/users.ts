import { Router, Request, Response } from 'express';
import { db, rememberAuthSecrets, attachAuthSecrets } from '@oneallhost/db';
import { hashPassword, verifyPassword, generateTotpSecret, verifyTotpCode } from '../utils/crypto';
import { publicUser, requireAuth, signAuthToken } from '../middleware/auth';

export const userRouter = Router();

function passwordValid(password: string): string | null {
  if (!password || password.length < 10) return 'Password must be at least 10 characters';
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include upper, lower, and numeric characters';
  }
  return null;
}

userRouter.post('/register', async (req: Request, res: Response) => {
  const { name, firstName, lastName, email, username, phone, countryCode = 'CM', password } = req.body;
  const fullName = name || [firstName, lastName].filter(Boolean).join(' ') || username || 'Account Owner';
  const targetEmail = String(email || username || '').trim().toLowerCase();

  if (!targetEmail || !targetEmail.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  const pwdError = passwordValid(String(password || ''));
  if (pwdError) return res.status(400).json({ error: pwdError });

  const existing = await db.usersRepo.findByEmail(targetEmail);
  if (existing) {
    return res.status(409).json({ error: 'User already exists with this email' });
  }

  const passwordHash = hashPassword(password);
  const newUser = await db.usersRepo.create({
    name: fullName,
    email: targetEmail,
    phone: phone || '',
    countryCode,
    preferredCurrency: 'USD',
    twoFactorEnabled: false,
    kycStatus: 'unverified',
    passwordHash,
  });
  rememberAuthSecrets(newUser.id, { passwordHash });

  return res.status(201).json({
    success: true,
    user: publicUser(newUser),
    token: signAuthToken(newUser),
  });
});

userRouter.post('/login', async (req: Request, res: Response) => {
  const { email, username, password, twoFactorCode } = req.body;
  const targetEmail = String(email || username || '').trim().toLowerCase();
  if (!targetEmail || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const raw = await db.usersRepo.findByEmail(targetEmail);
  const user = raw ? attachAuthSecrets(raw) : undefined;
  if (!user || !user.passwordHash || !verifyPassword(String(password), user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Account is not active' });
  }

  if (user.twoFactorEnabled) {
    if (!twoFactorCode) {
      return res.json({ requires2FA: true, message: 'Enter 6-digit authenticator code' });
    }
    if (!user.totpSecret || !verifyTotpCode(user.totpSecret, String(twoFactorCode))) {
      return res.status(401).json({ error: 'Invalid authenticator code' });
    }
  }

  await db.auditLogsRepo.log('USER_LOGIN', user.email, `Session login for ${user.id}`);
  return res.json({
    success: true,
    user: publicUser(user),
    token: signAuthToken(user),
  });
});

userRouter.use(requireAuth);

userRouter.get('/me', async (req: Request, res: Response) => {
  return res.json({ success: true, user: publicUser((req as any).user) });
});

userRouter.put('/me', async (req: Request, res: Response) => {
  const { name, phone, preferredCurrency } = req.body;
  const user = (req as any).user;
  const updated = await db.usersRepo.update(user.id, {
    ...(name ? { name } : {}),
    ...(phone ? { phone } : {}),
    ...(preferredCurrency ? { preferredCurrency } : {}),
  });
  return res.json({ success: true, user: updated ? publicUser(updated) : publicUser(user) });
});

userRouter.post('/2fa/enable', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const secret = generateTotpSecret();
  await db.usersRepo.update(user.id, { totpSecret: secret, twoFactorEnabled: false });
  rememberAuthSecrets(user.id, { totpSecret: secret });
  return res.json({
    success: true,
    secret,
    qrCodeUri: `otpauth://totp/Oneallhost:${user.email}?secret=${secret}&issuer=Oneallhost`,
    message: 'Scan the secret with an authenticator app, then call /2fa/confirm',
  });
});

userRouter.post('/2fa/confirm', async (req: Request, res: Response) => {
  const raw = await db.usersRepo.findById((req as any).user.id);
  const user = raw ? attachAuthSecrets(raw) : undefined;
  const code = String(req.body?.code || '');
  if (!user?.totpSecret || !verifyTotpCode(user.totpSecret, code)) {
    return res.status(400).json({ error: 'Invalid authenticator code' });
  }
  await db.usersRepo.update(user.id, { twoFactorEnabled: true });
  await db.auditLogsRepo.log('2FA_ENABLED', user.email, 'TOTP Authenticator activated');
  return res.json({ success: true, message: '2FA enabled successfully' });
});

userRouter.get('/domains', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const domains = await db.domainsRepo.list(user.id);
  return res.json({ success: true, domains });
});

userRouter.get('/rentals', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const rentals = await db.rentalsRepo.list(user.id);
  return res.json({ success: true, rentals });
});

userRouter.get('/invoices', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const payments = await db.paymentsRepo.list(user.id);
  return res.json({ success: true, invoices: payments });
});

userRouter.get('/notifications', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userPayments = await db.paymentsRepo.list(user.id);
  const computedNotifications = userPayments.slice(0, 5).map((p, idx) => ({
    id: `notif-${p.id}`,
    type: 'payment_success',
    title: p.status === 'settled' || p.status === 'completed' ? 'Payment Confirmed' : 'Payment Update',
    message: `Payment of ${p.amountXaf.toLocaleString()} XAF for ${p.item} is ${p.status}.`,
    time: p.timestamp,
    read: idx > 0,
  }));
  return res.json({ success: true, notifications: computedNotifications });
});

userRouter.post('/wallet/topup', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { amountUsd, amountXaf, paymentMethod = 'MTN Mobile Money', reference } = req.body;
  const numUsd = Number(amountUsd);
  const numXaf = Number(amountXaf) || Math.round(numUsd * 615.5);
  if (isNaN(numUsd) || numUsd <= 0) {
    return res.status(400).json({ error: 'Invalid top-up amount' });
  }

  const txnRef = reference || `ONH-TOPUP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  await db.paymentsRepo.create({
    userId: user.id,
    client: user.name,
    method: paymentMethod,
    amountUsd: numUsd,
    amountXaf: numXaf,
    status: 'pending',
    item: `Account Wallet Top-Up ($${numUsd.toFixed(2)} USD)`,
    reference: txnRef,
  });

  return res.json({
    success: true,
    pending: true,
    message: 'Top-up recorded as pending. Balance credits after a verified payment webhook.',
    transactionReference: txnRef,
  });
});

userRouter.post('/wallet/pay', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { amountUsd, item = 'Domain Registration', reference } = req.body;
  const numUsd = Number(amountUsd);
  if (isNaN(numUsd) || numUsd <= 0) {
    return res.status(400).json({ error: 'Invalid payment amount' });
  }

  const numXaf = Math.round(numUsd * 615.5);
  const debitResult = await db.usersRepo.debitBalance(user.id, numUsd, numXaf);
  if (!debitResult.success || !debitResult.user) {
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
    item,
    reference: txnRef,
  });

  return res.json({
    success: true,
    message: `Payment of $${numUsd.toFixed(2)} settled from account balance`,
    user: publicUser(debitResult.user),
    payment: paymentRecord,
  });
});

userRouter.put('/wallet/auto-debit', async (req: Request, res: Response) => {
  const user = (req as any).user;
  const isEnabled = Boolean(req.body.enabled);
  const updated = await db.usersRepo.update(user.id, { autoDebitEnabled: isEnabled });
  await db.auditLogsRepo.log('AUTO_DEBIT_UPDATED', user.email, `Auto-debit status set to ${isEnabled}`);
  return res.json({
    success: true,
    autoDebitEnabled: isEnabled,
    user: updated ? publicUser(updated) : publicUser(user),
  });
});
