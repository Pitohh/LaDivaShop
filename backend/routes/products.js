const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { loadData, saveData } = require('../utils/dataManager');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, inStock, isNew, limit, offset } = req.query;
    let products = await loadData('products');

    // Filtres
    if (category && category !== 'Tous') {
      products = products.filter(p => p.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    if (isNew === 'true') {
      products = products.filter(p => p.isNew === true);
    }

    // Pagination
    const total = products.length;
    if (limit) {
      const limitNum = parseInt(limit);
      const offsetNum = parseInt(offset) || 0;
      products = products.slice(offsetNum, offsetNum + limitNum);
    }

    res.json({
      products,
      total,
      count: products.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const products = await loadData('products');
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Create product (Admin only)
router.post('/', authenticateToken, requireAdmin, validateProduct, async (req, res) => {
  try {
    const products = await loadData('products');
    
    const newProduct = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      rating: 0,
      reviewCount: 0,
      sales: 0,
      images: []
    };

    products.push(newProduct);
    await saveData('products', products);

    res.status(201).json({
      message: 'Produit créé avec succès',
      product: newProduct
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validateProduct, async (req, res) => {
  try {
    const products = await loadData('products');
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveData('products', products);

    res.json({
      message: 'Produit mis à jour avec succès',
      product: products[productIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await loadData('products');
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    products.splice(productIndex, 1);
    await saveData('products', products);

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Update product stock
router.patch('/:id/stock', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Stock invalide' });
    }

    const products = await loadData('products');
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    products[productIndex].stock = stock;
    products[productIndex].updatedAt = new Date().toISOString();

    await saveData('products', products);

    res.json({
      message: 'Stock mis à jour avec succès',
      product: products[productIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;