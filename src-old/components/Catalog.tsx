import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Star, Heart, ShoppingCart, ArrowLeft, ChevronRight } from 'lucide-react';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';

interface CatalogProps {
  onNavigate: (page: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState('name');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState(['Tous']);
  const [products, setProducts] = useState<any[]>([]);
  const [displayedCount, setDisplayedCount] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, productsData] = await Promise.all([
          categoriesService.getAll(),
          productsService.getAll()
        ]);
        setCategories(['Tous', ...categoriesData.map(c => c.name)]);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterProducts = async () => {
      try {
        const filtered = await productsService.getAll({
          search: searchTerm,
          category: selectedCategory !== 'Tous' ? selectedCategory : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1]
        });
        setProducts(filtered);
      } catch (error) {
        console.error('Error filtering products:', error);
      }
    };

    filterProducts();
  }, [searchTerm, selectedCategory, priceRange]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const currentProducts = sortedProducts.slice(0, displayedCount);
  const hasMore = displayedCount < sortedProducts.length;

  const loadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 12, sortedProducts.length));
  };

  // Filters Component
  const FilterContent = () => (
    <>
      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-heading font-semibold text-white mb-4">Catégories</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="w-4 h-4 rounded border-2 border-white/30 bg-white/10 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/50"
              />
              <span className="font-body text-white/90 group-hover:text-white transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-heading font-semibold text-white mb-4">Prix (FCFA)</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-white/80 text-sm">
            <span>0</span>
            <span>200.000+</span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full accent-primary"
          />
          <div className="text-center text-sm bg-white/10 rounded-lg py-2 text-white">
            Jusqu'à {priceRange[1].toLocaleString()} FCFA
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-heading font-semibold text-white mb-4">Trier par</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white font-body focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="name">Nom A-Z</option>
          <option value="price-low">Prix croissant</option>
          <option value="price-high">Prix décroissant</option>
          <option value="rating">Mieux notés</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-background-pale py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm font-body">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-secondary font-semibold">Catalogue</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-primary/10 to-background-pale py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom ou catégorie (ex: Vernis, Perruques, Soins...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-primary/20 focus:border-primary focus:outline-none font-body text-secondary placeholder-gray-400 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 btn-primary flex items-center space-x-2 shadow-2xl"
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </button>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
              {/* Drawer */}
              <div className="fixed left-0 top-0 bottom-0 w-80 bg-secondary z-50 overflow-y-auto lg:hidden p-6 transform transition-transform">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-2xl text-white">Filtres</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-white hover:text-primary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-secondary rounded-2xl p-6 text-white sticky top-8">
              <h3 className="font-heading font-bold text-xl mb-6 flex items-center text-white">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </h3>
              <FilterContent />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading text-4xl text-secondary mb-2">
                  Notre Catalogue
                </h2>
                <p className="font-body text-gray-600">
                  {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Products */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden watermarked">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {product.isNew && (
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-body font-semibold">
                          Nouveau
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-body font-semibold">
                          Rupture
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating)
                              ? 'text-primary fill-current'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 font-body ml-2">
                        ({product.rating})
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-body font-semibold text-secondary mb-3 text-lg group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-heading font-bold text-2xl text-primary">
                        {product.price.toLocaleString()} FCFA
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => onNavigate('product')}
                        className="flex-1 bg-secondary text-white font-body font-semibold py-3 rounded-xl hover:bg-secondary-dark transition-all duration-300 transform hover:scale-105"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => onNavigate('cart')}
                        disabled={product.stock === 0}
                        className={`flex-1 font-body font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${product.stock > 0
                            ? 'bg-primary text-white hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{product.stock > 0 ? 'Ajouter' : 'Indisponible'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMore}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Charger plus</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Loading Animation */}
            {isLoading && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;