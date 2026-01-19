# 🌸 LaDivaShop Backend API

Backend Node.js/Express pour l'application e-commerce LaDivaShop avec intégration PVit pour paiements mobile (Airtel Money & Moov Money).

## 🚀 Technologies

- **Node.js** with ES6 modules
- **Express.js** - Framework web
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **bcryptjs** - Hashing mots de passe
- **PVit API** - Paiements mobile money

## 📋 Prerequisites

- Node.js >= 16
- PostgreSQL >= 14
- Compte marchand PVit (Airtel Money & Moov Money)

## ⚙️ Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copier `.env.example` vers `.env` et configurer:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ladivashop

# JWT
JWT_SECRET=your-secret-key-here

# Server
PORT=3001

# PVit
PVIT_AM_CODE_MARCHAND=XXXAM01  # Votre code marchand Airtel Money
PVIT_MC_CODE_MARCHAND=XXXMC01  # Votre code marchand Moov Money
PVIT_API_URL=https://mypvitapi.pro/api/pvit-secure-full-api-v3.kk
PVIT_CALLBACK_URL=http://localhost:3001/api/payments/callback
```

### 3. Setup de la base de données

Exécuter le script de setup:

```bash
chmod +x setup-db.sh
./setup-db.sh
```

Ou manuellement:

```bash
# Créer la base
createdb -U username ladivashop

# Exécuter migrations
npm run migrate

# Seed data
npm run seed
```

## 🎯 Utilisation

### Démarrage en développement

```bash
npm run dev
```

### Démarrage en production

```bash
npm start
```

Le serveur démarre sur `http://localhost:3001`

## 📡 API Routes

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel (protégé)
- `POST /api/auth/logout` - Déconnexion (protégé)

### Products (`/api/products`)

- `GET /api/products` - Liste produits (avec filtres)
- `GET /api/products/:id` - Détail produit
- `POST /api/products` - Créer produit (admin)
- `PUT /api/products/:id` - Modifier produit (admin)
- `DELETE /api/products/:id` - Supprimer produit (admin)

### Categories (`/api/categories`)

- `GET /api/categories` - Liste catégories
- `GET /api/categories/:id` - Détail catégorie
- `POST /api/categories` - Créer catégorie (admin)
- `PUT /api/categories/:id` - Modifier catégorie (admin)
- `DELETE /api/categories/:id` - Supprimer catégorie (admin)

### Orders (`/api/orders`)

- `GET /api/orders` - Liste commandes (protégé)
- `GET /api/orders/:id` - Détail commande (protégé)
- `POST /api/orders` - Créer commande (protégé)
- `PUT /api/orders/:id` - Modifier commande (protégé)
- `POST /api/orders/:id/cancel` - Annuler commande (protégé)

### Payments (`/api/payments`)

- `POST /api/payments/initiate` - Initier paiement (protégé)
- `POST /api/payments/calculate-fees` - Calculer frais
- `GET /api/payments/status/:reference` - Statut paiement
- `POST /api/payments/callback` - Callback PVit (public, XML)

## 💳 Intégration PVit

### Initier un paiement

```javascript
POST /api/payments/initiate
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "orderId": "uuid-order-id",
  "numeroClient": "06XXXXXXX",
  "operateur": "AM"  // AM = Airtel, MC = Moov
}
```

### Calculer les frais

```javascript
POST /api/payments/calculate-fees
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "montant": 10000,
  "operateur": "MC"
}
```

### Callback PVit

Le callback PVit est configuré dans votre compte MyPVit:
```
URL: http://votre-domaine.com/api/payments/callback
```

PVit enverra le statut final de la transaction en XML. Le backend:
1. Parse le XML
2. Met à jour le statut du paiement
3. Met à jour le statut de la commande
4. Stocke le nouveau token PVit

## 🔐 Authentification

Toutes les routes protégées nécessitent un JWT dans le header:

```
Authorization: Bearer <your-jwt-token>
```

Le token est retourné lors du login/register et est valide 7 jours.

## 👤 Comptes par défaut

Après le seed, un compte admin est créé:

```
Email: admin@ladivashop.com
Password: admin123
```

**⚠️ Changez ce mot de passe en production!**

## 📊 Base de données

### Tables

- `users` - Utilisateurs avec authentification
- `categories` - Catégories de produits
- `products` - Catalogue de produits
- `orders` - Commandes clients
- `payments` - Transactions PVit
- `pvit_tokens` - Tokens PVit par opérateur
- `content` - Contenu CMS

## 🧪 Testing

```bash
# Test health check
curl http://localhost:3001/health

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ladivashop.com","password":"admin123"}'

# Test products
curl http://localhost:3001/api/products
```

## 📝 Scripts

- `npm run dev` - Démarrer en mode développement (avec watch)
- `npm start` - Démarrer en production
- `npm run migrate` - Exécuter migrations
- `npm run seed` - Insérer données de test

## 🐛 Debugging

Les logs sont affichés dans la console avec Morgan en mode développement.

Pour debug PostgreSQL:
```bash
# Se connecter à la DB
psql -U username -d ladivashop

# Vérifier les tables
\dt

# Voir les données
SELECT * FROM users;
SELECT * FROM products;
```

## 🚀 Déploiement

Voir`../docs/DEPLOYMENT.md` pour les instructions de déploiement.

## 📄 License

MIT
