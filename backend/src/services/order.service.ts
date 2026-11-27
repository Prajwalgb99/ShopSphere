import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  static async createOrder(
    userId: string,
    data: {
      addressId?: string;
      newAddress?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
      };
      idempotencyKey?: string;
    }
  ) {
    if (data.idempotencyKey) {
      const existing = await prisma.order.findUnique({
        where: { idempotencyKey: data.idempotencyKey },
        include: { items: true, payment: true },
      });
      if (existing) {
        return existing;
      }
    }

    return prisma.$transaction(async (tx) => {
      // 1. Resolve shipping address
      let targetAddressId = data.addressId;
      if (!targetAddressId && data.newAddress) {
        const address = await tx.address.create({
          data: {
            userId,
            ...data.newAddress,
            isDefault: true,
          },
        });
        targetAddressId = address.id;
      }

      if (!targetAddressId) {
        const defaultAddr = await tx.address.findFirst({
          where: { userId, isDefault: true },
        });
        if (!defaultAddr) {
          throw new AppError('Shipping address is required to place an order', 400);
        }
        targetAddressId = defaultAddr.id;
      }

      // 2. Fetch cart items
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { inventory: true },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new AppError('Cannot place order with an empty cart', 400);
      }

      // 3. Atomically reserve inventory & validate stock
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of cart.items) {
        const product = item.product;
        if (!product.isActive) {
          throw new AppError(`Product "${product.title}" is no longer available`, 400);
        }

        const inv = product.inventory;
        if (!inv || inv.quantity - inv.reservedQuantity < item.quantity) {
          throw new AppError(
            `Insufficient stock for "${product.title}". Available: ${
              inv ? inv.quantity - inv.reservedQuantity : 0
            }, requested: ${item.quantity}`,
            400
          );
        }

        // Conditional reservation update
        await tx.inventory.update({
          where: { id: inv.id },
          data: {
            reservedQuantity: {
              increment: item.quantity,
            },
          },
        });

        const unitPrice = Number(product.price);
        const subtotal = unitPrice * item.quantity;
        totalAmount += subtotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        });
      }

      // 4. Create Order & OrderItems
      const order = await tx.order.create({
        data: {
          userId,
          addressId: targetAddressId,
          totalAmount,
          status: OrderStatus.PENDING_PAYMENT,
          idempotencyKey: data.idempotencyKey,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
      });

      // 5. Clear Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  static async cancelOrder(userId: string, orderId: string, isAdmin = false) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      if (!isAdmin && order.userId !== userId) {
        throw new AppError('Unauthorized to cancel this order', 403);
      }

      if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
        throw new AppError(`Order cannot be cancelled in state: ${order.status}`, 400);
      }

      // Release reserved inventory
      for (const item of order.items) {
        await tx.inventory.updateMany({
          where: { productId: item.productId },
          data: {
            reservedQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });

      return updated;
    });
  }

  static async getCustomerOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, imageUrl: true } },
          },
        },
        address: true,
        payment: true,
      },
    });
  }

  static async getOrderById(orderId: string, userId: string, isAdmin = false) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, imageUrl: true, price: true } },
          },
        },
        address: true,
        payment: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (!isAdmin && order.userId !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    return order;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // If status transitions from CONFIRMED -> DELIVERED, decrement actual quantity
      if (status === OrderStatus.DELIVERED && order.status !== OrderStatus.DELIVERED) {
        for (const item of order.items) {
          await tx.inventory.updateMany({
            where: { productId: item.productId },
            data: {
              quantity: { decrement: item.quantity },
              reservedQuantity: { decrement: item.quantity },
            },
          });
        }
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status },
      });
    });
  }
}
