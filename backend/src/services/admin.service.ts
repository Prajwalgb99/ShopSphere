import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { OrderStatus } from '@prisma/client';

export class AdminService {
  static async getDashboardStats() {
    const [totalOrders, customersCount, confirmedOrders, lowStockCount, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.order.findMany({
          where: {
            status: {
              in: [OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
            },
          },
          select: { totalAmount: true },
        }),
        prisma.inventory.count({
          where: {
            quantity: { lte: 5 },
          },
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            items: { select: { quantity: true } },
          },
        }),
      ]);

    const totalRevenue = confirmedOrders.reduce(
      (acc, curr) => acc + Number(curr.totalAmount),
      0
    );

    return {
      totalRevenue,
      totalOrders,
      totalCustomers: customersCount,
      lowStockCount,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        customerName: `${o.user.firstName} ${o.user.lastName}`,
        email: o.user.email,
        totalAmount: Number(o.totalAmount),
        status: o.status,
        itemCount: o.items.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: o.createdAt,
      })),
    };
  }

  static async getInventory(search?: string, lowStockOnly = false) {
    const products = await prisma.product.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        category: { select: { id: true, name: true } },
        inventory: true,
      },
      orderBy: { title: 'asc' },
    });

    const inventoryList = products.map((p) => {
      const qty = p.inventory?.quantity ?? 0;
      const reserved = p.inventory?.reservedQuantity ?? 0;
      const available = Math.max(0, qty - reserved);

      let status = 'IN_STOCK';
      if (available <= 0) status = 'OUT_OF_STOCK';
      else if (available <= 5) status = 'LOW_STOCK';

      return {
        productId: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category.name,
        price: Number(p.price),
        imageUrl: p.imageUrl,
        quantity: qty,
        reservedQuantity: reserved,
        availableStock: available,
        status,
        isActive: p.isActive,
        updatedAt: p.inventory?.updatedAt ?? p.updatedAt,
      };
    });

    if (lowStockOnly) {
      return inventoryList.filter(
        (item) => item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK'
      );
    }

    return inventoryList;
  }

  static async updateStock(productId: string, quantity: number) {
    if (quantity < 0) {
      throw new AppError('Inventory quantity cannot be negative', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const inventory = await prisma.inventory.upsert({
      where: { productId },
      update: { quantity },
      create: {
        productId,
        quantity,
        reservedQuantity: 0,
      },
    });

    return {
      productId,
      title: product.title,
      quantity: inventory.quantity,
      reservedQuantity: inventory.reservedQuantity,
      availableStock: inventory.quantity - inventory.reservedQuantity,
      updatedAt: inventory.updatedAt,
    };
  }

  static async getAllOrders(status?: OrderStatus, page = 1, limit = 15) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          address: true,
          items: {
            include: {
              product: { select: { id: true, title: true, imageUrl: true } },
            },
          },
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map((o) => ({
        id: o.id,
        customer: {
          id: o.user.id,
          name: `${o.user.firstName} ${o.user.lastName}`,
          email: o.user.email,
        },
        address: o.address,
        totalAmount: Number(o.totalAmount),
        status: o.status,
        paymentStatus: o.payment?.status ?? 'PENDING',
        items: o.items.map((it) => ({
          id: it.id,
          productId: it.productId,
          title: it.product.title,
          imageUrl: it.product.imageUrl,
          quantity: it.quantity,
          unitPrice: Number(it.unitPrice),
          subtotal: Number(it.subtotal),
        })),
        createdAt: o.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
