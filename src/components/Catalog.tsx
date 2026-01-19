import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronDown, Star, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState(['Tous']);
  const [products, setProducts] = useState<any[]>([]);


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

  const filteredProducts = products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  const productsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);



  return (
    <div className="min-h-screen bg-white">
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
            <span className="text-rose-vif font-semibold">Catalogue</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-rose-pale to-rose-poudre/50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-vif w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom ou catégorie (ex: Vernis, Perruques, Soins...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-rose-poudre focus:border-rose-vif focus:outline-none font-montserrat text-gray-700 placeholder-rose-vif/70 bg-white/90 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-gradient-to-br from-rose-vif to-rose-poudre rounded-2xl p-6 text-white sticky top-8">
              <h3 className="font-montserrat font-bold text-xl mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-montserrat font-semibold mb-4">Catégories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg font-montserrat transition-all duration-300 ${selectedCategory === category
                        ? 'bg-white text-rose-vif font-semibold'
                        : 'hover:bg-white/20'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-montserrat font-semibold mb-4">Prix (FCFA)</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">0</span>
                    <span className="text-sm">200.000+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-dore"
                  />
                  <div className="text-center text-sm bg-white/20 rounded-lg py-2">
                    Jusqu'à {priceRange[1].toLocaleString()} FCFA
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-montserrat font-semibold mb-4">Trier par</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white text-rose-vif font-montserrat focus:outline-none"
                >
                  <option value="name">Nom A-Z</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-rose-vif text-white font-montserrat font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="mt-4 bg-rose-vif rounded-xl p-4 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-montserrat font-semibold mb-2">Catégorie</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white text-rose-vif font-montserrat"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-montserrat font-semibold mb-2">Prix max</label>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-dore"
                    />
                    <div className="text-xs text-center mt-1">{priceRange[1].toLocaleString()} FCFA</div>
                  </div>
                  <div>
                    <label className="block font-montserrat font-semibold mb-2">Trier par</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white text-rose-vif font-montserrat"
                    >
                      <option value="name">Nom A-Z</option>
                      <option value="price-low">Prix croissant</option>
                      <option value="price-high">Prix décroissant</option>
                      <option value="rating">Mieux notés</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-great-vibes text-4xl text-vert-emeraude mb-2">
                  Notre Catalogue
                </h2>
                <p className="font-montserrat text-gray-600">
                  {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-rose-vif text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-rose-vif text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            <div className={`grid gap-6 ${viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1'
              }`}>
              {currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-rose-pale/30 overflow-hidden animate-slide-up ${viewMode === 'list' ? 'flex' : ''
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Product Image */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                      alt={product.name}
                      className={`object-cover group-hover:scale-110 transition-transform duration-500 ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                        }`}
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {product.isNew && (
                        <span className="bg-rose-vif text-white px-3 py-1 rounded-full text-xs font-montserrat font-semibold">
                          Nouveau
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-montserrat font-semibold">
                          Rupture
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-vif hover:text-white">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1">
                    {/* Stock status */}
                    {product.stock === 0 && (
                      <span className="inline-block bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-montserrat font-semibold mb-3">
                        Rupture de stock
                      </span>
                    )}

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating)
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
                      <span className="font-montserrat font-bold text-2xl text-dore">
                        {product.price.toLocaleString()} FCFA
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className={`flex gap-3 ${viewMode === 'list' ? 'flex-col' : ''}`}>
                      <button
                        onClick={() => onNavigate('product')}
                        className="flex-1 bg-vert-emeraude text-white font-montserrat font-semibold py-3 rounded-xl hover:bg-vert-emeraude/90 transition-all duration-300 transform hover:scale-105"
                      >
                        Voir le produit
                      </button>
                      <button
                        onClick={() => onNavigate('cart')}
                        disabled={product.stock === 0}
                        className={`flex-1 font-montserrat font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${product.stock > 0
                          ? 'bg-gradient-to-r from-dore to-dore-fonce text-white hover:shadow-lg'
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full font-montserrat font-semibold transition-all duration-300 ${currentPage === i + 1
                        ? 'bg-gradient-to-r from-dore to-dore-fonce text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-rose-pale'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Animation */}
            {isLoading && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dore"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;