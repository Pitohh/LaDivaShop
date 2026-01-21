import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Reconstitution de __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chargement .env depuis la racine du backend (remonter d'un niveau depuis scripts/)
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://ladiva_user:password@localhost:5432/ladiva_db'
});

async function main() {
    console.log("🚀 Starting Catalog Reorganization...");
    await client.connect();

    try {
        // 1. Rename 'Vernis' to 'Onglerie'
        console.log("�� Renaming 'Vernis' to 'Onglerie'...");
        const updateCat = await client.query(`
            UPDATE categories SET name = 'Onglerie' WHERE name = 'Vernis' RETURNING *;
        `);
        if (updateCat.rows.length > 0) {
            console.log("✅ Renamed successfully.");
        } else {
            console.log("ℹ️ Category 'Vernis' not found or already renamed.");
            // Ensure 'Onglerie' exists if renaming didn't happen (e.g. fresh start)
            const checkOnglerie = await client.query("SELECT * FROM categories WHERE name = 'Onglerie'");
            if (checkOnglerie.rows.length === 0) {
                 await client.query("INSERT INTO categories (name, description) VALUES ('Onglerie', 'Tout pour les ongles')");
                 console.log("✅ Created 'Onglerie' category.");
            }
        }

        // 2. Create 'Compléments Alimentaires' if missing
        console.log("💊 Ensuring 'Compléments Alimentaires' exists...");
        const checkSupplements = await client.query("SELECT * FROM categories WHERE name = 'Compléments Alimentaires'");
        if (checkSupplements.rows.length === 0) {
            await client.query("INSERT INTO categories (name, description) VALUES ('Compléments Alimentaires', 'Santé et beauté de l''intérieur')");
            console.log("✅ Created 'Compléments Alimentaires' category.");
        }

        // Cache category IDs
        const catsRes = await client.query("SELECT id, name FROM categories");
        const cats = {};
        catsRes.rows.forEach(c => cats[c.name] = c.id);

        // 3. Categorize Products
        console.log("🕵️ Auto-categorizing products...");
        const productsRes = await client.query("SELECT id, name, description FROM products WHERE category_id IS NULL");
        
        let updates = 0;
        for (const p of productsRes.rows) {
            const text = (p.name + " " + (p.description || "")).toLowerCase();
            let targetCatId = null;

            // Logic defined in Implementation Plan
            if (text.match(/cheveux|boucle|keratine|shampoing|défrisant|huile capillaire/)) {
                targetCatId = cats['Soins des Cheveux'];
            } else if (text.match(/perruque|wig|tissage|mèche|silk|frontal/)) {
                targetCatId = cats['Perruques'];
            } else if (text.match(/vernis|gel|nail|ongle|lime|capsule|neon|color|^[0-9]{2}\s/)) { // Added regex for "24 neon yellow" etc.
                targetCatId = cats['Onglerie'];
            } else if (text.match(/visage|crème|serum|savon|lotion|masque|anti-pigment|bouton|acné/)) {
                targetCatId = cats['Soins du Visage'];
            } else if (text.match(/biotine|glutathion|collagène|vitamine|gélule/)) {
                targetCatId = cats['Compléments Alimentaires'];
            } else if (text.match(/maquillage|palette|fard|pinceau|rouge à lèvre/)) {
                // Special check for nail brushes
                if (!text.includes('nail') && !text.includes('ongle')) {
                    targetCatId = cats['Maquillage'];
                } else {
                    targetCatId = cats['Onglerie'];
                }
            } else if (text.match(/parfum|senteur|brume|eau de/)) {
                targetCatId = cats['Parfums'];
            } else {
                 targetCatId = cats['Accessoires']; // Fallback
            }

            if (targetCatId) {
                await client.query("UPDATE products SET category_id = $1 WHERE id = $2", [targetCatId, p.id]);
                process.stdout.write(".");
                updates++;
            }
        }
        console.log(`\n✅ Updated ${updates} products.`);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await client.end();
    }
}

main().catch(console.error);
