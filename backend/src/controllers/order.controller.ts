import { Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { OrderStatus } from '@prisma/client';

export class OrderController {
  static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder(req.user!.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getCustomerOrders(req.user!.userId);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user?.role === 'ADMIN';
      const order = await OrderService.getOrderById(req.params.id, req.user!.userId, isAdmin);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user?.role === 'ADMIN';
      const order = await OrderService.cancelOrder(req.user!.userId, req.params.id, isAdmin);
      res.status(200).json({
        success: true,
        message: 'Order cancelled and stock released',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.updateOrderStatus(
        req.params.id,
        req.body.status as OrderStatus
      );
      res.status(200).json({
        success: true,
        message: 'Order status updated',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}
