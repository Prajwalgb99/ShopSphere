import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be greater than zero'),
    categoryId: z.string().uuid('Invalid category ID'),
    imageUrl: z.string().url('Image must be a valid URL'),
    initialStock: z.number().int().nonnegative('Stock cannot be negative').default(0),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
    stock: z.number().int().nonnegative().optional(),
  }),
});

export const queryProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 12)),
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    sort: z.enum(['price_asc', 'price_desc', 'newest']).optional().default('newest'),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
  }),
});
