import pool, { query } from './database.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runSeed() {
    try {
        console.log('🌱 Starting database seeding...');

        // Read and execute seed data
        const seedSQL = fs.readFileSync(
            join(__dirname, '../../migrations/002_seed_data.sql'),
            'utf8'
        );

        console.log('📝 Inserting seed data...');
        await query(seedSQL);
        console.log('✅ Seed data inserted');

        console.log('🎉 Seeding completed successfully!');
        await pool.end();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

runSeed();
