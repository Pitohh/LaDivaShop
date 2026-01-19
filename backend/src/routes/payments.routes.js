import express from 'express';
import { paymentsController } from '../controllers/payments.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { parseXML } from '../middleware/parseXML.js';

const router = express.Router();

// Initiate payment (protected)
router.post('/initiate', authMiddleware, paymentsController.initiatePayment);

// Calculate fees (protected)
router.post('/calculate-fees', authMiddleware, paymentsController.calculateFees);

// Get payment status (protected)
router.get('/status/:reference', authMiddleware, paymentsController.getPaymentStatus);

// PVit callback (public, receives XML)
router.post('/callback', parseXML, paymentsController.handleCallback);

export default router;
