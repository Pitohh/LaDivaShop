import 'dotenv/config';
import { query } from '../src/config/database.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cleanup = async () => {
    try {
        console.log('🧹 Starting cleanup process...');

        // 1. Clear Orders and Payments
        console.log('🗑️  Deleting all orders and payments...');
        await query('TRUNCATE TABLE payments CASCADE');
        await query('TRUNCATE TABLE orders CASCADE');
        console.log('✅ Orders and Payments cleared.');

        // 2. Ask to clear Products
        rl.question('❓ Do you also want to delete all PRODUCTS? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                console.log('🗑️  Deleting all products and images...');
                await query('TRUNCATE TABLE product_images CASCADE');
                await query('TRUNCATE TABLE products CASCADE');
                console.log('✅ Products cleared.');
            } else {
                console.log('ℹ️  Skipping product cleanup.');
            }

            console.log('✨ Cleanup completed successfully.');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
};

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Cleanup interrupted.');
    process.exit(0);
});

cleanup();
