# La Boutique - Backend API

Backend Node.js complet pour la gestion de contenu du site PWA La Boutique.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Inscription et connexion utilisateur
- Authentification JWT
- Gestion des rôles (user/admin)
- Protection des routes

### 📦 Gestion des Produits
- CRUD complet des produits
- Gestion des stocks
- Filtres et recherche avancée
- Upload d'images produits
- Gestion des catégories

### 📝 Gestion de Contenu (CMS)
- Modification de tous les textes du site
- Gestion des images
- Contenu structuré par sections
- API REST complète

### 🛒 Gestion des Commandes
- Création et suivi des commandes
- Gestion des statuts
- Historique utilisateur
- Statistiques de ventes

### 📊 Statistiques et Analytics
- Tableau de bord administrateur
- Analyses de ventes
- Performance des produits
- Rapports détaillés

### 📁 Upload de Fichiers
- Upload d'images sécurisé
- Redimensionnement automatique
- Gestion des formats multiples
- Organisation par catégories

## 🛠️ Installation

1. **Installer les dépendances**
```bash
cd backend
npm install
```

2. **Configuration**
```bash
cp .env.example .env
# Modifier les variables d'environnement
```

3. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📚 API Endpoints

### 🔐 Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### 📦 Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail produit
- `POST /api/products` - Créer produit (Admin)
- `PUT /api/products/:id` - Modifier produit (Admin)
- `DELETE /api/products/:id` - Supprimer produit (Admin)
- `PATCH /api/products/:id/stock` - Mettre à jour stock (Admin)

### 📝 Contenu
- `GET /api/content` - Tout le contenu
- `GET /api/content/:section/:key` - Contenu spécifique
- `POST /api/content` - Créer/Modifier contenu (Admin)
- `PUT /api/content/:section/:key` - Modifier contenu (Admin)
- `DELETE /api/content/:section/:key` - Supprimer contenu (Admin)

### 📁 Upload
- `POST /api/upload/image` - Upload image unique (Admin)
- `POST /api/upload/images` - Upload images multiples (Admin)
- `DELETE /api/upload/image` - Supprimer image (Admin)
- `GET /api/upload/files/:category` - Liste des fichiers (Admin)

### 🏷️ Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer catégorie (Admin)
- `PUT /api/categories/:id` - Modifier catégorie (Admin)
- `DELETE /api/categories/:id` - Supprimer catégorie (Admin)

### 🛒 Commandes
- `GET /api/orders` - Toutes les commandes (Admin)
- `GET /api/orders/:id` - Détail commande
- `POST /api/orders` - Créer commande
- `PATCH /api/orders/:id/status` - Modifier statut (Admin)
- `GET /api/orders/user/my-orders` - Commandes utilisateur

### 👥 Utilisateurs
- `GET /api/users` - Tous les utilisateurs (Admin)
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Modifier profil
- `PUT /api/users/password` - Changer mot de passe
- `PATCH /api/users/:id/role` - Modifier rôle (Admin)
- `DELETE /api/users/:id` - Supprimer utilisateur (Admin)

### 📊 Statistiques
- `GET /api/stats/dashboard` - Stats tableau de bord (Admin)
- `GET /api/stats/sales` - Analyses de ventes (Admin)
- `GET /api/stats/products` - Analyses produits (Admin)

## 🔧 Structure du Projet

```
backend/
├── data/                 # Fichiers JSON de données
├── middleware/           # Middlewares (auth, validation)
├── routes/              # Routes API
├── uploads/             # Fichiers uploadés
├── utils/               # Utilitaires
├── server.js            # Serveur principal
└── package.json
```

## 🔒 Sécurité

- Authentification JWT
- Validation des données avec Joi
- Rate limiting
- Helmet pour la sécurité HTTP
- CORS configuré
- Upload sécurisé avec validation

## 📱 Intégration Frontend

Le backend est conçu pour s'intégrer parfaitement avec le frontend PWA React. Toutes les données peuvent être modifiées via l'interface d'administration.

## 🚀 Déploiement

Le backend peut être déployé sur :
- Heroku
- Vercel
- Railway
- DigitalOcean
- AWS

## 📞 Support

Pour toute question ou support, contactez l'équipe de développement.