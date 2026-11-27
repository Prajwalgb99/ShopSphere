import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { updateOrderStatusSchema } from '../validators/order.validator.js';
import { z } from 'zod';

const router = Router();

// Protect all admin endpoints
router.use(authenticate, requireRole('ADMIN'));

// Dashboard KPIs
router.get('/dashboard', AdminController.getDashboard);

// Inventory Management
router.get('/inventory', AdminController.getInventory);
router.patch(
  '/inventory/:productId',
  validateRequest(
    z.object({
      params: z.object({ productId: z.string().uuid() }),
      body: z.object({ quantity: z.number().int().nonnegative() }),
    })
  ),
  AdminController.updateStock
);

// Orders Management
router.get('/orders', AdminController.getOrders);
router.put(
  '/orders/:id/status',
  validateRequest(updateOrderStatusSchema),
  OrderController.updateOrderStatus
);

export default router;
