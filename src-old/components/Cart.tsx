import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, X, ShoppingBag, Truck, Shield, Gift, Sparkles, CreditCard, Wallet } from 'lucide-react';
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
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    alert('Commande confirmée avec succès !');
    onNavigate('home');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-primary/20 mx-auto mb-6" />
          <h2 className="font-heading text-4xl text-secondary mb-4">
            Votre panier est vide
          </h2>
          <p className="font-body text-gray-600 mb-8">
            Découvrez nos produits de beauté exceptionnels
          </p>
          <button
            onClick={() => onNavigate('catalog')}
            className="btn-primary"
          >
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-4xl text-secondary">
              Mon Panier
            </h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-100 last:border-0"
              >
                {/* Product Image */}
                <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <span className="absolute -top-2 -right-2 bg-background-pale text-primary px-2 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-secondary mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Réf: {item.id.toString().padStart(4, '0')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                    {/* Quantity Control */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:text-primary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold text-secondary min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        x {item.price.toLocaleString()} FCFA
                      </span>
                    </div>

                    {/* Total Item */}
                    <div className="text-right">
                      <p className="font-bold text-xl text-primary">
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-secondary mb-4 flex items-center">
                <Gift className="w-5 h-5 text-dore mr-2" />
                Code Promo
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrez votre code"
                  className="input-couture flex-1 bg-transparent px-2"
                />
                <button
                  onClick={applyPromoCode}
                  className="btn-secondary px-8 py-2 text-sm"
                >
                  Appliquer
                </button>
              </div>
              {appliedPromo && (
                <p className="mt-3 text-sm text-green-600 font-medium">
                  ✓ Code {appliedPromo.code} appliqué : {appliedPromo.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continuer mes achats</span>
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background-pale rounded-2xl p-8 sticky top-8">
              <h3 className="font-heading text-2xl text-secondary mb-6">
                Résumé de la commande
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <span>Livraison</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                    {shippingCost === 0 ? 'Offerte' : `${shippingCost.toLocaleString()} FCFA`}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Réduction</span>
                    <span className="font-medium">-{promoDiscount.toLocaleString()} FCFA</span>
                  </div>
                )}

                <div className="border-t border-secondary/10 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-heading text-xl text-secondary">Total</span>
                    <div className="text-right">
                      <span className="block font-heading text-3xl text-primary font-bold">
                        {total.toLocaleString()} <span className="text-base font-normal">FCFA</span>
                      </span>
                      <span className="text-xs text-gray-500">TVA incluse</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-4 text-lg shadow-xl mb-6 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Payer Maintenant</span>
              </button>

              {/* Payment Trust Signals */}
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-500 font-medium">
                  Paiement 100% Sécurisé via PVit
                </p>
                <div className="flex justify-center items-center space-x-4 grayscale opacity-70">
                  {/* Logos placeholders - representing Visa, Airtel, Moov */}
                  <div className="h-8 bg-white border border-gray-200 rounded px-2 flex items-center font-bold text-xs text-blue-800">VISA</div>
                  <div className="h-8 bg-white border border-gray-200 rounded px-2 flex items-center font-bold text-xs text-red-600">Airtel</div>
                  <div className="h-8 bg-white border border-gray-200 rounded px-2 flex items-center font-bold text-xs text-orange-500">Moov</div>
                </div>

                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-4 border-t border-secondary/5">
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" /> SSL Sécurisé
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-3 h-3 mr-1" /> Livraison 24h
                  </div>
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