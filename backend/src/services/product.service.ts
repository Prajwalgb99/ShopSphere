import { prisma } from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
import { Prisma } from '@prisma/client';

export class ProductService {
  static async getProducts(params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'price_asc' | 'price_desc' | 'newest';
  }) {
    const { page, limit, search, category, minPrice, maxPrice, sort } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          inventory: { select: { quantity: true, reservedQuantity: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => ({
        ...p,
        availableStock: p.inventory
          ? p.inventory.quantity - p.inventory.reservedQuantity
          : 0,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        inventory: { select: { quantity: true, reservedQuantity: true } },
      },
    });

    if (!product || !product.isActive) {
      throw new AppError('Product not found', 404);
    }

    return {
      ...product,
      availableStock: product.inventory
        ? product.inventory.quantity - product.inventory.reservedQuantity
        : 0,
    };
  }

  static async createProduct(data: {
    title: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
    initialStock?: number;
  }) {
    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
          imageUrl: data.imageUrl,
          inventory: {
            create: {
              quantity: data.initialStock || 0,
              reservedQuantity: 0,
            },
          },
        },
        include: {
          inventory: true,
          category: true,
        },
      });

      return product;
    });
  }

  static async updateProduct(
    id: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      categoryId?: string;
      imageUrl?: string;
      isActive?: boolean;
      stock?: number;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      const { stock, ...productData } = data;

      const product = await tx.product.update({
        where: { id },
        data: productData,
      });

      if (stock !== undefined) {
        await tx.inventory.upsert({
          where: { productId: id },
          update: { quantity: stock },
          create: { productId: id, quantity: stock, reservedQuantity: 0 },
        });
      }

      return product;
    });
  }

  static async deleteProduct(id: string) {
    // Soft delete
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  static async getCategories() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
  }

  static async createCategory(name: string, description?: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return prisma.category.create({
      data: { name, slug, description },
    });
  }
}
