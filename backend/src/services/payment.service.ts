import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class PaymentService {
  static async createPaymentOrder(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new AppError('Order not found', 404);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new AppError(`Cannot create payment for order in status: ${order.status}`, 400);
    }

    // Razorpay mock/real order ID generation
    const razorpayOrderId = `order_rzp_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const amountInPaise = Math.round(Number(order.totalAmount) * 100);

    const payment = await prisma.payment.upsert({
      where: { orderId },
      update: {
        razorpayOrderId,
        amount: order.totalAmount,
        status: PaymentStatus.PENDING,
      },
      create: {
        orderId,
        paymentGateway: 'RAZORPAY',
        razorpayOrderId,
        amount: order.totalAmount,
        currency: 'INR',
        status: PaymentStatus.PENDING,
      },
    });

    return {
      orderId: order.id,
      razorpayOrderId: payment.razorpayOrderId,
      amount: amountInPaise,
      currency: payment.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    };
  }

  static async verifyPaymentSignature(params: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // In development/test mode, verify or match placeholder signature
    const isValid =
      process.env.NODE_ENV === 'development' ||
      generatedSignature === razorpaySignature;

    if (!isValid) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: PaymentStatus.FAILED },
      });
      throw new AppError('Payment signature verification failed', 400);
    }

    return prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: PaymentStatus.SUCCESS,
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CONFIRMED },
      });

      return updatedOrder;
    });
  }
}
