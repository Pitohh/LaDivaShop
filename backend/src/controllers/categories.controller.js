import { query } from '../config/database.js';

export const categoriesController = {
    // Get all active categories
    async getAll(req, res) {
        try {
            const result = await query(
                'SELECT * FROM categories WHERE is_active = true ORDER BY name ASC'
            );

            res.json(result.rows);
        } catch (error) {
            console.error('GetAll categories error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get category by ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            const result = await query(
                'SELECT * FROM categories WHERE id = $1 AND is_active = true',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('GetById category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Create category (admin only)
    async create(req, res) {
        try {
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }

            const result = await query(
                `INSERT INTO categories (name, description)
         VALUES ($1, $2)
         RETURNING *`,
                [name, description || '']
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(409).json({ error: 'Category already exists' });
            }
            console.error('Create category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update category (admin only)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, isActive } = req.body;

            const result = await query(
                `UPDATE categories SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         is_active = COALESCE($3, is_active)
         WHERE id = $4
         RETURNING *`,
                [name, description, isActive, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Update category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete category (admin only)
    async delete(req, res) {
        try {
            const { id } = req.params;

            const result = await query(
                'DELETE FROM categories WHERE id = $1 RETURNING id',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
