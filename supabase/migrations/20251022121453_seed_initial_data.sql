/*
  # Seed Initial Data for La Boutique

  ## Overview
  This migration populates the database with initial categories, products, and content.

  ## Data Inserted
  1. Categories - 4 product categories
  2. Products - 2 sample products with details
  3. Content - Hero, about, and contact information
*/

-- Insert categories
INSERT INTO categories (name, description, is_active) VALUES
  ('Vernis à Ongles', 'Collection de vernis à ongles de qualité premium', true),
  ('Perruques', 'Perruques naturelles et synthétiques de haute qualité', true),
  ('Soins Capillaires', 'Produits de soins pour cheveux naturels', true),
  ('Tissages', 'Tissages et extensions de cheveux naturels', true)
ON CONFLICT (name) DO NOTHING;

-- Insert products
INSERT INTO products (
  name, description, price, original_price, category_id, stock, rating, review_count,
  images, features, specifications, is_new, is_active, sales
) 
SELECT 
  'Vernis Gel UV Rose Élégant Premium',
  'Découvrez notre vernis gel UV rose élégant, spécialement conçu pour sublimer les ongles des femmes africaines. Sa formule longue tenue garantit une brillance exceptionnelle pendant 3 semaines.',
  8500,
  12000,
  (SELECT id FROM categories WHERE name = 'Vernis à Ongles' LIMIT 1),
  15,
  4.9,
  127,
  '["https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '["Formule longue tenue 3 semaines", "Séchage rapide sous UV/LED", "Enrichi en vitamine E", "Sans produits chimiques nocifs", "Couleur intense et brillante"]'::jsonb,
  '{"Contenance": "15ml", "Temps de séchage": "60 secondes sous UV", "Durée": "Jusqu''à 3 semaines", "Application": "Base + 2 couches + Top coat"}'::jsonb,
  true,
  true,
  45
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Vernis Gel UV Rose Élégant Premium');

INSERT INTO products (
  name, description, price, category_id, stock, rating, review_count,
  images, features, is_new, is_active, sales
)
SELECT
  'Perruque Lace Front Premium Ondulée',
  'Perruque lace front de qualité premium avec cheveux naturels ondulés. Parfaite pour un look élégant et naturel.',
  85000,
  (SELECT id FROM categories WHERE name = 'Perruques' LIMIT 1),
  12,
  4.8,
  89,
  '["https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=800"]'::jsonb,
  '["Cheveux 100% naturels", "Lace front invisible", "Longueur 22 pouces", "Couleur naturelle", "Résistant à la chaleur"]'::jsonb,
  false,
  true,
  23
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Perruque Lace Front Premium Ondulée');

-- Insert content
INSERT INTO content (section, key, value, type) VALUES
  ('hero', 'title', 'Bienvenue dans notre boutique', 'text'),
  ('hero', 'subtitle', 'Découvrez notre collection exclusive de produits de beauté pour femmes africaines', 'text'),
  ('hero', 'image', 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=800', 'image'),
  ('about', 'title', 'À propos de La Boutique', 'text'),
  ('contact', 'phone', '+241 74 42 10 60', 'text'),
  ('contact', 'email', 'contact@laboutique.ga', 'text'),
  ('contact', 'address', '834 LBV, Libreville, Gabon', 'text')
ON CONFLICT (section, key) DO NOTHING;