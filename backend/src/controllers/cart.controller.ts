import { Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class CartController {
  static async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getCart(req.user!.userId);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;
      const cart = await CartService.addItem(req.user!.userId, productId, quantity);
      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const cart = await CartService.updateQuantity(req.user!.userId, itemId, quantity);
      res.status(200).json({
        success: true,
        message: 'Cart updated',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const cart = await CartService.removeItem(req.user!.userId, itemId);
      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await CartService.clearCart(req.user!.userId);
      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
