import { Home, Search, ShoppingBag, User } from 'lucide-react';

interface BottomNavProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function BottomNav({ onNavigate, currentPage = 'home' }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 sm:px-4 py-2 sm:py-3">
        <button
          onClick={() => onNavigate?.('home')}
          className={`flex flex-col items-center gap-0.5 sm:gap-1 ${currentPage === 'home' ? 'text-[#D63384]' : 'text-[#D63384]/60'} active:text-[#064E3B] min-w-[60px] min-h-[52px] justify-center transition-colors`}
          aria-label="Accueil"
        >
          <Home size={22} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
            Accueil
          </span>
        </button>

        <button
          onClick={() => onNavigate?.('catalog')}
          className={`flex flex-col items-center gap-0.5 sm:gap-1 ${currentPage === 'catalog' ? 'text-[#D63384]' : 'text-[#D63384]/60'} active:text-[#064E3B] min-w-[60px] min-h-[52px] justify-center transition-colors`}
          aria-label="Rechercher"
        >
          <Search size={22} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
            Recherche
          </span>
        </button>

        <button
          onClick={() => onNavigate?.('cart')}
          className={`flex flex-col items-center gap-0.5 sm:gap-1 ${currentPage === 'cart' ? 'text-[#D63384]' : 'text-[#D63384]/60'} active:text-[#064E3B] relative min-w-[60px] min-h-[52px] justify-center transition-colors`}
          aria-label="Panier"
        >
          <div className="relative">
            <ShoppingBag size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
            <span className="absolute -top-2 -right-2 bg-[#064E3B] text-white text-[10px] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
              0
            </span>
          </div>
          <span className="text-[10px] sm:text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
            Panier
          </span>
        </button>

        <button
          onClick={() => onNavigate?.('account')}
          className={`flex flex-col items-center gap-0.5 sm:gap-1 ${currentPage === 'account' ? 'text-[#D63384]' : 'text-[#D63384]/60'} active:text-[#064E3B] min-w-[60px] min-h-[52px] justify-center transition-colors`}
          aria-label="Mon compte"
        >
          <User size={22} className="sm:w-6 sm:h-6" />
          <span className="text-[10px] sm:text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
            Compte
          </span>
        </button>
      </div>
    </nav>
  );
}
