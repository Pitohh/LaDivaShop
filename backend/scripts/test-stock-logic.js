import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Config env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Dynamic imports to ensure env vars are loaded first
const { query } = await import('../src/config/database.js');
const { paymentsController } = await import('../src/controllers/payments.controller.js');

async function runTest() {
    console.log('🧪 Starting Stock Logic Test...');

    let productId;
    let orderId;

    try {
        // 1. Create a Test Product
        console.log('1️⃣ Creating Test Product...');
        const productRes = await query(`
            INSERT INTO products (name, description, price, stock, is_active)
            VALUES ('TEST_PRODUCT_STOCK', 'Test Stock Logic', 1000, 10, true)
            RETURNING id, stock
        `);
        productId = productRes.rows[0].id;
        console.log(`   -> Product created: ${productId} (Stock: ${productRes.rows[0].stock})`);

        // 2. Create a Test Order
        console.log('2️⃣ Creating Test Order...');
        // Correct item structure logic for the updated controller
        const items = [{ productId: productId, quantity: 2, price: 1000, name: 'TEST_PRODUCT_STOCK' }];

        let userId;
        const userRes = await query('SELECT id FROM users LIMIT 1');
        if (userRes.rows.length > 0) {
            userId = userRes.rows[0].id;
        } else {
            console.error('   ❌ No users found to attach order to. Run seed first.');
            return;
        }

        const orderRes = await query(`
            INSERT INTO orders (user_id, total_amount, items, shipping_address, payment_method, payment_reference)
            VALUES ($1, 2000, $2, '{}', 'mobile-money', 'REF_TEST_STOCK')
            RETURNING id
        `, [userId, JSON.stringify(items)]);
        orderId = orderRes.rows[0].id;
        console.log(`   -> Order created: ${orderId}`);

        // 3. Create a Dummy Payment record
        console.log('3️⃣ Creating Dummy Payment...');
        const refMarchand = `REF_TEST_${Date.now()}`;
        await query(`
            INSERT INTO payments (order_id, reference_marchand, montant, total_amount, numero_client, operateur, status)
            VALUES ($1, $2, 2000, 2000, '077000000', 'AM', 'pending')
        `, [orderId, refMarchand]);

        // 4. Simulate Callback (Success)
        console.log('4️⃣ Simulating PVit Callback (Success)...');

        const req = {
            body: {
                result: {
                    statut: '1', // Success
                    ref: refMarchand,
                    numero_client: '077000000',
                    amount: 2000,
                    message: 'Transaction success'
                }
            }
        };

        const res = {
            status: (code) => ({
                send: (msg) => console.log(`   -> API Response: ${code} ${msg}`)
            })
        };

        await paymentsController.handleCallback(req, res);

        // 5. Verify Stock
        console.log('5️⃣ Verifying Stock Update...');
        const checkRes = await query('SELECT stock, sales FROM products WHERE id = $1', [productId]);
        const finalStock = checkRes.rows[0].stock;
        const finalSales = checkRes.rows[0].sales;

        if (finalStock === 8) {
            console.log(`   ✅ SUCCESS: Stock decremented correctly (10 -> 8)`);
        } else {
            console.error(`   ❌ FAILURE: Stock is ${finalStock} (Expected 8)`);
        }

        if (finalSales === 2) {
            console.log(`   ✅ SUCCESS: Sales incremented correctly (0 -> 2)`);
        } else {
            console.error(`   ❌ FAILURE: Sales is ${finalSales} (Expected 2)`);
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        // Cleanup
        console.log('🧹 Cleaning up...');
        if (productId) await query('DELETE FROM products WHERE id = $1', [productId]);
        process.exit(0);
    }
}

runTest();
