import express from 'express';
import { check } from 'express-validator';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post(
    '/register',
    [
        check('phone', 'Le numéro de téléphone est requis').not().isEmpty(),
        check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 }),
        check('firstName', 'Le prénom est requis').not().isEmpty(),
        check('lastName', 'Le nom est requis').not().isEmpty()
    ],
    authController.register
);

router.post(
    '/login',
    [
        check('phone', 'Le numéro de téléphone est requis').not().isEmpty(),
        check('password', 'Le mot de passe est requis').exists()
    ],
    authController.login
);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/logout', authMiddleware, authController.logout);

export default router;
