import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            <Sparkles className="text-rose-vif w-8 h-8" />
            <h1 className="font-great-vibes text-4xl text-rose-vif">
              La Boutique
            </h1>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('home')}
              className={`font-montserrat transition-colors duration-300 font-medium ${
                currentPage === 'home' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
              }`}
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNavigation('catalog')}
              className={`font-montserrat transition-colors duration-300 font-medium ${
                currentPage === 'catalog' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
              }`}
            >
              Catalogue
            </button>
            <button 
              onClick={() => handleNavigation('cart')}
              className={`font-montserrat transition-colors duration-300 font-medium flex items-center space-x-1 ${
                currentPage === 'cart' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Panier</span>
            </button>
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => handleNavigation('account')}
                  className={`font-montserrat transition-colors duration-300 font-medium flex items-center space-x-1 ${
                    currentPage === 'account' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Mon Compte</span>
                </button>
                <button 
                  onClick={() => handleNavigation('admin')}
                  className={`font-montserrat transition-colors duration-300 font-medium flex items-center space-x-1 ${
                    currentPage === 'admin' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleNavigation('login')}
                className={`font-montserrat transition-colors duration-300 font-medium flex items-center space-x-1 ${
                  currentPage === 'login' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Connexion</span>
              </button>
            )}
          </nav>

          {/* Menu Mobile */}
          <button
            className="md:hidden text-rose-vif"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-rose-pale">
            <nav className="flex flex-col space-y-4 pt-4">
              <button 
                onClick={() => handleNavigation('home')}
                className={`font-montserrat transition-colors duration-300 font-medium text-left ${
                  currentPage === 'home' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                }`}
              >
                Accueil
              </button>
              <button 
                onClick={() => handleNavigation('catalog')}
                className={`font-montserrat transition-colors duration-300 font-medium text-left ${
                  currentPage === 'catalog' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                }`}
              >
                Catalogue
              </button>
              <button 
                onClick={() => handleNavigation('cart')}
                className={`font-montserrat transition-colors duration-300 font-medium flex items-center space-x-1 ${
                  currentPage === 'cart' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Panier</span>
              </button>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => handleNavigation('account')}
                    className={`font-montserrat transition-colors duration-300 font-medium flex items-center space-x-1 ${
                      currentPage === 'account' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Mon Compte</span>
                  </button>
                  <button 
                    onClick={() => handleNavigation('admin')}
                    className={`font-montserrat transition-colors duration-300 font-medium flex items-center space-x-1 ${
                      currentPage === 'admin' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleNavigation('login')}
                  className={`font-montserrat transition-colors duration-300 font-medium flex items-center space-x-1 ${
                    currentPage === 'login' ? 'text-rose-vif' : 'text-rose-poudre hover:text-rose-vif'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Connexion</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;