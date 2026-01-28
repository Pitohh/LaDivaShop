#!/usr/bin/env node

/**
 * Script pour exporter les produits du catalogue JSON vers CSV
 * Usage: node export-products-csv.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le fichier products.json
const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8')
);

console.log(`✅ ${products.length} produits trouvés dans products.json`);

// Fonction pour échapper les virgules et guillemets dans le CSV
function escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// En-têtes CSV
const headers = [
    'ID',
    'Nom du produit',
    'Prix (FCFA)',
    'Description',
    'Chemin image',
    'Disponibilité',
    'Stock maximum'
];

// Créer le contenu CSV
let csvContent = headers.join(',') + '\n';

products.forEach(product => {
    const row = [
        escapeCSV(product.id || ''),
        escapeCSV(product.name || ''),
        escapeCSV(product.price || ''),
        escapeCSV(product.description || ''),
        escapeCSV(product.image_local_path || ''),
        escapeCSV(product.availability || 'IN_STOCK'),
        escapeCSV(product.max_available || 99)
    ];

    csvContent += row.join(',') + '\n';
});

// Écrire le fichier CSV
const outputPath = path.join(__dirname, 'catalogue_ladiva.csv');
fs.writeFileSync(outputPath, csvContent, 'utf-8');

console.log(`✅ Fichier CSV créé: ${outputPath}`);
console.log(`📊 Total: ${products.length} produits exportés`);
