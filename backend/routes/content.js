const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateContent } = require('../middleware/validation');
const { loadData, saveData } = require('../utils/dataManager');

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
  try {
    const { section } = req.query;
    let content = await loadData('content');

    if (section) {
      content = content.filter(c => c.section === section);
    }

    res.json(content);
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get content by section and key
router.get('/:section/:key', async (req, res) => {
  try {
    const { section, key } = req.params;
    const content = await loadData('content');
    const item = content.find(c => c.section === section && c.key === key);

    if (!item) {
      return res.status(404).json({ error: 'Contenu non trouvé' });
    }

    res.json(item);
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Create or update content (Admin only)
router.post('/', authenticateToken, requireAdmin, validateContent, async (req, res) => {
  try {
    const { section, key, value, type } = req.body;
    const content = await loadData('content');
    
    const existingIndex = content.findIndex(c => c.section === section && c.key === key);
    
    const contentItem = {
      section,
      key,
      value,
      type,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      // Update existing content
      content[existingIndex] = {
        ...content[existingIndex],
        ...contentItem
      };
    } else {
      // Create new content
      contentItem.id = Date.now().toString();
      contentItem.createdAt = new Date().toISOString();
      content.push(contentItem);
    }

    await saveData('content', content);

    res.json({
      message: existingIndex !== -1 ? 'Contenu mis à jour avec succès' : 'Contenu créé avec succès',
      content: contentItem
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du contenu:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Update content (Admin only)
router.put('/:section/:key', authenticateToken, requireAdmin, validateContent, async (req, res) => {
  try {
    const { section, key } = req.params;
    const { value, type } = req.body;
    
    const content = await loadData('content');
    const contentIndex = content.findIndex(c => c.section === section && c.key === key);

    if (contentIndex === -1) {
      return res.status(404).json({ error: 'Contenu non trouvé' });
    }

    content[contentIndex] = {
      ...content[contentIndex],
      value,
      type,
      updatedAt: new Date().toISOString()
    };

    await saveData('content', content);

    res.json({
      message: 'Contenu mis à jour avec succès',
      content: content[contentIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Delete content (Admin only)
router.delete('/:section/:key', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { section, key } = req.params;
    const content = await loadData('content');
    const contentIndex = content.findIndex(c => c.section === section && c.key === key);

    if (contentIndex === -1) {
      return res.status(404).json({ error: 'Contenu non trouvé' });
    }

    content.splice(contentIndex, 1);
    await saveData('content', content);

    res.json({ message: 'Contenu supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du contenu:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get content structure for admin
router.get('/admin/structure', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const content = await loadData('content');
    
    // Group content by section
    const structure = content.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push({
        key: item.key,
        type: item.type,
        updatedAt: item.updatedAt
      });
      return acc;
    }, {});

    res.json(structure);
  } catch (error) {
    console.error('Erreur lors de la récupération de la structure:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;