import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://ladiva_user:password@localhost:5432/ladiva_db'
});

async function main() {
    await client.connect();
    
    // Get all categories with their products
    const res = await client.query(`
        SELECT c.name as category_name, p.name as product_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        ORDER BY c.name, p.name
    `);

    const organized = {};
    res.rows.forEach(r => {
        if (!organized[r.category_name]) organized[r.category_name] = [];
        organized[r.category_name].push(r.product_name);
    });

    console.log("# 📦 Catalogue Organisé\n");
    for (const [cat, products] of Object.entries(organized)) {
        console.log(`## ${cat} (${products.length})`);
        products.forEach(p => console.log(`- ${p}`));
        console.log(""); // Empty line
    }

    await client.end();
}

main().catch(console.error);
