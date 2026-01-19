
import pool, { query } from './database.js';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
    try {
        console.log('🔄 Resetting admin password...');

        const email = 'admin@ladivashop.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
            'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id',
            [hashedPassword, email]
        );

        if (result.rowCount === 0) {
            console.log('⚠️ Admin user not found, creating it...');
            const createResult = await query(
                `INSERT INTO users (email, password_hash, first_name, last_name, role)
                 VALUES ($1, $2, 'Admin', 'LaDiva', 'admin')
                 RETURNING id`,
                [email, hashedPassword]
            );
            console.log('✅ Admin user created with ID:', createResult.rows[0].id);
        } else {
            console.log('✅ Admin password updated for ID:', result.rows[0].id);
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Error resetting password:', error);
        process.exit(1);
    }
}

resetAdminPassword();
