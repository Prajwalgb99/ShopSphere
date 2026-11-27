import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from '../validators/cart.validator.js';

const router = Router();

// All cart endpoints require authentication
router.use(authenticate);

router.get('/', CartController.getCart);
router.post('/items', validateRequest(addToCartSchema), CartController.addItem);
router.put('/items/:itemId', validateRequest(updateCartItemSchema), CartController.updateQuantity);
router.delete('/items/:itemId', validateRequest(removeCartItemSchema), CartController.removeItem);
router.delete('/', CartController.clearCart);

export default router;
