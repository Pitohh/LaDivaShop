-- Migration pour catégoriser automatiquement les produits La Diva
-- Basé sur des mots-clés dans le nom du produit

-- Étape 1: Ajouter la colonne category si elle n'existe pas (safe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'category'
    ) THEN
        ALTER TABLE products ADD COLUMN category VARCHAR(50);
    END IF;
END $$;

-- Étape 2: Catégorisation automatique par mots-clés

-- Catégorie A: "wigs" (L'Art Capillaire)
-- Mots-clés: Raw hair, Vietnam, Silk, Bone straight, Kinky, Bouclés, Mèches, Perruque
UPDATE products
SET category = 'wigs'
WHERE category IS NULL
  AND (
    LOWER(name) LIKE '%raw hair%' OR
    LOWER(name) LIKE '%vietnam%' OR
    LOWER(name) LIKE '%silk%' OR
    LOWER(name) LIKE '%bone straight%' OR
    LOWER(name) LIKE '%kinky%' OR
    LOWER(name) LIKE '%boucl%' OR
    LOWER(name) LIKE '%mèche%' OR
    LOWER(name) LIKE '%meche%' OR
    LOWER(name) LIKE '%perruque%' OR
    LOWER(name) LIKE '%virgin%' OR
    LOWER(name) LIKE '%curly%' OR
    LOWER(name) LIKE '%wavy%' OR
    LOWER(name) LIKE '%afro%' OR
    LOWER(description) LIKE '%perruque%'
  );

-- Catégorie B: "nails" (Signature des Mains)
-- Mots-clés: Neon, Pink, Blue, Apricot, Pearl, Gel, Polygel, Pinceau, Vernis, Nail, couleurs
UPDATE products
SET category = 'nails'
WHERE category IS NULL
  AND (
    LOWER(name) LIKE '%neon%' OR
    LOWER(name) LIKE '%pink%' OR
    LOWER(name) LIKE '%blue%' OR
    LOWER(name) LIKE '%apricot%' OR
    LOWER(name) LIKE '%pearl%' OR
    LOWER(name) LIKE '%gel%' OR
    LOWER(name) LIKE '%polygel%' OR
    LOWER(name) LIKE '%pinceau%' OR
    LOWER(name) LIKE '%vernis%' OR
    LOWER(name) LIKE '%nail%' OR
    LOWER(name) LIKE '%lavender%' OR
    LOWER(name) LIKE '%stardust%' OR
    LOWER(name) LIKE '%golden%' OR
    LOWER(name) LIKE '%mustard%' OR
    LOWER(name) LIKE '%vanilla%' OR
    LOWER(name) LIKE '%fresh leaf%' OR
    LOWER(name) LIKE '%stars%' OR
    LOWER(name) LIKE '%red flag%' OR
    LOWER(name) LIKE '%aimant%' OR
    LOWER(name) LIKE '%candy%' OR
    LOWER(name) LIKE '%lilac%' OR
    LOWER(name) LIKE '%sparkle%' OR
    LOWER(name) LIKE '%turquoise%' OR
    LOWER(name) LIKE '%diamond%' OR
    LOWER(name) LIKE '%beige%' OR
    LOWER(name) LIKE '%plum%' OR
    LOWER(name) LIKE '%mermaid%' OR
    LOWER(name) LIKE '%coral%' OR
    LOWER(name) LIKE '%caramel%' OR
    LOWER(name) LIKE '%tangerine%' OR
    LOWER(name) LIKE '%lagoon%' OR
    LOWER(name) LIKE '%lime%' OR
    LOWER(name) LIKE '%roses%' OR
    LOWER(name) LIKE '%aura%' OR
    LOWER(name) LIKE '%essence%' OR
    LOWER(name) LIKE '%ongle%' OR
    LOWER(description) LIKE '%ongles%' OR
    LOWER(description) LIKE '%nail%'
  );

-- Catégorie C: "care" (Rituels de Soin)
-- Mots-clés: Texturisant, Demelage, Keratine, Luxfume, Mousse, Stick, Spray, soins, gloss
UPDATE products
SET category = 'care'
WHERE category IS NULL
  AND (
    LOWER(name) LIKE '%texturisant%' OR
    LOWER(name) LIKE '%demelage%' OR
    LOWER(name) LIKE '%démêlage%' OR
    LOWER(name) LIKE '%keratine%' OR
    LOWER(name) LIKE '%kératine%' OR
    LOWER(name) LIKE '%luxfume%' OR
    LOWER(name) LIKE '%mousse%' OR
    LOWER(name) LIKE '%stick%' OR
    LOWER(name) LIKE '%spray%' OR
    LOWER(name) LIKE '%soin%' OR
    LOWER(name) LIKE '%gloss%' OR
    LOWER(name) LIKE '%blush%' OR
    LOWER(name) LIKE '%lisseur%' OR
    LOWER(name) LIKE '%seche%' OR
    LOWER(name) LIKE '%sèche%' OR
    LOWER(name) LIKE '%hydratant%' OR
    LOWER(name) LIKE '%volumisant%' OR
    LOWER(name) LIKE '%definition%' OR
    LOWER(name) LIKE '%définition%' OR
    LOWER(name) LIKE '%anti-pigment%' OR
    LOWER(name) LIKE '%super bb%' OR
    LOWER(name) LIKE '%wow color%' OR
    LOWER(name) LIKE '%bandeau%' OR
    LOWER(name) LIKE '%patrice mulato%' OR
    LOWER(description) LIKE '%soin%' OR
    LOWER(description) LIKE '%démêl%' OR
    LOWER(description) LIKE '%hydrat%'
  );

-- Étape 3: Produits non catégorisés → "care" par défaut (accessoires/autres)
UPDATE products
SET category = 'care'
WHERE category IS NULL;

-- Résumé de la catégorisation
SELECT 
  category,
  COUNT(*) as total_produits
FROM products
GROUP BY category
ORDER BY category;
