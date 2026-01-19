import express from 'express';
import { categoriesController } from '../controllers/categories.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', categoriesController.getAll);
router.get('/:id', categoriesController.getById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, categoriesController.create);
router.put('/:id', authMiddleware, adminMiddleware, categoriesController.update);
router.delete('/:id', authMiddleware, adminMiddleware, categoriesController.delete);

export default router;
