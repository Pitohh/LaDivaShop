import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Plus } from 'lucide-react';
import content from '@/data/content.json';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  isNew?: boolean;
}

interface NewDropsProps {
  onNavigate?: (page: string, data?: any) => void;
}

export function NewDrops({ onNavigate }: NewDropsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewProducts() {
      try {
        const response = await fetch('/api/products?new=true&limit=8');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching new products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' FCFA';
  };

  const getProductImage = (product: Product) => {
    // Try to get first image from images array
    if (product.images && product.images.length > 0) {
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
    }
    // Fallback
    return 'https://images.unsplash.com/photo-1713845784494-33f5d1f96d25?w=400&q=80';
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-10 sm:py-12 md:py-14 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no new products
  }

  return (
    <section className="w-full bg-white py-10 sm:py-12 md:py-14 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title - Style Fenty */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#D63384] mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {content.home.sections.new_drops.title}
          </h2>
          <p
            className="text-[#D63384]/70 text-sm sm:text-base"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {content.home.sections.new_drops.subtitle}
          </p>
        </div>

        {/* Products Grid - Mobile scroll, Tablet 3 cols, Desktop 4 cols */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 md:grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-4 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[70vw] sm:w-[60vw] md:w-auto snap-start"
            >
              <div
                className="bg-[#F9FAFB] rounded-sm overflow-hidden group cursor-pointer h-full"
                onClick={() => onNavigate?.('product', { productId: product.id })}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <ImageWithFallback
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#064E3B] text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-sm font-medium">
                      NOUVEAU
                    </span>
                  )}
                  {/* Quick Add Button */}
                  <button
                    className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-white text-[#D63384] rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-[#064E3B] hover:text-white"
                    aria-label="Ajouter au panier"
                    onClick={() => {
                      // TODO: Add to cart functionality
                      console.log('Add to cart:', product.id);
                    }}
                  >
                    <Plus size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <h3
                    className="text-[#D63384] mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base font-medium"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-[#064E3B] text-sm sm:text-base font-semibold"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
