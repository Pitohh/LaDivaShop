import { Search, User, ShoppingBag } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div className="flex-1 md:flex-none">
          <h1
            className="text-xl sm:text-2xl lg:text-3xl tracking-wider text-[#D63384]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            LA DIVA
          </h1>
        </div>

        {/* Navigation Desktop - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
          <a
            href="#"
            className="text-[#D63384] hover:text-[#064E3B] transition-colors text-sm lg:text-base"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Nouveautés
          </a>
          <a
            href="#"
            className="text-[#D63384] hover:text-[#064E3B] transition-colors text-sm lg:text-base"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Perruques
          </a>
          <a
            href="#"
            className="text-[#D63384] hover:text-[#064E3B] transition-colors text-sm lg:text-base"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Mèches
          </a>
          <a
            href="#"
            className="text-[#D63384] hover:text-[#064E3B] transition-colors text-sm lg:text-base"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Soins
          </a>
        </nav>

        {/* Actions - La Trinité */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1 md:flex-none justify-end">
          <button className="text-[#D63384] hover:text-[#064E3B] transition-colors hidden md:block p-2" aria-label="Rechercher">
            <Search size={20} className="lg:w-6 lg:h-6" />
          </button>
          <button className="text-[#D63384] hover:text-[#064E3B] transition-colors hidden md:block p-2" aria-label="Mon compte">
            <User size={20} className="lg:w-6 lg:h-6" />
          </button>
          <button className="text-[#D63384] hover:text-[#064E3B] transition-colors relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Panier">
            <ShoppingBag size={20} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            <span className="absolute -top-1 -right-1 sm:top-0 sm:right-0 bg-[#064E3B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
