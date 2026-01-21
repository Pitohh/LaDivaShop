import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function analyze() {
    await client.connect();

    console.log('\n📊 --- Curent Categories ---');
    const cats = await client.query('SELECT * FROM categories ORDER BY name');
    if (cats.rows.length === 0) {
        console.log('(No categories found)');
    } else {
        cats.rows.forEach(c => console.log(`- [${c.id}] ${c.name}`));
    }

    console.log('\n📈 --- Product Distribution ---');
    const dist = await client.query(`
        SELECT 
            COALESCE(c.name, 'Uncategorized') as category_name,
            COUNT(p.id) as count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        GROUP BY c.name
        ORDER BY count DESC
    `);
    dist.rows.forEach(r => console.log(`- ${r.category_name}: ${r.count}`));

    console.log('\n🕵️ --- Uncategorized Products Sample (Top 10) ---');
    const nullCats = await client.query(`
        SELECT name, description 
        FROM products 
        WHERE category_id IS NULL 
        LIMIT 10
    `);
    if (nullCats.rows.length === 0) {
        console.log('(No uncategorized products)');
    } else {
        nullCats.rows.forEach(p => console.log(`- ${p.name}`));
    }

    await client.end();
}
analyze().catch(console.error);
