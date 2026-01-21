import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function reset() {
    await client.connect();
    console.log('🗑️ Emptying products table...');
    await client.query('TRUNCATE table products CASCADE;');
    console.log('✅ Products table truncated.');
    await client.end();
}
reset().catch(console.error);
