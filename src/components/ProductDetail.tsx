import React, { useState, useEffect } from 'react';

import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { productsService, Product } from '../services/products.service';

interface ProductDetailProps {
  onNavigate: (page: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onNavigate }) => {
  // Simple URL param parser for our custom routing
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (productId) setId(productId);
  }, []);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    // If no ID in URL, maybe we can resort to a default or just wait. 
    // For testing purposes, if ID is null, we can try to fetch the first product from the list?
    // Or we can modify Catalog to pass ID in URL.
    // For now, let's try to fetch if we have an ID.
    // If we don't have an ID, we might fallback to fetching all and showing the first one (bad for perf but good for demo).

    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await productsService.getById(id);
          setProduct(data);
        } else {
          // Fallback: This is provisional to make it work without a proper router passing ID
          // We look for 'id' in localStorage or query param
          const storedId = localStorage.getItem('currentProductId');
          if (storedId) {
            const data = await productsService.getById(storedId);
            setProduct(data);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-vif"></div></div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Produit non trouvé'}</div>;

  // Safe images access
  const productImages = product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg'];

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      onNavigate('cart');
    }, 2000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
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
            <span className="text-gray-600">{product.categoryId || 'Catégorie'}</span>
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
                  src={productImages[selectedImage]}
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isWishlisted
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
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
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
                {product.categoryId || 'N/A'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating)
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
              <span className={`font-montserrat font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
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
            {product.features && product.features.length > 0 && (
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
            )}

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
                className={`w-full font-montserrat font-semibold py-4 rounded-xl transition-all duration-300 transform flex items-center justify-center space-x-2 ${product.stock > 0 && !isAddingToCart
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
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-rose-pale/20 to-white rounded-2xl p-8">
            <h3 className="font-great-vibes text-4xl text-vert-emeraude mb-8 text-center">
              Spécifications Techniques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="bg-white rounded-xl p-4 shadow-sm border border-rose-pale/30">
                  <h4 className="font-montserrat font-semibold text-rose-vif mb-2">{key}</h4>
                  <p className="font-montserrat text-gray-700">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
                        className={`w-4 h-4 ${i < Math.floor(similarProduct.rating)
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