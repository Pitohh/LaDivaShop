import express from 'express';
import { productsController } from '../controllers/products.controller.js';
import { syncController } from '../controllers/sync.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, productsController.create);
router.post('/sync-whatsapp', authMiddleware, adminMiddleware, syncController.syncWhatsApp);
router.put('/:id', authMiddleware, adminMiddleware, productsController.update);
router.delete('/:id', authMiddleware, adminMiddleware, productsController.delete);

export default router;
