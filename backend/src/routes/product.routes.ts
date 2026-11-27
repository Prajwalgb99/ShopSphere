import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  createProductSchema,
  updateProductSchema,
  queryProductsSchema,
  createCategorySchema,
} from '../validators/product.validator.js';

const router = Router();

// Public Product & Category Routes
router.get('/products', validateRequest(queryProductsSchema), ProductController.getProducts);
router.get('/products/:id', ProductController.getProductById);
router.get('/categories', ProductController.getCategories);

// Admin Protected Routes
router.post(
  '/products',
  authenticate,
  requireRole('ADMIN'),
  validateRequest(createProductSchema),
  ProductController.createProduct
);

router.put(
  '/products/:id',
  authenticate,
  requireRole('ADMIN'),
  validateRequest(updateProductSchema),
  ProductController.updateProduct
);

router.delete(
  '/products/:id',
  authenticate,
  requireRole('ADMIN'),
  ProductController.deleteProduct
);

router.post(
  '/categories',
  authenticate,
  requireRole('ADMIN'),
  validateRequest(createCategorySchema),
  ProductController.createCategory
);

export default router;
