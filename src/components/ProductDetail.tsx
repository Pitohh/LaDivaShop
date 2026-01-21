import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsService, Product } from '../services/products.service';

interface ProductDetailProps {
  onNavigate: (page: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onNavigate }) => {
  const [id, setId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>('Standard');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const addToCartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (productId) setId(productId);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await productsService.getById(id);
          setProduct(data);
        } else {
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

  useEffect(() => {
    const handleScroll = () => {
      if (addToCartRef.current) {
        const rect = addToCartRef.current.getBoundingClientRect();
        setIsStickyVisible(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || 'Produit non trouvé'}
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg'];
  const variants = ['Standard', 'Premium', 'Deluxe'];

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      onNavigate('cart');
    }, 1500);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -carouselRef.current.offsetWidth : carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-background-pale py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-body">
            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au catalogue</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.categoryId || 'Catégorie'}</span>
            <span className="text-gray-400">/</span>
            <span className="text-secondary font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Mobile: Swipeable Carousel */}
            <div className="lg:hidden">
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-full snap-center"
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-96 object-cover rounded-2xl"
                      />
                    </div>
                  ))}
                </div>
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() => scrollCarousel('left')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-secondary shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-secondary shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {/* Wishlist & Share - Mobile */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-primary text-white' : 'bg-white/90 text-secondary hover:bg-primary hover:text-white'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop: Mosaic Grid */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-4 gap-4">
                {/* Large Main Image */}
                <div className="col-span-4 row-span-2 relative watermarked overflow-hidden rounded-2xl">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-[500px] object-cover"
                  />
                  {/* Wishlist & Share - Desktop */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-primary text-white' : 'bg-white/90 text-secondary hover:bg-primary hover:text-white'
                        }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Grid */}
                {productImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-primary/50'
                      }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-body font-semibold">
                {product.categoryId || 'N/A'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-primary fill-current' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-body">({product.reviewCount} avis)</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="font-heading font-bold text-4xl text-secondary leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="font-heading font-bold text-5xl text-primary">
                {product.price.toLocaleString()} FCFA
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-body text-xl text-gray-400 line-through">
                    {product.originalPrice.toLocaleString()} FCFA
                  </span>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-body font-semibold">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-body font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `En stock : ${product.stock} unités` : 'Rupture de stock'}
              </span>
            </div>

            {/* Description */}
            <p className="font-body text-gray-700 leading-relaxed">{product.description}</p>

            {/* Variant Selector (Pills) */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-secondary">Variante</h3>
              <div className="flex items-center space-x-3">
                {variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`btn-pill ${selectedVariant === variant ? 'active' : ''}`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div ref={addToCartRef} className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="font-body font-semibold text-secondary">Quantité :</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-primary hover:bg-background-pale transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-body font-semibold text-secondary min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-primary hover:bg-background-pale transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`w-full btn-primary ${isAddingToCart ? 'animate-pulse' : ''} disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddingToCart ? 'Ajout en cours...' : product.stock > 0 ? 'Ajouter au panier' : 'Produit indisponible'}
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-body font-semibold text-secondary text-sm">Livraison gratuite</p>
                  <p className="font-body text-xs text-gray-600">Dès 50.000 FCFA</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body font-semibold text-secondary text-sm">Garantie qualité</p>
                  <p className="font-body text-xs text-gray-600">Produits certifiés</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body font-semibold text-secondary text-sm">Retour gratuit</p>
                  <p className="font-body text-xs text-gray-600">Sous 14 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-16 bg-background-pale rounded-2xl p-8">
            <h3 className="font-heading text-4xl text-secondary mb-8 text-center">
              Spécifications Techniques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h4 className="font-body font-semibold text-primary mb-2">{key}</h4>
                  <p className="font-body text-gray-700">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      {isStickyVisible && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 z-40 shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between space-x-4">
            <div>
              <p className="font-heading text-2xl text-primary font-bold">
                {product.price.toLocaleString()} FCFA
              </p>
              <p className="text-xs text-gray-600 font-body">{product.name}</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;