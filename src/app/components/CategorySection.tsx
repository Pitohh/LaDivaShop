import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ChevronRight } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    category?: string;
}

interface CategorySectionProps {
    category: 'wigs' | 'nails' | 'care';
    title: string;
    subtitle: string;
    description: string;
    onNavigate?: (page: string, data?: any) => void;
}

export function CategorySection({
    category,
    title,
    subtitle,
    description,
    onNavigate
}: CategorySectionProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategoryProducts() {
            try {
                const response = await fetch(`/api/products?category=${category}&limit=8`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error(`Error fetching ${category} products:`, error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategoryProducts();
    }, [category]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price) + ' FCFA';
    };

    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            if (typeof product.images[0] === 'string') {
                return product.images[0];
            }
        }
        return 'https://images.unsplash.com/photo-1713845784494-33f5d1f96d25?w=400&q=80';
    };

    if (loading) {
        return (
            <section className="w-full bg-white py-10 sm:py-12 md:py-14 lg:py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-64 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null; // Don't show section if no products
    }

    return (
        <section className="w-full bg-white py-10 sm:py-12 md:py-14 lg:py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header - Luxury Wording */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
                    <p
                        className="text-[#064E3B] text-xs sm:text-sm uppercase tracking-wider mb-2"
                        style={{ fontFamily: 'var(--font-sans)' }}
                    >
                        {subtitle}
                    </p>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl text-[#D63384] mb-4"
                        style={{ fontFamily: 'var(--font-serif)' }}
                    >
                        {title}
                    </h2>
                    <p
                        className="text-[#D63384]/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
                        style={{ fontFamily: 'var(--font-sans)' }}
                    >
                        {description}
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-[#F9FAFB] rounded-sm overflow-hidden group cursor-pointer"
                            onClick={() => onNavigate?.('product', { productId: product.id })}
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <ImageWithFallback
                                    src={getProductImage(product)}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
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
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <button
                        onClick={() => onNavigate?.('catalog', { category: category })}
                        className="inline-flex items-center gap-2 bg-[#064E3B] text-white px-8 py-3 rounded-sm hover:bg-[#064E3B]/90 transition-colors font-medium"
                        style={{ fontFamily: 'var(--font-sans)' }}
                    >
                        Voir toute la collection
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
