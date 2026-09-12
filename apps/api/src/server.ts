import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { domainRouter } from './routes/domains';
import { rentalRouter } from './routes/rentals';
import { paymentRouter } from './routes/payments';
import { invoiceRouter } from './routes/invoices';
import { healthRouter } from './routes/health';
import { userRouter } from './routes/users';
import { adminRouter } from './routes/admin';
import { toolsRouter } from './routes/tools';
import { createRateLimiter } from './middleware/rate-limiter';
import { idempotencyMiddleware } from './middleware/idempotency';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(idempotencyMiddleware);

// Security Headers Middleware (Protection against XSS, Clickjacking, MIME sniffing, etc.)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Global Rate Limiting: 120 requests per minute per IP (Spec §8i)
app.use(createRateLimiter({ maxRequests: 120, windowMs: 60 * 1000 }));

// Router for API Version 1 (v1)
const v1Router = express.Router();
v1Router.use('/users', userRouter);
v1Router.use('/admin', adminRouter);
v1Router.use('/domains', domainRouter);
v1Router.use('/tools', toolsRouter);
v1Router.use('/rentals', rentalRouter);
v1Router.use('/payments', paymentRouter);
v1Router.use('/invoices', invoiceRouter);
v1Router.use('/health', healthRouter);

// Mount versioned endpoint `/api/v1` as the primary standard
app.use('/api/v1', v1Router);

// Backwards-compatibility alias for `/api/*`
app.use('/api', v1Router);

// Production Global Safe Error Handler (Never expose stack traces to client)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An internal server error occurred. Please contact support.'
      : err.message || 'Internal Server Error',
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Oneallhost Backend API Gateway',
    version: '1.0.0',
    current_version: 'v1',
    endpoints: {
      v1_base: '/api/v1',
      users: '/api/v1/users',
      admin: '/api/v1/admin',
      domains: '/api/v1/domains',
      rentals: '/api/v1/rentals',
      payments: '/api/v1/payments',
      invoices: '/api/v1/invoices',
      health: '/api/v1/health',
    },
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Oneallhost API Gateway] v1 running on http://localhost:${PORT}/api/v1`);
  });
}

export default app;
