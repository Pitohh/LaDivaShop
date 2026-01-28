import { useState } from 'react';
import { TopBar } from '@/app/components/TopBar';
import { Header } from '@/app/components/Header';
import { HeroSection } from '@/app/components/HeroSection';
import { NewDrops } from '@/app/components/NewDrops';
import { CategorySection } from '@/app/components/CategorySection';
import { Footer } from '@/app/components/Footer';
import { BottomNav } from '@/app/components/BottomNav';
import content from '@/data/content.json';

// Import old components for hybrid strategy (from src-old backup)
import Catalog from '../../src-old/components/Catalog';
import ProductDetail from '../../src-old/components/ProductDetail';
import Cart from '../../src-old/components/Cart';
import Login from '../../src-old/components/Login';
import Register from '../../src-old/components/Register';
import Account from '../../src-old/components/Account';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);

    if (page === 'product' && data?.productId) {
      setSelectedProduct(data.productId);
    }

    if (page === 'catalog' && data?.category) {
      setSelectedCategory(data.category);
    } else if (page === 'catalog') {
      setSelectedCategory(null);
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            {/* Hero Section - Grand Visuel */}
            <HeroSection
              imageUrl="https://images.unsplash.com/photo-1508174492734-7cce2629cadc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjBibGFjayUyMHdvbWFuJTIwaGFpcnxlbnwxfHx8fDE3NjkwMDI0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              onNavigate={handleNavigate}
            />

            {/* Section 1: Just Dropped - Les Inédits (API ?new=true) */}
            <NewDrops onNavigate={handleNavigate} />

            {/* Séparateur Visuel */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D63384]/20 to-transparent"></div>

            {/* Section 2: L'Art Capillaire (wigs) */}
            <CategorySection
              category="wigs"
              title={content.home.sections.wigs.title}
              subtitle={content.home.sections.wigs.subtitle}
              description={content.home.sections.wigs.description}
              onNavigate={handleNavigate}
            />

            {/* Section 3: Signature des Mains (nails) */}
            <CategorySection
              category="nails"
              title={content.home.sections.nails.title}
              subtitle={content.home.sections.nails.subtitle}
              description={content.home.sections.nails.description}
              onNavigate={handleNavigate}
            />

            {/* Section 4: Rituels de Soin (care) */}
            <CategorySection
              category="care"
              title={content.home.sections.care.title}
              subtitle={content.home.sections.care.subtitle}
              description={content.home.sections.care.description}
              onNavigate={handleNavigate}
            />
          </>
        );

      case 'catalog':
        return <Catalog setCurrentPage={setCurrentPage} selectedCategory={selectedCategory} />;

      case 'product':
        return <ProductDetail setCurrentPage={setCurrentPage} productId={selectedProduct} />;

      case 'cart':
        return <Cart setCurrentPage={setCurrentPage} />;

      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;

      case 'register':
        return <Register setCurrentPage={setCurrentPage} />;

      case 'account':
        return <Account setCurrentPage={setCurrentPage} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Top Bar - Promo */}
      <TopBar />

      {/* Header - Navigation */}
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Main Content - Dynamic based on currentPage */}
      {renderPage()}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav onNavigate={handleNavigate} currentPage={currentPage} />
    </div>
  );
}