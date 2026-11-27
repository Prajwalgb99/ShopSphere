import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/create-order', PaymentController.createPaymentOrder);
router.post('/verify', PaymentController.verifyPayment);

export default router;
