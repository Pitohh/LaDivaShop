import pool, { query } from './database.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
    try {
        console.log('🚀 Starting database migrations...');

        // Read and execute schema migration
        const schemaSQL = fs.readFileSync(
            join(__dirname, '../../migrations/001_create_schema.sql'),
            'utf8'
        );

        // console.log('📝 Running schema migration (001)...');
        // await query(schemaSQL);
        // console.log('✅ Schema migration completed');

        // Read and execute phone auth migration
        // const phoneAuthSQL = fs.readFileSync(
        //     join(__dirname, '../../migrations/003_add_phone_authentication.sql'),
        //     'utf8'
        // );

        // console.log('📝 Running phone auth migration (003)...');
        // await query(phoneAuthSQL);
        // console.log('✅ Phone auth migration completed');

        // Read and execute product catalog migration
        const productCatalogSQL = fs.readFileSync(
            join(__dirname, '../../migrations/004_product_catalog_update.sql'),
            'utf8'
        );

        console.log('📝 Running product catalog migration (004)...');
        await query(productCatalogSQL);
        console.log('✅ Product catalog migration completed');

        console.log('🎉 All migrations completed successfully!');
        await pool.end();
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
