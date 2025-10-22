const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { loadData } = require('../utils/dataManager');

const router = express.Router();

// Get dashboard statistics (Admin only)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [products, orders, users] = await Promise.all([
      loadData('products'),
      loadData('orders'),
      loadData('users')
    ]);

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Orders this month
    const ordersThisMonth = orders.filter(o => new Date(o.date) >= thisMonth);
    const ordersLastMonth = orders.filter(o => 
      new Date(o.date) >= lastMonth && new Date(o.date) < thisMonth
    );

    // Sales calculations
    const totalSales = ordersThisMonth.reduce((sum, order) => sum + order.total, 0);
    const totalSalesLastMonth = ordersLastMonth.reduce((sum, order) => sum + order.total, 0);
    const salesGrowth = totalSalesLastMonth > 0 
      ? ((totalSales - totalSalesLastMonth) / totalSalesLastMonth) * 100 
      : 0;

    // Low stock products
    const lowStockProducts = products.filter(p => p.stock <= 5);

    // New customers this month
    const newCustomers = users.filter(u => new Date(u.createdAt) >= thisMonth);

    // Average order value
    const avgOrderValue = ordersThisMonth.length > 0 
      ? totalSales / ordersThisMonth.length 
      : 0;

    // Order status distribution
    const orderStatusDistribution = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Top selling products
    const productSales = products
      .filter(p => p.sales > 0)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        name: p.name,
        sales: p.sales,
        revenue: p.sales * p.price
      }));

    // Monthly sales trend (last 6 months)
    const monthlySales = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });
      
      const monthTotal = monthOrders.reduce((sum, order) => sum + order.total, 0);
      
      monthlySales.push({
        month: monthStart.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        sales: monthTotal,
        orders: monthOrders.length
      });
    }

    const stats = {
      totalSales,
      totalOrders: ordersThisMonth.length,
      lowStock: lowStockProducts.length,
      newCustomers: newCustomers.length,
      monthlyGrowth: Math.round(salesGrowth * 10) / 10,
      avgOrderValue: Math.round(avgOrderValue),
      orderStatusDistribution,
      topProducts: productSales,
      monthlySales,
      lowStockProducts: lowStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        category: p.category
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get sales analytics (Admin only)
router.get('/sales', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const orders = await loadData('orders');

    let startDate;
    const now = new Date();

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const periodOrders = orders.filter(o => new Date(o.date) >= startDate);

    // Daily sales for the period
    const dailySales = {};
    periodOrders.forEach(order => {
      const date = new Date(order.date).toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { sales: 0, orders: 0 };
      }
      dailySales[date].sales += order.total;
      dailySales[date].orders += 1;
    });

    // Convert to array and sort
    const salesData = Object.entries(dailySales)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      period,
      totalSales: periodOrders.reduce((sum, order) => sum + order.total, 0),
      totalOrders: periodOrders.length,
      avgOrderValue: periodOrders.length > 0 
        ? periodOrders.reduce((sum, order) => sum + order.total, 0) / periodOrders.length 
        : 0,
      salesData
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des analyses de ventes:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Get product analytics (Admin only)
router.get('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await loadData('products');
    const orders = await loadData('orders');

    // Calculate product performance
    const productStats = products.map(product => {
      const productOrders = orders.filter(order => 
        order.items.some(item => item.productId === product.id)
      );

      const totalQuantitySold = productOrders.reduce((sum, order) => {
        const productItem = order.items.find(item => item.productId === product.id);
        return sum + (productItem ? productItem.quantity : 0);
      }, 0);

      const totalRevenue = productOrders.reduce((sum, order) => {
        const productItem = order.items.find(item => item.productId === product.id);
        return sum + (productItem ? productItem.total : 0);
      }, 0);

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        quantitySold: totalQuantitySold,
        revenue: totalRevenue,
        conversionRate: product.views ? (totalQuantitySold / product.views) * 100 : 0
      };
    });

    // Sort by revenue
    productStats.sort((a, b) => b.revenue - a.revenue);

    // Category performance
    const categoryStats = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = {
          category: product.category,
          productCount: 0,
          totalStock: 0,
          totalRevenue: 0,
          avgPrice: 0
        };
      }

      const productStat = productStats.find(p => p.id === product.id);
      acc[product.category].productCount += 1;
      acc[product.category].totalStock += product.stock;
      acc[product.category].totalRevenue += productStat.revenue;
      acc[product.category].avgPrice += product.price;

      return acc;
    }, {});

    // Calculate average prices
    Object.values(categoryStats).forEach(cat => {
      cat.avgPrice = cat.avgPrice / cat.productCount;
    });

    res.json({
      productStats,
      categoryStats: Object.values(categoryStats),
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive !== false).length,
      outOfStock: products.filter(p => p.stock === 0).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des analyses produits:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;