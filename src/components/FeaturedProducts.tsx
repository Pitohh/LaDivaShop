import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { productsService } from '../services/products.service';

interface FeaturedProductsProps {
  onNavigate: (page: string) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getAll();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-vif"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-chandelier-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-great-vibes text-5xl text-vert-emeraude mb-4">
            Produits en Vedette
          </h2>
          <p className="font-montserrat text-gray-600 max-w-2xl mx-auto text-lg">
            Découvrez notre sélection exclusive de produits de beauté pour femmes africaines : 
            soins capillaires, ongles, perruques et tissages de qualité exceptionnelle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-rose-pale/30 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.isNew && (
                    <span className="bg-rose-vif text-white px-3 py-1 rounded-full text-xs font-montserrat font-semibold">
                      Nouveau
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-vif hover:text-white">
                  <Heart className="w-5 h-5" />
                </button>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={() => onNavigate('product')}
                    className="bg-white text-gray-800 px-6 py-2 rounded-full font-montserrat font-semibold hover:bg-rose-pale transition-colors duration-300"
                  >
                    Aperçu rapide
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
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
                  <span className="text-sm text-gray-600 font-montserrat ml-2">
                    ({product.rating})
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="font-montserrat font-semibold text-gray-800 mb-3 text-lg group-hover:text-rose-vif transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-montserrat font-bold text-2xl text-rose-vif">
                    {product.price.toLocaleString()} FCFA
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={() => onNavigate('cart')}
                  className="w-full bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Ajouter au panier</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => onNavigate('catalog')}
            className="bg-transparent border-2 border-rose-vif text-rose-vif font-montserrat font-semibold px-8 py-3 rounded-full hover:bg-rose-vif hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Voir tous les produits
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;