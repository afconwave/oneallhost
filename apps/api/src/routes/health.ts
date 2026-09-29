import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      supabase: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
      namecheap: Boolean(process.env.NAMECHEAP_API_KEY),
      swychr: Boolean(process.env.SWYCHR_API_KEY),
      smtp: Boolean(process.env.SMTP_HOST),
    },
  });
});
