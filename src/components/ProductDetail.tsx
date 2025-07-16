import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Sparkles, Zap } from 'lucide-react';

interface ProductDetailProps {
  onNavigate: (page: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const product = {
    id: 1,
    name: "Vernis Gel UV Rose Élégant Premium",
    price: 8500,
    originalPrice: 12000,
    description: "Découvrez notre vernis gel UV rose élégant, spécialement conçu pour sublimer les ongles des femmes africaines. Sa formule longue tenue garantit une brillance exceptionnelle pendant 3 semaines. Enrichi en vitamines E et huiles naturelles pour nourrir vos ongles.",
    category: "Vernis à Ongles",
    stock: 15,
    rating: 4.9,
    reviewCount: 127,
    images: [
      "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3997394/pexels-photo-3997394.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    features: [
      "Formule longue tenue 3 semaines",
      "Séchage rapide sous UV/LED",
      "Enrichi en vitamine E",
      "Sans produits chimiques nocifs",
      "Couleur intense et brillante"
    ],
    specifications: {
      "Contenance": "15ml",
      "Temps de séchage": "60 secondes sous UV",
      "Durée": "Jusqu'à 3 semaines",
      "Application": "Base + 2 couches + Top coat"
    }
  };

  const similarProducts = [
    {
      id: 2,
      name: "Vernis Gel Rouge Passion",
      price: 8500,
      image: "https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8
    },
    {
      id: 3,
      name: "Vernis Gel Nude Naturel",
      price: 7500,
      image: "https://images.pexels.com/photos/3997392/pexels-photo-3997392.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.7
    },
    {
      id: 4,
      name: "Vernis Gel Doré Luxe",
      price: 9500,
      image: "https://images.pexels.com/photos/3997394/pexels-photo-3997394.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9
    }
  ];

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      onNavigate('cart');
    }, 2000);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-rose-pale/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-montserrat">
            <button 
              onClick={() => onNavigate('catalog')}
              className="flex items-center space-x-1 text-rose-vif hover:text-rose-vif/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au catalogue</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-rose-vif font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-rose-pale/30">
              <div 
                className="relative aspect-square cursor-zoom-in"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{
                    transform: showZoom ? 'scale(1.5)' : 'scale(1)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  }}
                />
                
                {/* Zoom Overlay */}
                {showZoom && (
                  <div className="absolute inset-0 bg-black/10 pointer-events-none">
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-montserrat text-gray-700">
                      Zoom activé
                    </div>
                  </div>
                )}

                {/* Wishlist & Share */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isWishlisted 
                        ? 'bg-rose-vif text-white' 
                        : 'bg-white/90 text-gray-600 hover:bg-rose-vif hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-vert-emeraude hover:text-white transition-all duration-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-rose-vif shadow-lg' 
                      : 'border-gray-200 hover:border-rose-pale'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="inline-block bg-rose-pale text-rose-vif px-4 py-2 rounded-full text-sm font-montserrat font-semibold">
                {product.category}
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-dore fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-montserrat">
                  ({product.reviewCount} avis)
                </span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="font-montserrat font-bold text-3xl text-rose-vif leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="font-montserrat font-bold text-4xl text-dore">
                {product.price.toLocaleString()} FCFA
              </span>
              {product.originalPrice && (
                <span className="font-montserrat text-xl text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()} FCFA
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-rose-vif text-white px-3 py-1 rounded-full text-sm font-montserrat font-semibold">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-montserrat font-semibold ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `En stock : ${product.stock} unités` : 'Rupture de stock'}
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="font-montserrat text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-rose-pale/30 to-white rounded-2xl p-6">
              <h3 className="font-montserrat font-semibold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-dore mr-2" />
                Caractéristiques principales
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 font-montserrat text-gray-700">
                    <div className="w-2 h-2 bg-rose-vif rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-montserrat font-semibold text-gray-800">Quantité :</span>
                <div className="flex items-center border border-rose-pale rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-rose-vif hover:bg-rose-pale transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-montserrat font-semibold text-gray-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-rose-vif hover:bg-rose-pale transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`w-full font-montserrat font-semibold py-4 rounded-xl transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                  product.stock > 0 && !isAddingToCart
                    ? 'bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${isAddingToCart ? 'animate-pulse' : ''}`}
              >
                {isAddingToCart ? (
                  <>
                    <Zap className="w-5 h-5 animate-bounce text-dore" />
                    <span>Ajout en cours...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>{product.stock > 0 ? 'Ajouter au panier' : 'Produit indisponible'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-rose-pale/30">
              <div className="flex items-center space-x-3 text-center md:text-left">
                <div className="w-10 h-10 bg-vert-emeraude/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-vert-emeraude" />
                </div>
                <div>
                  <p className="font-montserrat font-semibold text-gray-800 text-sm">Livraison gratuite</p>
                  <p className="font-montserrat text-xs text-gray-600">Dès 50.000 FCFA</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-center md:text-left">
                <div className="w-10 h-10 bg-dore/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-dore" />
                </div>
                <div>
                  <p className="font-montserrat font-semibold text-gray-800 text-sm">Garantie qualité</p>
                  <p className="font-montserrat text-xs text-gray-600">Produits certifiés</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-center md:text-left">
                <div className="w-10 h-10 bg-rose-vif/10 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-rose-vif" />
                </div>
                <div>
                  <p className="font-montserrat font-semibold text-gray-800 text-sm">Retour gratuit</p>
                  <p className="font-montserrat text-xs text-gray-600">Sous 14 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-16 bg-gradient-to-br from-rose-pale/20 to-white rounded-2xl p-8">
          <h3 className="font-great-vibes text-4xl text-vert-emeraude mb-8 text-center">
            Spécifications Techniques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl p-4 shadow-sm border border-rose-pale/30">
                <h4 className="font-montserrat font-semibold text-rose-vif mb-2">{key}</h4>
                <p className="font-montserrat text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <h3 className="font-great-vibes text-4xl text-vert-emeraude mb-8 text-center">
            Produits Similaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProducts.map((similarProduct) => (
              <div
                key={similarProduct.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-rose-pale/30 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={similarProduct.image}
                    alt={similarProduct.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-vif hover:text-white">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(similarProduct.rating)
                            ? 'text-dore fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 font-montserrat ml-2">
                      ({similarProduct.rating})
                    </span>
                  </div>

                  <h4 className="font-montserrat font-semibold text-gray-800 mb-3 text-lg group-hover:text-rose-vif transition-colors duration-300">
                    {similarProduct.name}
                  </h4>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-montserrat font-bold text-2xl text-dore">
                      {similarProduct.price.toLocaleString()} FCFA
                    </span>
                  </div>

                  <button 
                    onClick={() => onNavigate('product')}
                    className="w-full bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white font-montserrat font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Voir le produit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Golden Sparkle Animation */}
      {isAddingToCart && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-ping w-20 h-20 bg-dore rounded-full opacity-75"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="w-8 h-8 text-dore animate-spin" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;