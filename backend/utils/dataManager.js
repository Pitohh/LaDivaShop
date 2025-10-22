const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

// Initialize default data files
const initializeData = async () => {
  const defaultData = {
    users: [
      {
        id: '1',
        email: 'admin@laboutique.ga',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password: admin123
        firstName: 'Admin',
        lastName: 'La Boutique',
        role: 'admin',
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ],
    products: [
      {
        id: '1',
        name: 'Vernis Gel UV Rose Élégant Premium',
        description: 'Découvrez notre vernis gel UV rose élégant, spécialement conçu pour sublimer les ongles des femmes africaines. Sa formule longue tenue garantit une brillance exceptionnelle pendant 3 semaines.',
        price: 8500,
        originalPrice: 12000,
        category: 'Vernis à Ongles',
        stock: 15,
        rating: 4.9,
        reviewCount: 127,
        images: [
          'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        features: [
          'Formule longue tenue 3 semaines',
          'Séchage rapide sous UV/LED',
          'Enrichi en vitamine E',
          'Sans produits chimiques nocifs',
          'Couleur intense et brillante'
        ],
        specifications: {
          'Contenance': '15ml',
          'Temps de séchage': '60 secondes sous UV',
          'Durée': 'Jusqu\'à 3 semaines',
          'Application': 'Base + 2 couches + Top coat'
        },
        isNew: true,
        isActive: true,
        sales: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Perruque Lace Front Premium Ondulée',
        description: 'Perruque lace front de qualité premium avec cheveux naturels ondulés. Parfaite pour un look élégant et naturel.',
        price: 85000,
        category: 'Perruques',
        stock: 12,
        rating: 4.8,
        reviewCount: 89,
        images: [
          'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        features: [
          'Cheveux 100% naturels',
          'Lace front invisible',
          'Longueur 22 pouces',
          'Couleur naturelle',
          'Résistant à la chaleur'
        ],
        isNew: false,
        isActive: true,
        sales: 23,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    categories: [
      {
        id: '1',
        name: 'Vernis à Ongles',
        description: 'Collection de vernis à ongles de qualité premium',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Perruques',
        description: 'Perruques naturelles et synthétiques de haute qualité',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Soins Capillaires',
        description: 'Produits de soins pour cheveux naturels',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Tissages',
        description: 'Tissages et extensions de cheveux naturels',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    content: [
      {
        id: '1',
        section: 'hero',
        key: 'title',
        value: 'Bienvenue dans notre boutique',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        section: 'hero',
        key: 'subtitle',
        value: 'Découvrez notre collection exclusive de produits de beauté pour femmes africaines',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        section: 'hero',
        key: 'image',
        value: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=800',
        type: 'image',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        section: 'about',
        key: 'title',
        value: 'À propos de La Boutique',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        section: 'contact',
        key: 'phone',
        value: '+241 74 42 10 60',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        section: 'contact',
        key: 'email',
        value: 'contact@laboutique.ga',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        section: 'contact',
        key: 'address',
        value: '834 LBV, Libreville, Gabon',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    orders: []
  };

  // Initialize each data file if it doesn't exist
  for (const [filename, data] of Object.entries(defaultData)) {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    if (!(await fs.pathExists(filePath))) {
      await fs.writeJson(filePath, data, { spaces: 2 });
      console.log(`✅ Fichier ${filename}.json initialisé`);
    }
  }
};

// Load data from JSON file
const loadData = async (filename) => {
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    
    if (!(await fs.pathExists(filePath))) {
      await initializeData();
    }
    
    return await fs.readJson(filePath);
  } catch (error) {
    console.error(`Erreur lors du chargement de ${filename}:`, error);
    return [];
  }
};

// Save data to JSON file
const saveData = async (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    await fs.writeJson(filePath, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${filename}:`, error);
    throw error;
  }
};

// Initialize data on startup
initializeData().catch(console.error);

module.exports = {
  loadData,
  saveData,
  initializeData
};