import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid().optional(),
    newAddress: z
      .object({
        street: z.string().min(3),
        city: z.string().min(2),
        state: z.string().min(2),
        postalCode: z.string().min(3),
        country: z.string().min(2).default('India'),
        phone: z.string().min(10),
      })
      .optional(),
    idempotencyKey: z.string().min(10).optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['PENDING_PAYMENT', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  }),
});
