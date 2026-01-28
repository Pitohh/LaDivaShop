import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Search,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  X,
  RefreshCw,
  Settings,
  Bell,
  Menu,
  Home,
  FileText,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { productsService } from '../services/products.service';
import { ordersService } from '../services/orders.service';
import { reportsService } from '../services/reports.service';
import ProductModal from './modals/ProductModal';
import OrderModal from './modals/OrderModal';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  // ... (keep state and effects same) ...
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // State for Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Real data state
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reportsData, setReportsData] = useState({
    sales: [],
    topProducts: []
  });
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    lowStock: 0,
    newCustomers: 0,
    monthlyGrowth: 0,
    avgOrderValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsData, ordersData, salesStats, topProducts] = await Promise.all([
        productsService.getAll(),
        ordersService.getAll(),
        reportsService.getSalesStats(),
        reportsService.getTopProducts()
      ]);

      // Adapt Products (snake_case to component format)
      const adaptedProducts = productsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        category: p.category_name || 'Général', // Backend join usually needed, fallback for now
        status: p.stock <= 5 ? 'low_stock' : 'active',
        sales: p.sales || 0,
        image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/100'
      }));

      // Adapt Orders
      const adaptedOrders = ordersData.map((o: any) => ({
        id: o.id.substring(0, 8).toUpperCase(), // Short ID for display
        rawId: o.id,
        customer: o.shipping_address?.fullName || 'Client',
        date: o.created_at,
        amount: o.total_amount,
        status: o.status,
        items: o.items ? o.items.length : 0,
        payment: o.payment_status
      }));

      setProducts(adaptedProducts);
      setOrders(adaptedOrders);

      // Calculate Stats
      const totalSales = adaptedOrders.reduce((sum, order) => sum + (order.payment === 'paid' ? order.amount : 0), 0);
      const totalOrders = adaptedOrders.length;
      const lowStock = adaptedProducts.filter(p => p.stock <= 5).length;
      const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

      setStats({
        totalSales,
        totalOrders,
        lowStock,
        newCustomers: 0, // Not available yet
        monthlyGrowth: 0, // Needs historical data
        avgOrderValue
      });

      setReportsData({
        sales: salesStats,
        topProducts: topProducts
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'confirmed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livrée';
      case 'shipped': return 'Expédiée';
      case 'processing': return 'En cours';
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      default: return 'En attente';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'stocks', label: 'Stocks', icon: BarChart3 },
    { id: 'reports', label: 'Rapports', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: number;
    subtitle?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-montserrat font-semibold">+{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="font-montserrat font-bold text-2xl text-gray-800 mb-1">{value}</h3>
      <p className="font-montserrat text-gray-600 text-sm">{title}</p>
      {subtitle && (
        <p className="font-montserrat text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-pale/20 to-white">
      {/* Breadcrumb */}
      <div className="bg-rose-pale/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-montserrat">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-1 text-rose-vif hover:text-rose-vif/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-rose-vif font-semibold">Administration</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-lg border-b border-rose-pale/30 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-rose-vif hover:bg-rose-pale/50 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <Sparkles className="text-rose-vif w-8 h-8" />
                <h1 className="font-great-vibes text-3xl text-rose-vif">
                  La Boutique Admin
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg text-gray-600 hover:bg-rose-pale/50 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-vif rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-vif to-rose-poudre rounded-full flex items-center justify-center">
                  <span className="font-montserrat font-bold text-white">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="font-montserrat font-semibold text-gray-800">Admin</p>
                  <p className="font-montserrat text-sm text-gray-600">Administrateur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-xl border-r border-rose-pale/30 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
          <div className="p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-montserrat font-medium transition-all duration-300 ${activeSection === item.id
                      ? 'bg-gradient-to-r from-rose-vif to-rose-poudre text-white shadow-lg'
                      : 'text-rose-vif hover:bg-rose-pale/50'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="w-8 h-8 text-rose-vif animate-spin" />
              <span className="ml-2 font-montserrat text-gray-600">Chargement des données...</span>
            </div>
          ) : (
            <>
              {activeSection === 'dashboard' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="font-great-vibes text-4xl text-vert-emeraude">
                      Tableau de Bord
                    </h2>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
                      <RefreshCw className="w-4 h-4" />
                      <span>Actualiser</span>
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                      title="Ventes totales"
                      value={`${stats.totalSales.toLocaleString()} FCFA`}
                      icon={DollarSign}
                      color="bg-dore/10 text-dore"
                      trend={stats.monthlyGrowth}
                      subtitle="Ce mois"
                    />
                    <StatCard
                      title="Commandes"
                      value={stats.totalOrders}
                      icon={ShoppingCart}
                      color="bg-rose-vif/10 text-rose-vif"
                      subtitle="Total ce mois"
                    />
                    <StatCard
                      title="Stock faible"
                      value={stats.lowStock}
                      icon={AlertTriangle}
                      color="bg-vert-emeraude/10 text-vert-emeraude"
                      subtitle="Produits à réapprovisionner"
                    />
                    <StatCard
                      title="Nouveaux clients"
                      value={stats.newCustomers}
                      icon={Users}
                      color="bg-purple-100 text-purple-600"
                      subtitle="Cette semaine"
                    />
                    <StatCard
                      title="Panier moyen"
                      value={`${stats.avgOrderValue.toLocaleString()} FCFA`}
                      icon={BarChart3}
                      color="bg-blue-100 text-blue-600"
                      subtitle="Valeur moyenne"
                    />
                    <StatCard
                      title="Taux de conversion"
                      value="3.2%"
                      icon={TrendingUp}
                      color="bg-green-100 text-green-600"
                      trend={2.1}
                      subtitle="Visiteurs → Acheteurs"
                    />
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-montserrat font-bold text-xl text-gray-800">
                        Commandes Récentes
                      </h3>
                      <button className="text-rose-vif hover:text-rose-vif/80 font-montserrat font-semibold">
                        Voir tout
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-rose-pale/30">
                            <th className="text-left font-montserrat font-semibold text-gray-700 pb-3">Commande</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 pb-3">Client</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 pb-3">Montant</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 pb-3">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-rose-pale/20 transition-colors">
                              <td className="py-4 font-montserrat text-gray-800">{order.id}</td>
                              <td className="py-4 font-montserrat text-gray-800">{order.customer}</td>
                              <td className="py-4 font-montserrat font-semibold text-dore">
                                {order.amount.toLocaleString()} FCFA
                              </td>
                              <td className="py-4">
                                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-montserrat font-semibold border ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  <span>{getStatusText(order.status)}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="font-great-vibes text-4xl text-vert-emeraude">
                      Gestion des Produits
                    </h2>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
                      <Plus className="w-4 h-4" />
                      <span>Nouveau produit</span>
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Rechercher un produit..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat"
                        />
                      </div>
                      <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat"
                      >
                        <option value="all">Toutes les catégories</option>
                        <option value="vernis">Vernis à Ongles</option>
                        <option value="perruques">Perruques</option>
                        <option value="soins">Soins Capillaires</option>
                        <option value="tissages">Tissages</option>
                      </select>
                      <button className="flex items-center space-x-2 bg-dore text-white font-montserrat font-semibold px-4 py-3 rounded-xl hover:bg-dore-fonce transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Exporter</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-rose-pale/30">
                          <tr>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Produit</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Prix</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Stock</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Ventes</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-100 hover:bg-rose-pale/10 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <h4 className="font-montserrat font-semibold text-gray-800">{product.name}</h4>
                                    <p className="font-montserrat text-sm text-gray-600">{product.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-montserrat font-semibold text-dore">
                                {product.price.toLocaleString()} FCFA
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-montserrat font-semibold ${product.stock <= 5
                                  ? 'bg-red-50 text-red-600 border border-red-200'
                                  : 'bg-green-50 text-green-600 border border-green-200'
                                  }`}>
                                  {product.stock} unités
                                </span>
                              </td>
                              <td className="p-4 font-montserrat text-gray-700">
                                {product.sales} vendus
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <button className="p-2 text-vert-emeraude hover:bg-vert-emeraude/10 rounded-lg transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-dore hover:bg-dore/10 rounded-lg transition-colors">
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'orders' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h2 className="font-great-vibes text-4xl text-vert-emeraude">
                      Gestion des Commandes
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-2 bg-dore text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:bg-dore-fonce transition-colors">
                        <Calendar className="w-4 h-4" />
                        <span>Filtrer par date</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
                        <Download className="w-4 h-4" />
                        <span>Exporter</span>
                      </button>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 p-6 hover:shadow-xl transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                              <div>
                                <h3 className="font-montserrat font-semibold text-lg text-gray-800">
                                  {order.id}
                                </h3>
                                <p className="font-montserrat text-sm text-gray-600">
                                  {order.customer} • {new Date(order.date).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-montserrat font-semibold border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span>{getStatusText(order.status)}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-6">
                                <span className="font-montserrat font-bold text-2xl text-dore">
                                  {order.amount.toLocaleString()} FCFA
                                </span>
                                <span className="font-montserrat text-gray-600">
                                  {order.items} article{order.items > 1 ? 's' : ''}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-semibold ${order.payment === 'paid'
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-orange-50 text-orange-600'
                                  }`}>
                                  {order.payment === 'paid' ? 'Payé' : 'En attente'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="flex items-center space-x-2 bg-vert-emeraude text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:bg-vert-emeraude/90 transition-colors">
                                  <Eye className="w-4 h-4" />
                                  <span>Voir</span>
                                </button>
                                <button className="flex items-center space-x-2 bg-dore text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:bg-dore-fonce transition-colors">
                                  <Edit3 className="w-4 h-4" />
                                  <span>Modifier</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'stocks' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-great-vibes text-4xl text-vert-emeraude">
                      Gestion des Stocks
                    </h2>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
                      <RefreshCw className="w-4 h-4" />
                      <span>Actualiser stocks</span>
                    </button>
                  </div>

                  {/* Stock Alerts */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      <h3 className="font-montserrat font-bold text-red-700">
                        Alertes Stock Faible
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.filter(p => p.stock <= 5).map((product) => (
                        <div key={product.id} className="bg-white rounded-xl p-4 border border-red-200">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-montserrat font-semibold text-gray-800 text-sm">
                                {product.name}
                              </h4>
                              <p className="font-montserrat text-red-600 font-bold">
                                {product.stock} unités restantes
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stock Table */}
                  <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-rose-pale/30">
                          <tr>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Produit</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Stock actuel</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Stock minimum</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Statut</th>
                            <th className="text-left font-montserrat font-semibold text-gray-700 p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-100 hover:bg-rose-pale/10 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <h4 className="font-montserrat font-semibold text-gray-800">{product.name}</h4>
                                    <p className="font-montserrat text-sm text-gray-600">{product.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-montserrat font-semibold text-gray-800">
                                {product.stock} unités
                              </td>
                              <td className="p-4 font-montserrat text-gray-600">
                                5 unités
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-montserrat font-semibold ${product.stock <= 5
                                  ? 'bg-red-50 text-red-600 border border-red-200'
                                  : product.stock <= 10
                                    ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                    : 'bg-green-50 text-green-600 border border-green-200'
                                  }`}>
                                  {product.stock <= 5 ? 'Critique' : product.stock <= 10 ? 'Faible' : 'Normal'}
                                </span>
                              </td>
                              <td className="p-4">
                                <button className="flex items-center space-x-2 bg-vert-emeraude text-white font-montserrat font-semibold px-3 py-2 rounded-lg hover:bg-vert-emeraude/90 transition-colors">
                                  <Plus className="w-4 h-4" />
                                  <span>Réapprovisionner</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'reports' && (
                <div className="space-y-6">
                  <h2 className="font-great-vibes text-4xl text-vert-emeraude">
                    Rapports et Analyses
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 p-6">
                      <h3 className="font-montserrat font-bold text-xl text-gray-800 mb-4">
                        Rapport de Ventes
                      </h3>
                      <p className="font-montserrat text-gray-600 mb-4">
                        Générer un rapport détaillé des ventes par période
                      </p>
                      <button className="w-full bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                        Générer le rapport
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 p-6">
                      <h3 className="font-montserrat font-bold text-xl text-gray-800 mb-4">
                        Analyse des Stocks
                      </h3>
                      <p className="font-montserrat text-gray-600 mb-4">
                        Rapport sur les mouvements de stock et prévisions
                      </p>
                      <button className="w-full bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white font-montserrat font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                        Analyser les stocks
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;