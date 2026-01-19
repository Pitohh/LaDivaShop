-- Migration: Add WhatsApp Integration fields to products table

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS whatsapp_external_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS original_wa_url TEXT,
ADD COLUMN IF NOT EXISTS last_sync TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_products_whatsapp_id ON products(whatsapp_external_id);
