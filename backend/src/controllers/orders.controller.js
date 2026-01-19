import { query } from '../config/database.js';

export const ordersController = {
    // Get all orders for current user
    async getAll(req, res) {
        try {
            let sql;
            let params;

            if (req.user.role === 'admin') {
                // Admin sees all orders
                sql = 'SELECT * FROM orders ORDER BY created_at DESC';
                params = [];
            } else {
                // User sees only their orders
                sql = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
                params = [req.user.id];
            }

            const result = await query(sql, params);
            res.json(result.rows);
        } catch (error) {
            console.error('GetAll orders error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get order by ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            let sql;
            let params;

            if (req.user.role === 'admin') {
                sql = 'SELECT * FROM orders WHERE id = $1';
                params = [id];
            } else {
                sql = 'SELECT * FROM orders WHERE id = $1 AND user_id = $2';
                params = [id, req.user.id];
            }

            const result = await query(sql, params);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('GetById order error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Create order
    async create(req, res) {
        try {
            const {
                totalAmount,
                items,
                shippingAddress,
                paymentMethod,
                notes
            } = req.body;

            if (!items || items.length === 0) {
                return res.status(400).json({ error: 'Order must contain at least one item' });
            }

            if (!shippingAddress) {
                return res.status(400).json({ error: 'Shipping address is required' });
            }

            const result = await query(
                `INSERT INTO orders 
         (user_id, total_amount, items, shipping_address, payment_method, notes, status, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
                [
                    req.user.id,
                    totalAmount,
                    JSON.stringify(items),
                    JSON.stringify(shippingAddress),
                    paymentMethod || 'mobile-money',
                    notes || null,
                    'pending',
                    'pending'
                ]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update order (admin only or specific status updates)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { status, paymentStatus, notes } = req.body;

            // Check if order exists and belongs to user (unless admin)
            let checkSql;
            let checkParams;

            if (req.user.role === 'admin') {
                checkSql = 'SELECT id FROM orders WHERE id = $1';
                checkParams = [id];
            } else {
                checkSql = 'SELECT id FROM orders WHERE id = $1 AND user_id = $2';
                checkParams = [id, req.user.id];
            }

            const checkResult = await query(checkSql, checkParams);

            if (checkResult.rows.length === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            const result = await query(
                `UPDATE orders SET
         status = COALESCE($1, status),
         payment_status = COALESCE($2, payment_status),
         notes = COALESCE($3, notes)
         WHERE id = $4
         RETURNING *`,
                [status, paymentStatus, notes, id]
            );

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Update order error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Cancel order (user can cancel their own pending orders)
    async cancel(req, res) {
        try {
            const { id } = req.params;

            const result = await query(
                `UPDATE orders SET status = 'cancelled'
         WHERE id = $1 AND user_id = $2 AND status = 'pending'
         RETURNING *`,
                [id, req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Cancel order error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
