import express from 'express';
import { reportsController } from '../controllers/reports.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All reports routes are protected and admin-only
router.use(authMiddleware, adminMiddleware);

router.get('/sales', reportsController.getSalesStats);
router.get('/top-products', reportsController.getTopProducts);
router.get('/kpis', reportsController.getKPIs);

export default router;
