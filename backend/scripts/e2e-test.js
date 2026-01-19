import axios from 'axios';
import { strict as assert } from 'assert';

const API_URL = 'http://localhost:3001/api';
const ADMIN_EMAIL = 'admin@ladivashop.com';
const ADMIN_PASSWORD = 'admin123';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = (msg, color = colors.reset) => console.log(`${color}${msg}${colors.reset}`);
const pass = (msg) => log(`✅ ${msg}`, colors.green);
const fail = (msg) => log(`❌ ${msg}`, colors.red);
const info = (msg) => log(`ℹ️  ${msg}`, colors.cyan);

async function runTests() {
    log('\n🚀 Starting RUTHLESS Production Readiness Test...\n', colors.yellow);

    let adminToken;
    let userToken;
    let userId;
    let createdProductId;
    let createdOrderId;

    // 1. HEALTH CHECK
    try {
        await axios.get('http://localhost:3001/health');
        pass('Server is healthy and reachable');
    } catch (e) {
        fail('Server is DOWN or unhealthy');
        process.exit(1);
    }

    // 2. AUTHENTICATION
    try {
        // Bad Login
        try {
            await axios.post(`${API_URL}/auth/login`, { email: ADMIN_EMAIL, password: 'wrongpassword' });
            fail('Security Breach: Login with wrong password should fail');
        } catch (e) {
            if (e.response && e.response.status === 401) pass('Security: Login with wrong password failed as expected');
            else fail(`Unexpected error on bad login: ${e.message}`);
        }

        // Admin Login
        const adminLogin = await axios.post(`${API_URL}/auth/login`, { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        assert(adminLogin.data.token, 'Token missing');
        adminToken = adminLogin.data.token;
        pass('Admin Login successful');

        // User Registration
        const testUserEmail = `testuser_${Date.now()}@example.com`;
        const register = await axios.post(`${API_URL}/auth/register`, {
            email: testUserEmail,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        });
        assert(register.data.token, 'User token missing');
        userToken = register.data.token;
        userId = register.data.user.id;
        pass(`User Registration successful (${testUserEmail})`);

    } catch (e) {
        fail(`Authentication Flow failed: ${e.message}`);
        process.exit(1);
    }

    // 3. PRODUCTS & RBAC
    try {
        // Get Public Products
        const products = await axios.get(`${API_URL}/products`);
        assert(Array.isArray(products.data), 'Products should be an array');
        pass(`Fetched ${products.data.length} products (Public Access)`);

        // Create Product (As User - Should Fail)
        try {
            await axios.post(`${API_URL}/products`, {
                name: 'Hacked Product',
                price: 100
            }, { headers: { Authorization: `Bearer ${userToken}` } });
            fail('RBAC Validtion Failed: Regular user created a product!');
        } catch (e) {
            if (e.response && e.response.status === 403) pass('RBAC Verified: Regular user cannot create products');
            else fail(`Unexpected RBAC response: ${e.response?.status}`);
        }

        // Create Product (As Admin - Should Success)
        const newProduct = await axios.post(`${API_URL}/products`, {
            name: 'Production Test Product',
            description: 'Automated Test Item',
            price: 5000,
            stock: 100,
            categoryId: products.data[0]?.categoryId // specific category usually needed, or optional
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        createdProductId = newProduct.data.id;
        pass('Admin successfully created a product');

    } catch (e) {
        fail(`Product/RBAC flow failed: ${e.message}`);
    }

    // 4. ORDER FLOW
    try {
        // Create Order
        const orderRes = await axios.post(`${API_URL}/orders`, {
            items: [{ productId: createdProductId, quantity: 2, price: 5000 }],
            totalAmount: 10000,
            shippingAddress: { fullName: 'Tester', city: 'Test City', address: '123 Test St', phone: '00000000' },
            paymentMethod: 'mobile_money'
        }, { headers: { Authorization: `Bearer ${userToken}` } });

        createdOrderId = orderRes.data.id;
        pass(`Order created successfully (ID: ${createdOrderId})`);

        // Verify Order in List
        const userOrders = await axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${userToken}` } });
        const found = userOrders.data.find(o => o.id === createdOrderId);
        assert(found, 'Created order not found in user list');
        pass('User can see their own order');

    } catch (e) {
        fail(`Order flow failed: ${e.message}`);
        console.error(e.response?.data);
    }

    // 5. PAYMENT INTEGRATION
    try {
        info('Testing Payment Initiation...');
        const payRes = await axios.post(`${API_URL}/payments/initiate`, {
            orderId: createdOrderId,
            numeroClient: '07000000',
            operateur: 'AM'
        }, { headers: { Authorization: `Bearer ${userToken}` } });

        // We expect success=true usually, even if PVit returns an error, OR the backend handles the pvit error gracefully.
        // Based on previous logs, it returns success: true, but with a message saying "Marchand inconnu".

        if (payRes.data.success) {
            pass(`Payment initiation API responded. Status: ${payRes.data.payment?.status}`);
            if (payRes.data.pvitResponse && payRes.data.pvitResponse.includes('Marchand inconnu')) {
                log('   ⚠️  NOTICE: PVit returned "Unknown Merchant". This is EXPECTED with invalid/test credentials.', colors.yellow);
            }
        } else {
            fail('Payment initiation API returned success:false');
        }

    } catch (e) {
        fail(`Payment flow failed: ${e.message}`);
    }

    log('\n🏁 Test Suite Completed.\n', colors.yellow);
}

runTests();
