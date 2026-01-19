import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

export const authController = {
    // Register new user
    async register(req, res) {
        try {
            const { phone, email, password, firstName, lastName } = req.body;

            // Validate input
            if (!phone || !password || !firstName || !lastName) {
                return res.status(400).json({ error: 'Phone, password, first name and last name are required' });
            }

            // Check if user already exists (by phone)
            const existingUser = await query(
                'SELECT id FROM users WHERE phone = $1',
                [phone]
            );

            if (existingUser.rows.length > 0) {
                return res.status(409).json({ error: 'User with this phone number already exists' });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const result = await query(
                `INSERT INTO users (phone, email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, phone, email, first_name, last_name, role, created_at`,
                [phone, email || null, passwordHash, firstName, lastName, 'user']
            );

            const user = result.rows[0];

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, phone: user.phone, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                user: {
                    id: user.id,
                    phone: user.phone,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role
                },
                token
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Login user
    async login(req, res) {
        try {
            const { phone, password } = req.body;

            // Validate input
            if (!phone || !password) {
                return res.status(400).json({ error: 'Phone and password are required' });
            }

            // Find user
            const result = await query(
                `SELECT id, phone, email, password_hash, first_name, last_name, role, is_active
         FROM users WHERE phone = $1`,
                [phone]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = result.rows[0];

            // Check if user is active
            if (!user.is_active) {
                return res.status(403).json({ error: 'Account is disabled' });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password_hash);

            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, phone: user.phone, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                user: {
                    id: user.id,
                    phone: user.phone,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get current user
    async getCurrentUser(req, res) {
        try {
            const result = await query(
                `SELECT id, phone, email, first_name, last_name, role, created_at
         FROM users WHERE id = $1`,
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = result.rows[0];

            res.json({
                id: user.id,
                phone: user.phone,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                createdAt: user.created_at
            });
        } catch (error) {
            console.error('GetCurrentUser error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Logout (client-side only, just for consistency)
    async logout(req, res) {
        // JWT is stateless, logout is handled client-side by removing token
        res.json({ message: 'Logged out successfully' });
    }
};
