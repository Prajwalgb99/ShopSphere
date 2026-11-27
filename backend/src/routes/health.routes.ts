import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ShopSphere API is operating normally',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
