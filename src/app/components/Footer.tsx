import { Instagram, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string, data?: any) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full bg-[#D63384] text-white py-10 sm:py-12 lg:py-14 px-4 pb-20 sm:pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Brand */}
          <div>
            <h3
              className="text-xl sm:text-2xl mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              LA DIVA
            </h3>
            <p
              className="text-white/70 text-xs sm:text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Votre destination beauté premium au Gabon
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="mb-3 sm:mb-4 text-sm sm:text-base font-medium"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Boutique
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li><button onClick={() => onNavigate?.('catalog', { category: null })} className="hover:text-white transition-colors">Just Dropped ✨</button></li>
              <li><button onClick={() => onNavigate?.('catalog', { category: 'Perruques' })} className="hover:text-white transition-colors">Perruques</button></li>
              <li><button onClick={() => onNavigate?.('catalog', { category: 'Onglerie' })} className="hover:text-white transition-colors">Ongles</button></li>
              <li><button onClick={() => onNavigate?.('catalog', { category: 'Soins des Cheveux' })} className="hover:text-white transition-colors">Soins Capillaires</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="mb-3 sm:mb-4 text-sm sm:text-base font-medium"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Assistance
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Livraison</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Retours</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guide des Tailles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="mb-3 sm:mb-4 text-sm sm:text-base font-medium"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Newsletter
            </h4>
            <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
              Restez informée des nouveautés
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                aria-label="Email pour la newsletter"
                className="flex-1 bg-white/10 border border-white/20 rounded-sm px-2 sm:px-3 py-2 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
              />
              <button
                className="bg-[#064E3B] text-white px-3 sm:px-4 py-2 rounded-sm hover:bg-[#064E3B]/90 transition-colors flex items-center justify-center"
                aria-label="S'inscrire à la newsletter"
              >
                <Mail size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-white/60 text-xs sm:text-sm"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            © 2026 La Diva. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 sm:gap-5">
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors p-2"
              aria-label="Instagram"
            >
              <Instagram size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors p-2"
              aria-label="Facebook"
            >
              <Facebook size={18} className="sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
