import fs from "fs-extra";
import path from "path";
import axios from "axios";
import pkg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG DB
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// DOSSIER CIBLE
const UPLOAD_DIR = path.join(__dirname, "../uploads/products");

await fs.ensureDir(UPLOAD_DIR);

async function downloadImage(url, filePath) {
    const response = await axios({
        method: "GET",
        url,
        responseType: "stream"
    });

    return new Promise((resolve, reject) => {
        const stream = response.data.pipe(fs.createWriteStream(filePath));
        stream.on("finish", resolve);
        stream.on("error", reject);
    });
}

async function migrateImages() {
    const client = await pool.connect();

    try {
        const { rows } = await client.query(`
      SELECT 
        pi.id AS image_id,
        pi.image_url,
        pi.position,
        p.id AS product_id,
        p.external_id
      FROM product_images pi
      JOIN products p ON p.id = pi.product_id
      WHERE pi.image_url LIKE 'http%'
    `);

        console.log(`🔎 ${rows.length} images à migrer`);

        for (const row of rows) {
            const { image_id, image_url, external_id, position } = row;

            const fileName = `${external_id}-${position + 1}.jpg`;
            const filePath = path.join(UPLOAD_DIR, fileName);
            const publicPath = `/uploads/products/${fileName}`;

            try {
                console.log(`⬇️ Téléchargement : ${image_url}`);
                await downloadImage(image_url, filePath);

                await client.query(
                    `UPDATE product_images SET image_url = $1 WHERE id = $2`,
                    [publicPath, image_id]
                );

                console.log(`✅ Image sauvegardée : ${publicPath}`);
            } catch (err) {
                console.error(`❌ Erreur image ${image_url}`, err.message);
            }
        }

        console.log("🎉 Migration terminée !");
    } catch (err) {
        console.error("💥 Erreur générale :", err);
    } finally {
        client.release();
        process.exit();
    }
}

migrateImages();
