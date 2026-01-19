-- Migration: Add phone authentication support

-- 1. Add phone column which can be null initially (for existing data migration step)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- 2. Update existing admin user (admin@ladivashop.com) with a default phone number
-- Using '07000000' as default admin phone
UPDATE users SET phone = '07000000' WHERE email = 'admin@ladivashop.com';

-- 3. Now make phone unique. 
-- Note: If there are other existing users with null phone, a unique index on (phone) usually ignores nulls in Postgres, 
-- but if we want it required for FUTURE users, we should add NOT NULL constraint eventually. 
-- However, for now, let's keep it allowing nulls IF we still support email-only legacy users (though we are switching).
-- But the goal is "switch to phone", so ideally we require it. 
-- Let's set a unique constraint.
CREATE UNIQUE INDEX idx_users_phone ON users(phone);

-- 4. Make email nullable (since phone is now primary)
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
