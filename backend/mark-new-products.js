import { query } from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function markProductsAsNew() {
    try {
        console.log('🔍 Fetching products from Perruques and Ongles categories...\n');

        // Get some products from key categories
        const result = await query(`
            SELECT p.id, p.name, c.name as category, p.is_new
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE c.name IN ('Perruques', 'Ongles', 'Soins')
            ORDER BY p.created_at DESC
            LIMIT 15
        `);

        console.log(`Found ${result.rows.length} products:\n`);
        result.rows.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} (${p.category}) - is_new: ${p.is_new}`);
        });

        // Get first 10 IDs
        const productIds = result.rows.slice(0, 10).map(p => p.id);

        if (productIds.length > 0) {
            console.log('\n✅ Marking 10 products as NEW...\n');

            const updateResult = await query(`
                UPDATE products 
                SET is_new = true 
                WHERE id = ANY($1::uuid[])
                RETURNING id, name
            `, [productIds]);

            console.log(`Updated ${updateResult.rows.length} products:`);
            updateResult.rows.forEach((p, i) => {
                console.log(`${i + 1}. ${p.name}`);
            });

            console.log('\n🎉 Done! Products marked as NEW.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

markProductsAsNew();
