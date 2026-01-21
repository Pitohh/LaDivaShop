import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

console.log('DEBUG: DATABASE_URL exists?', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('DEBUG: DATABASE_URL starts with', process.env.DATABASE_URL.substring(0, 15));
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect().then(client => {
    console.log('✅ Connected successfully');
    client.release();
    process.exit(0);
}).catch(err => {
    console.error('❌ Connection failed:', err);
    process.exit(1);
});
