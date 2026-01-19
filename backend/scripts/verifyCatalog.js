import { productsController } from '../src/controllers/products.controller.js';
import pool from '../src/config/database.js';

async function verify() {
    try {
        console.log('🔍 Verifying getAll...');

        let lastResponseData = null;
        const captureRes = {
            json: (data) => { lastResponseData = data; },
            status: (code) => { console.log('Status set to', code); return captureRes; }
        };

        const req = { query: {}, params: {} };

        await productsController.getAll(req, captureRes);

        if (!lastResponseData || !Array.isArray(lastResponseData)) {
            console.error('❌ getAll did not return an array');
            console.log('Response:', lastResponseData);
            process.exit(1);
        }

        const importedProduct = lastResponseData.find(p => p.external_id === '25783488994569304');

        if (!importedProduct) {
            console.error('❌ Imported product NOT found in getAll response');
            console.log(`Found ${lastResponseData.length} products, but not the target one.`);
            process.exit(1);
        }

        console.log('✅ Imported product found in getAll');
        console.log(`ID: ${importedProduct.id}`);
        console.log('Images:', JSON.stringify(importedProduct.images, null, 2));

        if (!importedProduct.images || importedProduct.images.length === 0) {
            console.error('❌ Images missing or empty');
        } else {
            console.log('✅ Images present');
        }

        console.log('\n🔍 Verifying getById...');
        const id = importedProduct.id;
        req.params.id = id;

        lastResponseData = null;
        await productsController.getById(req, captureRes);

        if (!lastResponseData) {
            console.error('❌ getById returned no data');
        } else if (lastResponseData.external_id !== '25783488994569304') {
            console.error('❌ getById returned wrong product');
        } else {
            console.log('✅ getById verified');
            console.log('Images:', JSON.stringify(lastResponseData.images, null, 2));
        }

    } catch (err) {
        console.error('❌ Verification failed:', err);
    } finally {
        await pool.end();
    }
}

verify();
