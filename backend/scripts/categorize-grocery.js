import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function main() {
    await client.connect();
    
    try {
        // 1. Create 'Epicerie' category
        console.log("🥬 Ensuring 'Epicerie' category exists...");
        const catRes = await client.query("SELECT id FROM categories WHERE name = 'Epicerie'");
        let groceryId;
        
        if (catRes.rows.length === 0) {
            const createRes = await client.query("INSERT INTO categories (name, description) VALUES ('Epicerie', 'Epices et assaisonnements') RETURNING id");
            groceryId = createRes.rows[0].id;
            console.log("✅ Created 'Epicerie' category.");
        } else {
            groceryId = catRes.rows[0].id;
            console.log("ℹ️ 'Epicerie' already exists.");
        }

        // 2. Move products
        console.log("📦 Moving food items to 'Epicerie'...");
        // Keywords based on user feedback and previous list
        const keywordRegex = 'assaisonnement|assaisonement|épice|epice|viande|poisson|steak|sel d|cajun|marjolaine|sauce|oldbay';
        
        const updateRes = await client.query(`
            UPDATE products 
            SET category_id = $1 
            WHERE (name ~* $2 OR description ~* $2)
        `, [groceryId, keywordRegex]);

        console.log(`✅ Moved ${updateRes.rowCount} products to 'Epicerie'.`);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await client.end();
    }
}

main().catch(console.error);
