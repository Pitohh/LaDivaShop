import { query } from '../config/database.js';

export const productsController = {
    // Get all products with optional filters
    async getAll(req, res) {
        try {
            const { category, search, minPrice, maxPrice, inStock, isNew } = req.query;

            let sql = `
        SELECT p.*, c.name as category_name,
        (
            SELECT COALESCE(json_agg(pi.image_url ORDER BY pi.position), '[]'::json)
            FROM product_images pi
            WHERE pi.product_id = p.id
        ) as product_images_list
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true
      `;
            const params = [];
            let paramCount = 0;

            if (category && category !== 'Tous') {
                paramCount++;
                sql += ` AND c.name = $${paramCount}`;
                params.push(category);
            }

            if (search) {
                paramCount++;
                sql += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
                params.push(`%${search}%`);
            }

            if (minPrice) {
                paramCount++;
                sql += ` AND p.price >= $${paramCount}`;
                params.push(parseInt(minPrice));
            }

            if (maxPrice) {
                paramCount++;
                sql += ` AND p.price <= $${paramCount}`;
                params.push(parseInt(maxPrice));
            }

            if (inStock === 'true') {
                sql += ' AND p.stock > 0';
            }

            if (isNew === 'true') {
                sql += ' AND p.is_new = true';
            }

            sql += ' ORDER BY p.created_at DESC';

            const result = await query(sql, params);

            const products = result.rows.map(row => ({
                id: row.id,
                name: row.name,
                description: row.description,
                price: row.price,
                originalPrice: row.original_price,
                stock: row.stock,
                rating: parseFloat(row.rating),
                reviewCount: row.review_count,
                images: row.product_images_list || row.images || [],
                features: row.features || [],
                specifications: row.specifications || {},
                isNew: row.is_new,
                isActive: row.is_active,
                sales: row.sales || 0,
                category: row.category_name,
                categoryId: row.category_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            }));

            res.json(products);
        } catch (error) {
            console.error('GetAll products error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get product by ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            const result = await query(
                `SELECT p.*, c.name as category_name,
         (
            SELECT COALESCE(json_agg(pi.image_url ORDER BY pi.position), '[]'::json)
            FROM product_images pi
            WHERE pi.product_id = p.id
         ) as product_images_list
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = $1 AND p.is_active = true`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const row = result.rows[0];
            const product = {
                id: row.id,
                name: row.name,
                description: row.description,
                price: row.price,
                originalPrice: row.original_price,
                stock: row.stock,
                rating: parseFloat(row.rating),
                reviewCount: row.review_count,
                images: row.product_images_list || row.images || [],
                features: row.features || [],
                specifications: row.specifications || {},
                isNew: row.is_new,
                isActive: row.is_active,
                sales: row.sales || 0,
                category: row.category_name,
                categoryId: row.category_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };

            res.json(product);
        } catch (error) {
            console.error('GetById product error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Create product (admin only)
    async create(req, res) {
        try {
            const {
                name,
                description,
                price,
                originalPrice,
                categoryId,
                stock,
                images,
                features,
                specifications,
                isNew
            } = req.body;

            if (!name || !price) {
                return res.status(400).json({ error: 'Name and price are required' });
            }

            const result = await query(
                `INSERT INTO products 
         (name, description, price, original_price, category_id, stock, images, features, specifications, is_new)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
                [
                    name,
                    description || '',
                    price,
                    originalPrice || null,
                    categoryId || null,
                    stock || 0,
                    JSON.stringify(images || []),
                    JSON.stringify(features || []),
                    JSON.stringify(specifications || {}),
                    isNew || false
                ]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update product (admin only)
    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                price,
                originalPrice,
                categoryId,
                stock,
                images,
                features,
                specifications,
                isNew,
                isActive
            } = req.body;

            const result = await query(
                `UPDATE products SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         price = COALESCE($3, price),
         original_price = COALESCE($4, original_price),
         category_id = COALESCE($5, category_id),
         stock = COALESCE($6, stock),
         images = COALESCE($7, images),
         features = COALESCE($8, features),
         specifications = COALESCE($9, specifications),
         is_new = COALESCE($10, is_new),
         is_active = COALESCE($11, is_active)
         WHERE id = $12
         RETURNING *`,
                [
                    name,
                    description,
                    price,
                    originalPrice,
                    categoryId,
                    stock,
                    images ? JSON.stringify(images) : null,
                    features ? JSON.stringify(features) : null,
                    specifications ? JSON.stringify(specifications) : null,
                    isNew,
                    isActive,
                    id
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete product (admin only)
    async delete(req, res) {
        try {
            const { id } = req.params;

            const result = await query(
                'DELETE FROM products WHERE id = $1 RETURNING id',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
