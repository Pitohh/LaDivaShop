const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');
const { loadData, saveData } = require('../utils/dataManager');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await loadData('categories');
    res.json(categories.filter(c => c.isActive !== false));
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const categories = await loadData('categories');
    const category = categories.find(c => c.id === req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    res.json(category);
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Create category (Admin only)
router.post('/', authenticateToken, requireAdmin, validateCategory, async (req, res) => {
  try {
    const categories = await loadData('categories');
    
    // Check if category name already exists
    if (categories.find(c => c.name.toLowerCase() === req.body.name.toLowerCase())) {
      return res.status(409).json({ error: 'Cette catégorie existe déjà' });
    }
    
    const newCategory = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    categories.push(newCategory);
    await saveData('categories', categories);

    res.status(201).json({
      message: 'Catégorie créée avec succès',
      category: newCategory
    });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Update category (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validateCategory, async (req, res) => {
  try {
    const categories = await loadData('categories');
    const categoryIndex = categories.findIndex(c => c.id === req.params.id);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    // Check if new name conflicts with existing category
    const existingCategory = categories.find(c => 
      c.id !== req.params.id && 
      c.name.toLowerCase() === req.body.name.toLowerCase()
    );
    
    if (existingCategory) {
      return res.status(409).json({ error: 'Cette catégorie existe déjà' });
    }

    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveData('categories', categories);

    res.json({
      message: 'Catégorie mise à jour avec succès',
      category: categories[categoryIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Delete category (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const categories = await loadData('categories');
    const categoryIndex = categories.findIndex(c => c.id === req.params.id);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    // Check if category is used by products
    const products = await loadData('products');
    const categoryName = categories[categoryIndex].name;
    const productsUsingCategory = products.filter(p => p.category === categoryName);

    if (productsUsingCategory.length > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer cette catégorie car elle est utilisée par des produits',
        productsCount: productsUsingCategory.length
      });
    }

    categories.splice(categoryIndex, 1);
    await saveData('categories', categories);

    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;