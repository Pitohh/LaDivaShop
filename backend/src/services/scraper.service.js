import { chromium } from 'playwright';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { query } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const scraperService = {
    async syncWhatsAppCatalog() {
        let browser;
        try {
            console.log('🚀 Starting WhatsApp synchronization...');

            // Launch options for server environment (headless, no sandbox)
            browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            });

            const page = await browser.newPage({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            // Navigate to catalog
            const catalogUrl = 'https://wa.me/c/24104565638';
            await page.goto(catalogUrl, { waitUntil: 'networkidle' });

            // Extract products
            const extractedProducts = await page.evaluate(() => {
                // Determine selectors based on WA Web structure (might change, need robustness)
                // This is a best-guess based on standard structure or the user provided hint
                // User said: a[href*="/product/"]

                const cards = Array.from(document.querySelectorAll('a[href*="/p/"], a[href*="/product/"]'));

                return cards.map(card => {
                    const href = card.getAttribute('href') || '';
                    const idMatch = href.match(/\/p\/(\d+)/) || href.match(/\/product\/(\d+)/);
                    const externalId = idMatch ? idMatch[1] : href.split('/').pop();

                    // Navigate up to find container or extracting direct children
                    // WA usually puts info in divs inside the anchor or nearby
                    // Assuming the anchor WRAPS the content

                    // Simple text extraction heuristics
                    const textContent = card.innerText.split('\n').filter(t => t.trim());
                    const name = textContent[0] || 'Unknown Product';
                    const priceRaw = textContent.find(t => t.includes('FCFA') || /\d/.test(t)) || '0';

                    const img = card.querySelector('img');

                    return {
                        external_id: externalId,
                        name: name,
                        price_string: priceRaw,
                        image_url: img ? img.src : null,
                        full_url: href.startsWith('http') ? href : `https://wa.me${href}`
                    };
                });
            });

            console.log(`📦 Found ${extractedProducts.length} products on WhatsApp.`);

            let stats = { created: 0, updated: 0, failed: 0 };

            // Process each product
            for (const prod of extractedProducts) {
                try {
                    if (!prod.external_id || !prod.name) continue;

                    // 1. Download Image
                    let localImagePath = null;
                    if (prod.image_url) {
                        const fileName = `wa_${prod.external_id}.jpg`;
                        const uploadDir = path.join(__dirname, '../../uploads/products');
                        await fs.ensureDir(uploadDir);

                        const filePath = path.join(uploadDir, fileName);

                        const writer = fs.createWriteStream(filePath);
                        const response = await axios({
                            url: prod.image_url,
                            method: 'GET',
                            responseType: 'stream'
                        });

                        response.data.pipe(writer);

                        await new Promise((resolve, reject) => {
                            writer.on('finish', resolve);
                            writer.on('error', reject);
                        });

                        localImagePath = `/uploads/products/${fileName}`;
                    }

                    // 2. Parse Price
                    // Remove non-digits (except maybe dots/commas if needed, but FCFA usually integer)
                    const priceNumeric = parseInt(prod.price_string.replace(/[^\d]/g, ''), 10) || 0;

                    // 3. Upsert to DB
                    // CONFLICT on whatsapp_external_id
                    const upsertQuery = `
                        INSERT INTO products (
                            whatsapp_external_id, name, description, price, 
                            original_price, stock, images, 
                            original_wa_url, last_sync, is_active
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), true)
                        ON CONFLICT (whatsapp_external_id) 
                        DO UPDATE SET 
                            name = EXCLUDED.name,
                            price = EXCLUDED.price,
                            images = CASE WHEN EXCLUDED.images::text != '[]' THEN EXCLUDED.images ELSE products.images END,
                            last_sync = NOW()
                        RETURNING id, (xmax = 0) AS inserted;
                    `;

                    // We store single image in 'images' JSONB array for consistency with existing schema
                    const imagesJson = localImagePath ? JSON.stringify([localImagePath]) : '[]';

                    const res = await query(upsertQuery, [
                        prod.external_id,
                        prod.name,
                        `Imported from WhatsApp: ${prod.price_string}`, // Generic description if not found
                        priceNumeric,
                        null, // original price
                        10, // Default stock? Or keep existing? For now default to 10 if new
                        imagesJson,
                        prod.full_url
                    ]);

                    if (res.rows[0].inserted) stats.created++;
                    else stats.updated++;

                } catch (err) {
                    console.error(`❌ Failed to process product ${prod.external_id}:`, err.message);
                    stats.failed++;
                }
            }

            console.log('✅ Sync complete:', stats);
            return stats;

        } catch (error) {
            console.error('❌ Scraper service error:', error);
            throw error;
        } finally {
            if (browser) await browser.close();
        }
    }
};
