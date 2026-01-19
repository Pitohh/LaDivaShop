import { scraperService } from '../src/services/scraper.service.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

async function runTest() {
    console.log('🧪 Starting Manual WhatsApp Scraping Test...');
    try {
        const result = await scraperService.syncWhatsAppCatalog();
        console.log('✅ Test Completed. Result:', result);
    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        process.exit(0);
    }
}

runTest();
