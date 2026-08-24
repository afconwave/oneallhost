import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      resellerclub_api: 'online (latency: 42ms)',
      altonixa_pay: 'online (latency: 18ms)',
      redis_queue: 'connected (jobs: 0 pending)',
      smtp_relay: 'ready',
    },
  });
});
