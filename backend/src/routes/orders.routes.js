import express from 'express';
import { ordersController } from '../controllers/orders.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getById);
router.post('/', ordersController.create);
router.put('/:id', ordersController.update);
router.post('/:id/cancel', ordersController.cancel);

export default router;
