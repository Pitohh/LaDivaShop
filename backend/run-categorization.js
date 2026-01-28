#!/usr/bin/env node

/**
 * Script pour exécuter la migration de catégorisation des produits
 * Usage: node run-categorization.js
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

async function runMigration() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        console.log('🔄 Connexion à la base de données...');

        // Lire le fichier de migration
        const migrationPath = path.join(__dirname, 'migrations', '003_categorize_products.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        console.log('📝 Exécution de la migration de catégorisation...');

        // Exécuter la migration
        await pool.query(migrationSQL);

        console.log('✅ Migration exécutée avec succès !');
        console.log('');

        // Afficher le résumé de catégorisation
        const result = await pool.query(`
      SELECT category, COUNT(*) as total
      FROM products
      GROUP BY category
      ORDER BY category
    `);

        console.log('📊 Résumé de la catégorisation:');
        console.log('================================');
        result.rows.forEach(row => {
            console.log(`  ${row.category.padEnd(15)} : ${row.total} produits`);
        });
        console.log('');

        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error.message);
        await pool.end();
        process.exit(1);
    }
}

runMigration();
