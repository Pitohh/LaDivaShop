const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const JSON_FILE = path.join(__dirname, 'products.json');
const DB_CONFIG = {
    connectionString: process.env.DATABASE_URL || 'postgresql://ladiva_user:password@localhost:5432/ladiva_db',
};

function extractPrice(description) {
    if (!description) return 10000;
    const regex = /(\d[\d\s\.]*)\s*(?:XAF|FCFA|F|CFA)/i;
    const match = description.match(regex);
    if (match) {
        return parseInt(match[1].replace(/[\s\.]/g, ''), 10);
    }
    const simpleNumber = description.match(/(\d{4,})/);
    return simpleNumber ? parseInt(simpleNumber[1], 10) : 10000;
}

async function main() {
    console.log("🚀 Démarrage de l'injection SQL Native...");

    if (!fs.existsSync(JSON_FILE)) {
        console.error("❌ products.json introuvable.");
        process.exit(1);
    }
    const products = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
    const client = new Client(DB_CONFIG);
    await client.connect();

    let successCount = 0;
    for (const p of products) {
        try {
            const name = p.name.substring(0, 255);
            const description = p.description || "";
            let finalPrice = p.price ? parseInt(p.price) : extractPrice(description);
            if (isNaN(finalPrice) || finalPrice === 0) finalPrice = 10000;

            const filename = path.basename(p.image_local_path);
            const webPath = `/uploads/${filename}`;
            const imagesJson = JSON.stringify([webPath]);
            const stock = p.max_available || 10;

            const query = `
                INSERT INTO products 
                (name, description, price, stock, images, category_id, is_active, is_new)
                VALUES ($1, $2, $3, $4, $5::jsonb, NULL, true, true)
            `;

            await client.query(query, [name, description, finalPrice, stock, imagesJson]);
            process.stdout.write(".");
            successCount++;
        } catch (err) {
            // Ignorer les erreurs silencieuses (doublons etc)
        }
    }
    console.log(`\n✅ TERMINE ! ${successCount} produits injectés.`);
    await client.end();
}
main().catch(console.error);
