import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, X, ShoppingBag, Truck, Shield, Gift, Sparkles } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface CartProps {
  onNavigate: (page: string) => void;
}

const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Vernis Gel UV Rose Élégant",
      price: 8500,
      quantity: 2,
      image: "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=200",
      category: "Vernis à Ongles",
      inStock: true
    },
    {
      id: 2,
      name: "Perruque Lace Front Premium",
      price: 85000,
      quantity: 1,
      image: "https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=200",
      category: "Perruques",
      inStock: true
    },
    {
      id: 3,
      name: "Huile Capillaire Argan Bio",
      price: 18000,
      quantity: 1,
      image: "https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=200",
      category: "Soins Capillaires",
      inStock: true
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number, description: string } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setAppliedPromo({ code: 'WELCOME10', discount: 0.1, description: '10% de réduction' });
    } else if (promoCode.toLowerCase() === 'beauty20') {
      setAppliedPromo({ code: 'BEAUTY20', discount: 0.2, description: '20% de réduction' });
    } else {
      alert('Code promo invalide');
    }
    setPromoCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 50000 ? 0 : 5000;
  const promoDiscount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const total = subtotal + shippingCost - promoDiscount;

  const handleCheckout = () => {
    // Check if logged in here ideally
    // For now we open modal directly to keep flow simpler as requested by user integration
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    alert('Commande confirmée avec succès !');
    // Clear cart or redirect
    onNavigate('home');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-rose-pale mx-auto mb-6" />
          <h2 className="font-great-vibes text-4xl text-vert-emeraude mb-4">
            Votre panier est vide
          </h2>
          <p className="font-montserrat text-gray-600 mb-8">
            Découvrez nos produits de beauté exceptionnels
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-gradient-to-r from-rose-vif to-rose-poudre text-white font-montserrat font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-pale/20 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-rose-pale/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="flex items-center space-x-2 text-rose-vif hover:text-rose-vif/80 transition-colors font-montserrat"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Continuer les achats</span>
              </button>
            </div>
            <h1 className="font-great-vibes text-4xl text-vert-emeraude">
              Mon Panier
            </h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-montserrat">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <span className="absolute -top-2 -right-2 bg-rose-pale text-rose-vif px-2 py-1 rounded-full text-xs font-montserrat font-semibold">
                      {item.category}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-montserrat font-semibold text-lg text-rose-vif mb-2">
                          {item.name}
                        </h3>
                        <p className="font-montserrat text-sm text-gray-600">
                          Prix unitaire : <span className="text-dore font-semibold">{item.price.toLocaleString()} FCFA</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 bg-rose-pale rounded-full flex items-center justify-center text-rose-vif hover:bg-rose-vif hover:text-white transition-all duration-300 group"
                      >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      </button>
                    </div>

                    {/* Quantity & Total */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center space-x-3">
                        <span className="font-montserrat text-gray-700">Quantité :</span>
                        <div className="flex items-center border border-rose-pale rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-rose-vif hover:bg-rose-pale transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-montserrat font-semibold text-gray-800 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-rose-vif hover:bg-rose-pale transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-montserrat text-sm text-gray-600">Total</p>
                        <p className="font-montserrat font-bold text-2xl text-vert-emeraude">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code */}
            <div className="bg-white rounded-2xl shadow-lg border border-rose-pale/30 p-6">
              <h3 className="font-montserrat font-semibold text-gray-800 mb-4 flex items-center">
                <Gift className="w-5 h-5 text-dore mr-2" />
                Code Promo
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrez votre code promo"
                  className="flex-1 px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat"
                />
                <button
                  onClick={applyPromoCode}
                  className="bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Appliquer
                </button>
              </div>
              {appliedPromo && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-montserrat text-green-700 text-sm">
                    ✓ Code <strong>{appliedPromo.code}</strong> appliqué : {appliedPromo.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-rose-pale/30 to-white rounded-2xl shadow-lg border border-rose-pale/30 p-6 sticky top-8">
              <h3 className="font-great-vibes text-3xl text-vert-emeraude mb-6 text-center">
                Récapitulatif
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center font-montserrat">
                  <span className="text-gray-700">Sous-total</span>
                  <span className="font-semibold text-gray-800">{subtotal.toLocaleString()} FCFA</span>
                </div>

                <div className="flex justify-between items-center font-montserrat">
                  <span className="text-gray-700">Livraison</span>
                  <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toLocaleString()} FCFA`}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between items-center font-montserrat">
                    <span className="text-green-600">Réduction ({appliedPromo.code})</span>
                    <span className="font-semibold text-green-600">-{promoDiscount.toLocaleString()} FCFA</span>
                  </div>
                )}

                <div className="border-t border-rose-pale/50 pt-4">
                  <div className="flex justify-between items-center font-montserrat">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-dore">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {subtotal < 50000 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="font-montserrat text-blue-700 text-sm text-center">
                    Ajoutez {(50000 - subtotal).toLocaleString()} FCFA pour la livraison gratuite !
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full font-montserrat font-semibold py-4 rounded-xl transition-all duration-300 transform flex items-center justify-center space-x-2 bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white hover:shadow-xl hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Payer avec Mobile Money</span>
                </button>

                <button
                  onClick={() => onNavigate('catalog')}
                  className="w-full bg-transparent border-2 border-rose-vif text-rose-vif font-montserrat font-semibold py-3 rounded-xl hover:bg-rose-vif hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Continuer les achats
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-rose-pale/30">
                <div className="text-center">
                  <div className="w-10 h-10 bg-vert-emeraude/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-5 h-5 text-vert-emeraude" />
                  </div>
                  <p className="font-montserrat text-xs text-gray-600">Livraison rapide</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-dore/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-5 h-5 text-dore" />
                  </div>
                  <p className="font-montserrat text-xs text-gray-600">Paiement sécurisé</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-rose-vif/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-5 h-5 text-rose-vif" />
                  </div>
                  <p className="font-montserrat text-xs text-gray-600">Emballage soigné</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        cartItems={cartItems}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Cart;