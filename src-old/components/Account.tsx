import React, { useState } from 'react';
import { User, Package, LogOut, Edit3, Save, X, Crown, Calendar, MapPin, Phone, Mail, Eye, Star, Truck, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

interface AccountProps {
  onNavigate: (page: string) => void;
}

const Account: React.FC<AccountProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: 'Aminata',
    lastName: 'Diallo',
    email: 'aminata.diallo@email.com',
    phone: '+241 74 42 10 60',
    address: '834 LBV, Libreville, Gabon',
    birthDate: '1990-05-15'
  });

  const userProfile = {
    firstName: 'Aminata',
    lastName: 'Diallo',
    email: 'aminata.diallo@email.com',
    phone: '+241 74 42 10 60',
    address: '834 LBV, Libreville, Gabon',
    birthDate: '1990-05-15',
    memberSince: '2023-01-15',
    totalOrders: 12,
    totalSpent: 485000,
    vipStatus: 'Gold'
  };

  const orderHistory = [
    {
      id: 'CMD-2024-001',
      date: '2024-01-15',
      amount: 125000,
      status: 'delivered',
      items: 3,
      products: [
        { name: 'Vernis Gel UV Rose', image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { name: 'Perruque Lace Front', image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ]
    },
    {
      id: 'CMD-2024-002',
      date: '2024-01-10',
      amount: 85000,
      status: 'shipped',
      items: 2,
      products: [
        { name: 'Huile Capillaire Argan', image: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ]
    },
    {
      id: 'CMD-2024-003',
      date: '2024-01-05',
      amount: 45000,
      status: 'processing',
      items: 1,
      products: [
        { name: 'Kit Manucure Deluxe', image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ]
    },
    {
      id: 'CMD-2023-012',
      date: '2023-12-20',
      amount: 230000,
      status: 'delivered',
      items: 4,
      products: [
        { name: 'Tissage Brésilien', image: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=100' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Livrée';
      case 'shipped': return 'Expédiée';
      case 'processing': return 'En cours';
      case 'cancelled': return 'Annulée';
      default: return 'En attente';
    }
  };

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    }, 1000);
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address,
      birthDate: userProfile.birthDate
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    onNavigate('login');
  };

  const menuItems = [
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'orders', label: 'Mes Commandes', icon: Package },
    { id: 'logout', label: 'Déconnexion', icon: LogOut }
  ];

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
            <span className="text-rose-vif font-semibold">Mon Compte</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 overflow-hidden sticky top-8">
              {/* User Avatar & Info */}
              <div className="bg-gradient-to-br from-rose-vif to-rose-poudre p-6 text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="font-montserrat font-bold text-lg">
                  {userProfile.firstName} {userProfile.lastName}
                </h3>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Crown className="w-4 h-4 text-dore" />
                  <span className="font-montserrat text-sm text-dore">Membre {userProfile.vipStatus}</span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-6">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'logout') {
                            handleLogout();
                          } else {
                            setActiveSection(item.id);
                          }
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-montserrat font-medium transition-all duration-300 ${
                          activeSection === item.id
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

                {/* Stats */}
                <div className="mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-dore/10 to-dore/5 rounded-xl p-4 border border-dore/20">
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat text-sm text-gray-700">Total dépensé</span>
                      <span className="font-montserrat font-bold text-dore">
                        {userProfile.totalSpent.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-vert-emeraude/10 to-vert-emeraude/5 rounded-xl p-4 border border-vert-emeraude/20">
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat text-sm text-gray-700">Commandes</span>
                      <span className="font-montserrat font-bold text-vert-emeraude">
                        {userProfile.totalOrders}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-full bg-gradient-to-r from-rose-vif to-rose-poudre text-white font-montserrat font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Menu Compte</span>
            </button>

            {isMenuOpen && (
              <div className="mt-4 bg-white rounded-xl shadow-lg border border-rose-pale/30 p-4">
                <div className="grid grid-cols-3 gap-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'logout') {
                            handleLogout();
                          } else {
                            setActiveSection(item.id);
                            setIsMenuOpen(false);
                          }
                        }}
                        className={`flex flex-col items-center space-y-2 p-3 rounded-lg font-montserrat text-sm transition-all duration-300 ${
                          activeSection === item.id
                            ? 'bg-rose-vif text-white'
                            : 'text-rose-vif hover:bg-rose-pale/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-pale/50 to-white p-6 border-b border-rose-pale/30">
                  <div className="flex items-center justify-between">
                    <h2 className="font-great-vibes text-4xl text-vert-emeraude">
                      Mon Profil
                    </h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Modifier</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center space-x-2 bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          <Save className="w-4 h-4" />
                          <span>Sauvegarder</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-2 bg-gray-500 text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:bg-gray-600 transition-all duration-300"
                        >
                          <X className="w-4 h-4" />
                          <span>Annuler</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="font-montserrat font-semibold text-lg text-gray-800 border-b border-dore/30 pb-2">
                        Informations Personnelles
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2">
                              Prénom
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedProfile.firstName}
                                onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-dore/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dore focus:border-transparent font-montserrat"
                              />
                            ) : (
                              <p className="font-montserrat text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                                {userProfile.firstName}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2">
                              Nom
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedProfile.lastName}
                                onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-dore/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dore focus:border-transparent font-montserrat"
                              />
                            ) : (
                              <p className="font-montserrat text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                                {userProfile.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-rose-vif" />
                            Email
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editedProfile.email}
                              onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-dore/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dore focus:border-transparent font-montserrat"
                            />
                          ) : (
                            <p className="font-montserrat text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                              {userProfile.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-rose-vif" />
                            Téléphone
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editedProfile.phone}
                              onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-dore/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dore focus:border-transparent font-montserrat"
                            />
                          ) : (
                            <p className="font-montserrat text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                              {userProfile.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-rose-vif" />
                            Adresse
                          </label>
                          {isEditing ? (
                            <textarea
                              value={editedProfile.address}
                              onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                              rows={3}
                              className="w-full px-4 py-3 border-2 border-dore/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dore focus:border-transparent font-montserrat resize-none"
                            />
                          ) : (
                            <p className="font-montserrat text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                              {userProfile.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="space-y-6">
                      <h3 className="font-montserrat font-semibold text-lg text-gray-800 border-b border-dore/30 pb-2">
                        Informations du Compte
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-rose-vif" />
                            Date de naissance
                          </label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editedProfile.birthDate}
                              onChange={(e) => setEditedProfile({...editedProfile, birthDate: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-dore/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-dore focus:border-transparent font-montserrat"
                            />
                          ) : (
                            <p className="font-montserrat text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                              {new Date(userProfile.birthDate).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2">
                            Membre depuis
                          </label>
                          <p className="font-montserrat text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                            {new Date(userProfile.memberSince).toLocaleDateString('fr-FR')}
                          </p>
                        </div>

                        <div>
                          <label className="block font-montserrat text-sm font-medium text-gray-700 mb-2">
                            Statut VIP
                          </label>
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-dore/10 to-dore/5 px-4 py-3 rounded-xl border border-dore/30">
                            <Crown className="w-5 h-5 text-dore" />
                            <span className="font-montserrat font-semibold text-dore">
                              Membre {userProfile.vipStatus}
                            </span>
                          </div>
                        </div>

                        {/* VIP Benefits */}
                        <div className="bg-gradient-to-br from-rose-pale/30 to-white rounded-xl p-4 border border-rose-pale/50">
                          <h4 className="font-montserrat font-semibold text-gray-800 mb-3 flex items-center">
                            <Star className="w-4 h-4 text-dore mr-2" />
                            Avantages VIP
                          </h4>
                          <ul className="space-y-2 text-sm font-montserrat text-gray-700">
                            <li className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-dore rounded-full"></div>
                              <span>Livraison gratuite sur toutes les commandes</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-dore rounded-full"></div>
                              <span>Accès prioritaire aux nouveautés</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-dore rounded-full"></div>
                              <span>Réductions exclusives jusqu'à 20%</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-pale/50 to-white p-6 border-b border-rose-pale/30">
                  <h2 className="font-great-vibes text-4xl text-vert-emeraude">
                    Historique des Commandes
                  </h2>
                  <p className="font-montserrat text-gray-600 mt-2">
                    Retrouvez toutes vos commandes et leur statut
                  </p>
                </div>

                {/* Orders List */}
                <div className="p-6">
                  <div className="space-y-6">
                    {orderHistory.map((order, index) => (
                      <div
                        key={order.id}
                        className="bg-gradient-to-r from-white to-rose-pale/10 rounded-xl border border-rose-pale/30 p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                              <div>
                                <h3 className="font-montserrat font-semibold text-lg text-gray-800">
                                  Commande #{order.id}
                                </h3>
                                <p className="font-montserrat text-sm text-gray-600">
                                  {new Date(order.date).toLocaleDateString('fr-FR')} • {order.items} article{order.items > 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-montserrat font-semibold border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span>{getStatusText(order.status)}</span>
                              </div>
                            </div>

                            {/* Product Images */}
                            <div className="flex items-center space-x-2 mb-4">
                              <span className="font-montserrat text-sm text-gray-600">Produits :</span>
                              <div className="flex -space-x-2">
                                {order.products.slice(0, 3).map((product, idx) => (
                                  <img
                                    key={idx}
                                    src={product.image}
                                    alt={product.name}
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                  />
                                ))}
                                {order.products.length > 3 && (
                                  <div className="w-8 h-8 rounded-full border-2 border-white bg-rose-pale flex items-center justify-center">
                                    <span className="text-xs font-montserrat font-semibold text-rose-vif">
                                      +{order.products.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-montserrat font-bold text-2xl text-dore">
                                {order.amount.toLocaleString()} FCFA
                              </span>
                              <button className="flex items-center space-x-2 bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white font-montserrat font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                <Eye className="w-4 h-4" />
                                <span>Voir</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-vert-emeraude/10 to-vert-emeraude/5 rounded-xl p-6 border border-vert-emeraude/20 text-center">
                      <Package className="w-8 h-8 text-vert-emeraude mx-auto mb-3" />
                      <h4 className="font-montserrat font-bold text-2xl text-vert-emeraude">
                        {userProfile.totalOrders}
                      </h4>
                      <p className="font-montserrat text-sm text-gray-600">Commandes totales</p>
                    </div>
                    <div className="bg-gradient-to-br from-dore/10 to-dore/5 rounded-xl p-6 border border-dore/20 text-center">
                      <Crown className="w-8 h-8 text-dore mx-auto mb-3" />
                      <h4 className="font-montserrat font-bold text-2xl text-dore">
                        {userProfile.totalSpent.toLocaleString()}
                      </h4>
                      <p className="font-montserrat text-sm text-gray-600">FCFA dépensés</p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-vif/10 to-rose-vif/5 rounded-xl p-6 border border-rose-vif/20 text-center">
                      <Star className="w-8 h-8 text-rose-vif mx-auto mb-3" />
                      <h4 className="font-montserrat font-bold text-2xl text-rose-vif">
                        {userProfile.vipStatus}
                      </h4>
                      <p className="font-montserrat text-sm text-gray-600">Statut membre</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;