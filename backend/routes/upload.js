const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// Upload single image
router.post('/image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { category = 'general', resize = 'true' } = req.body;
    const fileId = uuidv4();
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${fileId}${ext}`;
    const uploadPath = path.join(__dirname, '../uploads', category);
    
    // Ensure directory exists
    await fs.ensureDir(uploadPath);
    
    const filePath = path.join(uploadPath, filename);
    
    // Process image with Sharp
    let imageBuffer = req.file.buffer;
    
    if (resize === 'true') {
      imageBuffer = await sharp(req.file.buffer)
        .resize(800, 800, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    }
    
    // Save file
    await fs.writeFile(filePath, imageBuffer);
    
    // Generate URL
    const imageUrl = `/uploads/${category}/${filename}`;
    
    res.json({
      message: 'Image uploadée avec succès',
      url: imageUrl,
      filename,
      originalName: req.file.originalname,
      size: imageBuffer.length
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
  }
});

// Upload multiple images
router.post('/images', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { category = 'general', resize = 'true' } = req.body;
    const uploadPath = path.join(__dirname, '../uploads', category);
    
    // Ensure directory exists
    await fs.ensureDir(uploadPath);
    
    const uploadedFiles = [];
    
    for (const file of req.files) {
      const fileId = uuidv4();
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${fileId}${ext}`;
      const filePath = path.join(uploadPath, filename);
      
      // Process image with Sharp
      let imageBuffer = file.buffer;
      
      if (resize === 'true') {
        imageBuffer = await sharp(file.buffer)
          .resize(800, 800, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .toBuffer();
      }
      
      // Save file
      await fs.writeFile(filePath, imageBuffer);
      
      uploadedFiles.push({
        url: `/uploads/${category}/${filename}`,
        filename,
        originalName: file.originalname,
        size: imageBuffer.length
      });
    }
    
    res.json({
      message: 'Images uploadées avec succès',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload multiple:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload des images' });
  }
});

// Delete image
router.delete('/image', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL de l\'image requise' });
    }
    
    // Extract file path from URL
    const relativePath = url.replace('/uploads/', '');
    const filePath = path.join(__dirname, '../uploads', relativePath);
    
    // Check if file exists
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      res.json({ message: 'Image supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Image non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
  }
});

// Get uploaded files list
router.get('/files/:category?', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { category = 'general' } = req.params;
    const uploadPath = path.join(__dirname, '../uploads', category);
    
    if (!(await fs.pathExists(uploadPath))) {
      return res.json({ files: [] });
    }
    
    const files = await fs.readdir(uploadPath);
    const fileList = [];
    
    for (const file of files) {
      const filePath = path.join(uploadPath, file);
      const stats = await fs.stat(filePath);
      
      fileList.push({
        filename: file,
        url: `/uploads/${category}/${file}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      });
    }
    
    res.json({ files: fileList });
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
  }
});

module.exports = router;