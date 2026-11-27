import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export class CartService {
  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                inventory: true,
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  inventory: true,
                },
              },
            },
          },
        },
      });
    }

    const items = cart.items.map((item) => {
      const price = Number(item.product.price);
      const availableStock = item.product.inventory
        ? item.product.inventory.quantity - item.product.inventory.reservedQuantity
        : 0;

      return {
        id: item.id,
        productId: item.productId,
        title: item.product.title,
        price,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        subtotal: price * item.quantity,
        availableStock,
        isAvailable: availableStock >= item.quantity && item.product.isActive,
      };
    });

    const totalAmount = items.reduce((acc, curr) => acc + curr.subtotal, 0);

    return {
      id: cart.id,
      items,
      itemCount: items.reduce((acc, curr) => acc + curr.quantity, 0),
      totalAmount,
    };
  }

  static async addItem(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });

    if (!product || !product.isActive) {
      throw new AppError('Product not found or inactive', 404);
    }

    const availableStock = product.inventory
      ? product.inventory.quantity - product.inventory.reservedQuantity
      : 0;

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    const targetQuantity = (existingItem ? existingItem.quantity : 0) + quantity;
    if (targetQuantity > availableStock) {
      throw new AppError(
        `Cannot add item: only ${availableStock} units available in stock`,
        400
      );
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: targetQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  static async updateQuantity(userId: string, itemId: string, quantity: number) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: { include: { inventory: true } },
      },
    });

    if (!item || item.cart.userId !== userId) {
      throw new AppError('Cart item not found', 404);
    }

    const availableStock = item.product.inventory
      ? item.product.inventory.quantity - item.product.inventory.reservedQuantity
      : 0;

    if (quantity > availableStock) {
      throw new AppError(
        `Requested quantity (${quantity}) exceeds available stock (${availableStock})`,
        400
      );
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  static async removeItem(userId: string, itemId: string) {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
      throw new AppError('Cart item not found', 404);
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  static async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
    return { success: true, message: 'Cart cleared' };
  }
}
