-- Seed initial data for LaDivaShop

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@ladivashop.com', '$2a$10$xE8xOQ/XBZE1ZqhPxNqGVeJ.7vK7aG1v9v0X0eXpXQ5fVt5X0eXpX', 'Admin', 'LaDiva', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, description, is_active) VALUES
('Soins du Visage', 'Produits pour le soin et la beauté du visage', true),
('Maquillage', 'Produits de maquillage professionnels', true),
('Soins des Cheveux', 'Shampoings, après-shampoings et traitements capillaires', true),
('Parfums', 'Parfums et eaux de toilette de luxe', true),
('Accessoires', 'Accessoires de beauté et outils', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
-- Get category IDs for reference
DO $$
DECLARE
  cat_visage_id UUID;
  cat_maquillage_id UUID;
  cat_cheveux_id UUID;
BEGIN
  SELECT id INTO cat_visage_id FROM categories WHERE name = 'Soins du Visage' LIMIT 1;
  SELECT id INTO cat_maquillage_id FROM categories WHERE name = 'Maquillage' LIMIT 1;
  SELECT id INTO cat_cheveux_id FROM categories WHERE name = 'Soins des Cheveux' LIMIT 1;

  INSERT INTO products (name, description, price, original_price, category_id, stock, rating, review_count, images, features, specifications, is_new, is_active, sales) VALUES
  (
    'Crème Hydratante Premium',
    'Crème hydratante enrichie en vitamines pour tous types de peaux',
    15000,
    20000,
    cat_visage_id,
    50,
    4.5,
    120,
    '["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500"]'::jsonb,
    '["Hydratation 24h", "Anti-âge", "Tous types de peaux"]'::jsonb,
    '{"Volume": "50ml", "Type": "Crème", "Origine": "France"}'::jsonb,
    false,
    true,
    120
  ),
  (
    'Palette Maquillage Pro',
    'Palette professionnelle avec 20 teintes de fards à paupières',
    25000,
    NULL,
    cat_maquillage_id,
    30,
    4.8,
    85,
    '["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500"]'::jsonb,
    '["20 couleurs", "Longue tenue", "Finition mat et brillant"]'::jsonb,
    '{"Couleurs": "20", "Type": "Fard à paupières"}'::jsonb,
    true,
    true,
    85
  ),
  (
    'Shampooing Réparateur',
    'Shampooing professionnel pour cheveux abîmés et secs',
   8000,
    10000,
    cat_cheveux_id,
    100,
    4.3,
    200,
    '["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500"]'::jsonb,
    '["Sans sulfate", "Réparateur", "Brillance intense"]'::jsonb,
    '{"Volume": "250ml", "Type": "Shampooing", "pH": "5.5"}'::jsonb,
    false,
    true,
    200
  )
  ON CONFLICT DO NOTHING;
END $$;

-- Insert default content
INSERT INTO content (section, key, value, type) VALUES
('hero', 'title', 'Bienvenue chez La Diva Shop', 'text'),
('hero', 'subtitle', 'Votre destination beauté de luxe', 'text'),
('footer', 'about', 'LaDivaShop est votre boutique de référence pour les produits de beauté de qualité supérieure.', 'text'),
('footer', 'email', 'contact@ladivashop.com', 'text'),
('footer', 'phone', '+241 XX XX XX XX', 'text')
ON CONFLICT (section, key) DO NOTHING;

-- Initialize PVit tokens (empty, will be updated via API)
INSERT INTO pvit_tokens (operateur, token) VALUES
('AM', 'INITIAL_TOKEN_AM'),
('MC', 'INITIAL_TOKEN_MC')
ON CONFLICT (operateur) DO NOTHING;
