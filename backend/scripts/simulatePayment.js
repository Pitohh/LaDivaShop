import pg from 'pg';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const API_URL = `http://localhost:${process.env.PORT || 3001}/api/payments/callback`;

async function simulatePaymentRef(id, ref, amount, phone) {
    console.log(`Found pending payment: ${ref} (${amount} XAF) for ${phone}`);
    console.log(`Simulating success callback to ${API_URL}...`);

    const xmlPayload = `
    <result>
        <statut>1</statut>
        <ref>${ref}</ref>
        <numero_client>${phone}</numero_client>
        <token>SIMULATED_TOKEN_${Date.now()}</token>
        <amount>${amount}</amount>
        <fees>10</fees>
        <message>Transaction simulée avec succès</message>
    </result>`;

    try {
        await axios.post(API_URL, xmlPayload, {
            headers: { 'Content-Type': 'application/xml' }
        });
        console.log(`✅ Successfully simulated payment for ${ref}`);
    } catch (err) {
        console.error(`❌ Failed to send callback: ${err.message}`);
        if (err.response) console.error(err.response.data);
    }
}

async function startPolling() {
    console.log("🔄 Starting Payment Simulator... Waiting for pending payments...");

    // Keep running
    while (true) {
        let client;
        try {
            client = await pool.connect();
            // Find payments that are 'pending' (waiting for validation)
            // We also check 'initiating' just in case, but controller sets it to 'pending' after PVit init.
            const res = await client.query(
                "SELECT * FROM payments WHERE status = 'pending' ORDER BY created_at DESC LIMIT 1"
            );

            if (res.rows.length > 0) {
                const payment = res.rows[0];
                await simulatePaymentRef(payment.id, payment.reference_marchand, payment.montant, payment.numero_client);

                // Wait a bit to ensure the server processed it before polling again 
                // (otherwise we might pick it up again before status changes to success)
                await new Promise(r => setTimeout(r, 2000));
            }

        } catch (err) {
            console.error("Polling error:", err);
        } finally {
            if (client) client.release();
        }

        // Sleep 2s
        await new Promise(r => setTimeout(r, 2000));
    }
}

startPolling();
