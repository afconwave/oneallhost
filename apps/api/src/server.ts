import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { domainRouter } from './routes/domains';
import { registerDomainPaid, renewDomainPaid, transferDomainPaid } from './routes/domain-writes';
import { rentalRouter } from './routes/rentals';
import { paymentRouter } from './routes/payments';
import { invoiceRouter } from './routes/invoices';
import { receiptsRouter } from './routes/receipts';
import { sessionsRouter } from './routes/sessions';
import { healthRouter } from './routes/health';
import { userRouter } from './routes/users';
import { adminRouter } from './routes/admin';
import { toolsRouter } from './routes/tools';
import { hostingRouter } from './routes/hosting';
import { ordersRouter } from './routes/orders';
import ticketsRouter from './routes/tickets';
import { createRateLimiter } from './middleware/rate-limiter';
import { idempotencyMiddleware } from './middleware/idempotency';
import { requireAuth, requireStaff } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 4000;
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,https://oneallhost.vercel.app')
  .split(',').map((s) => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '256kb' }));
app.use(idempotencyMiddleware);
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(createRateLimiter({ maxRequests: 120, windowMs: 60 * 1000 }));

function requireAuthForDomainWrites(req: Request, res: Response, next: NextFunction) {
  const path = req.path || '';
  const publicRead = req.method === 'GET' && (path.startsWith('/search') || path.startsWith('/whois') || path.startsWith('/dns/probe'));
  if (publicRead) return next();
  return requireAuth(req, res, next);
}

const v1Router = express.Router();
v1Router.use('/users', userRouter);
v1Router.use('/sessions', sessionsRouter);
v1Router.use('/admin', requireStaff, adminRouter);
v1Router.post('/domains/register', requireAuth, registerDomainPaid);
v1Router.post('/domains/renew', requireAuth, renewDomainPaid);
v1Router.post('/domains/transfer', requireAuth, transferDomainPaid);
v1Router.use('/domains', requireAuthForDomainWrites, domainRouter);
v1Router.use('/tools', createRateLimiter({ maxRequests: 30, windowMs: 60 * 1000 }), toolsRouter);
v1Router.use('/rentals', rentalRouter);
v1Router.use('/payments', paymentRouter);
v1Router.use('/orders', ordersRouter);
v1Router.use('/invoices', invoiceRouter);
v1Router.use('/receipts', receiptsRouter);
v1Router.use('/health', healthRouter);
v1Router.use('/hosting', hostingRouter);
v1Router.use('/tickets', ticketsRouter);

app.use('/api/v1', v1Router);
app.use('/api', v1Router);

app.get('/', (_req: Request, res: Response) => {
  res.json({ name: 'Oneallhost Backend API Gateway', version: '1.4.0', current_version: 'v1' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`[Oneallhost API] v1 on :${PORT}`));
}
export default app;
