import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createOrderSchema), OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/:id/cancel', OrderController.cancelOrder);

// Admin status update
router.put(
  '/:id/status',
  requireRole('ADMIN'),
  validateRequest(updateOrderStatusSchema),
  OrderController.updateOrderStatus
);

export default router;
