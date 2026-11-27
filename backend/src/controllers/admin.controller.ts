import { Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { OrderStatus } from '@prisma/client';

export class AdminController {
  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInventory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const lowStockOnly = req.query.lowStock === 'true';
      const inventory = await AdminService.getInventory(search, lowStockOnly);
      res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const updated = await AdminService.updateStock(productId, Number(quantity));
      res.status(200).json({
        success: true,
        message: 'Inventory stock level updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as OrderStatus | undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 15;
      const ordersData = await AdminService.getAllOrders(status, page, limit);
      res.status(200).json({
        success: true,
        data: ordersData.orders,
        meta: ordersData.meta,
      });
    } catch (error) {
      next(error);
    }
  }
}
