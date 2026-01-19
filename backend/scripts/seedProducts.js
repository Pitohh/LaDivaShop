import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Load env vars from ../.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const categories = ['Vernis', 'Perruques', 'Soins', 'Maquillage', 'Accessoires'];
const images = [
    'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3997394/pexels-photo-3997394.jpeg?auto=compress&cs=tinysrgb&w=600'
];

async function seed() {
    const client = await pool.connect();
    try {
        console.log('Seeding products...');

        // Get category IDs first
        const catRes = await client.query('SELECT * FROM categories');
        let categoryMap = {};
        if (catRes.rows.length === 0) {
            // Create categories if not exist
            for (const cat of categories) {
                const res = await client.query('INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id', [cat, `Description pour ${cat}`]);
                categoryMap[cat] = res.rows[0].id;
            }
        } else {
            catRes.rows.forEach(r => categoryMap[r.name] = r.id);
            // Ensure our list key exists
            for (const cat of categories) {
                if (!categoryMap[cat]) {
                    const res = await client.query('INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id', [cat, `Description pour ${cat}`]);
                    categoryMap[cat] = res.rows[0].id;
                }
            }
        }

        // Insert 30 products
        for (let i = 1; i <= 30; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const categoryId = categoryMap[category];
            const price = Math.floor(Math.random() * 50000) + 5000;
            const originalPrice = price + Math.floor(Math.random() * 10000);
            const randomImage = images[Math.floor(Math.random() * images.length)];

            const query = `
        INSERT INTO products (
          name, description, price, original_price, category_id, stock, 
          images, is_new, is_active, rating, review_count, external_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
      `;

            const values = [
                `Produit Test ${i} - ${category}`,
                `Description pour le produit test ${i}. Un super produit de la catégorie ${category}.`,
                price,
                originalPrice,
                categoryId,
                Math.floor(Math.random() * 50) + 1,
                JSON.stringify([randomImage, randomImage]), // images array (removed 'image' param before this)
                Math.random() > 0.8, // is_new
                true,
                (Math.random() * 2 + 3).toFixed(1), // rating 3.0-5.0
                Math.floor(Math.random() * 100),
                `TEST-${i}-${Date.now()}`
            ];

            await client.query(query, values);
        }

        console.log('Successfully seeded 30 products!');

        // Populate product_images table
        const productsRes = await client.query("SELECT id, images FROM products WHERE external_id LIKE 'TEST-%'");
        for (const p of productsRes.rows) {
            const imgs = p.images; // It's JSONB
            if (imgs && Array.isArray(imgs)) {
                for (let j = 0; j < imgs.length; j++) {
                    await client.query(
                        'INSERT INTO product_images (product_id, image_url, position) VALUES ($1, $2, $3)',
                        [p.id, imgs[j], j]
                    );
                }
            }
        }
        console.log('Populated product_images table.');

    } catch (err) {
        console.error('Error seeding:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
