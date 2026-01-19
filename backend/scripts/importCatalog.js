import fs from "fs";
import pool, { query } from "../src/config/database.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function importCatalog() {
    try {
        const catalogPath = join(__dirname, "../catalog.json");
        console.log(`📖 Reading catalog from ${catalogPath}...`);

        if (!fs.existsSync(catalogPath)) {
            throw new Error("catalog.json not found");
        }

        const data = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
        console.log(`📦 Found ${data.products.length} products to import`);

        for (const product of data.products) {
            console.log(`Processing ${product.name}...`);

            const client = await pool.connect();
            try {
                await client.query("BEGIN");

                // Insert or update product
                // Using ON CONFLICT (external_id) DO UPDATE to ensure re-runs work
                const productRes = await client.query(
                    `
          INSERT INTO products (external_id, name, description, price, stock, is_active, currency, images)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (external_id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            stock = EXCLUDED.stock,
            is_active = EXCLUDED.is_active,
            updated_at = NOW()
          RETURNING id
          `,
                    [
                        product.external_id,
                        product.name,
                        product.description,
                        product.price || 0, // Fallback to 0 if null, assuming schema requires integer. 
                        // Wait, schema for price is NOT NULL. 
                        // The JSON has price: null. I should optionally check if I can make it nullable or set a default.
                        // Original schema: price INTEGER NOT NULL CHECK (price >= 0)
                        // I should prompt user or set to 0. User said: "price = null -> tu peux le remplir plus tard".
                        // So I should probably set it to 0 or allow null. 
                        // Since existing schema has NOT NULL, I will use 0 for now.
                        product.stock,
                        product.is_active,
                        data.currency,
                        JSON.stringify(product.images) // Keep legacy JSON compatibility for now
                    ]
                );

                const productId = productRes.rows[0]?.id;
                if (!productId) {
                    console.error(`Failed to insert/get product ${product.external_id}`);
                    continue;
                }

                // Insert images into new table
                // First delete existing images for this product to avoid duplicates on re-run
                await client.query("DELETE FROM product_images WHERE product_id = $1", [productId]);

                if (product.images && Array.isArray(product.images)) {
                    for (let i = 0; i < product.images.length; i++) {
                        await client.query(
                            `
                INSERT INTO product_images (product_id, image_url, position)
                VALUES ($1, $2, $3)
                `,
                            [productId, product.images[i], i]
                        );
                    }
                }

                await client.query("COMMIT");
            } catch (e) {
                await client.query("ROLLBACK");
                console.error(`❌ Error processing ${product.name}:`, e);
            } finally {
                client.release();
            }
        }

        console.log("✅ Import terminé");
    } catch (error) {
        console.error("❌ Fatal error:", error);
    } finally {
        await pool.end();
    }
}

importCatalog();
