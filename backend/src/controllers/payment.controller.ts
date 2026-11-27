import { Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class PaymentController {
  static async createPaymentOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.body;
      const paymentOrder = await PaymentService.createPaymentOrder(orderId, req.user!.userId);
      res.status(200).json({
        success: true,
        data: paymentOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await PaymentService.verifyPaymentSignature(req.body);
      res.status(200).json({
        success: true,
        message: 'Payment verified and order confirmed',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async webhook(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string | undefined;
      const result = await PaymentService.handleWebhook(signature, req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
