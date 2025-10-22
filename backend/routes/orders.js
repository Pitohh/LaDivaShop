const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { loadData, saveData } = require('../utils/dataManager');

const router = express.Router();

// Get all orders (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, customer, startDate, endDate, limit, offset } = req.query;
    let orders = await loadData('orders');

    // Filters
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    if (customer) {
      orders = orders.filter(o => 
        o.customer.toLowerCase().includes(customer.toLowerCase())
      );
    }

    if (startDate) {
      orders = orders.filter(o => new Date(o.date) >= new Date(startDate));
    }

    if (endDate) {
      orders = orders.filter(o => new Date(o.date) <= new Date(endDate));
    }

    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const total = orders.length;
    if (limit) {
      const limitNum = parseInt(limit);
      const offsetNum = parseInt(offset) || 0;
      orders = orders.slice(offsetNum, offsetNum + limitNum);
    }

    res.json({
      orders,
      total,
      count: orders.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orders = await loadData('orders');
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, promoCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Articles requis' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Adresse de livraison requise' });
    }

    // Calculate total
    const products = await loadData('products');
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Produit ${item.productId} non trouvé` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Stock insuffisant pour ${product.name}. Stock disponible: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
        image: product.images[0] || null
      });
    }

    // Apply promo code if provided
    let discount = 0;
    if (promoCode) {
      // Simple promo code logic
      if (promoCode.toLowerCase() === 'welcome10') {
        discount = subtotal * 0.1;
      } else if (promoCode.toLowerCase() === 'beauty20') {
        discount = subtotal * 0.2;
      }
    }

    const shippingCost = subtotal >= 50000 ? 0 : 5000;
    const total = subtotal + shippingCost - discount;

    const newOrder = {
      id: `CMD-${Date.now()}`,
      userId: req.user.id,
      customer: `${req.user.firstName} ${req.user.lastName}`,
      customerEmail: req.user.email,
      items: orderItems,
      subtotal,
      shippingCost,
      discount,
      total,
      status: 'confirmed',
      paymentStatus: 'pending',
      paymentMethod,
      shippingAddress,
      promoCode: promoCode || null,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update product stock
    for (const item of items) {
      const productIndex = products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        products[productIndex].stock -= item.quantity;
        products[productIndex].sales = (products[productIndex].sales || 0) + item.quantity;
      }
    }

    const orders = await loadData('orders');
    orders.push(newOrder);

    await saveData('orders', orders);
    await saveData('products', products);

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: newOrder
    });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const orders = await loadData('orders');
    const orderIndex = orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    await saveData('orders', orders);

    res.json({
      message: 'Statut de la commande mis à jour avec succès',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get user orders
router.get('/user/my-orders', authenticateToken, async (req, res) => {
  try {
    const orders = await loadData('orders');
    const userOrders = orders
      .filter(o => o.userId === req.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(userOrders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;