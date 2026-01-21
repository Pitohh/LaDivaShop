import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Sparkles, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-secondary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-black/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div
              className="flex items-center space-x-2 mb-6 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <Sparkles className="text-primary w-8 h-8" />
              <h3 className="font-heading text-4xl text-primary">
                La Diva Shop
              </h3>
            </div>
            <p className="font-body text-white/80 mb-6 leading-relaxed max-w-md">
              Votre destination privilégiée pour des produits de beauté d'exception au Gabon.
              Spécialisés dans les soins capillaires, ongles, perruques et tissages pour femmes africaines.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/90">
                <Phone className="w-5 h-5 text-primary" />
                <span className="font-body">+241 74 42 10 60</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-body">contact@ladivashop.ga</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-body">834 LBV, Libreville, Gabon</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-body">Ouvert • Ferme à 19h</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6 text-lg">
              Liens Rapides
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="font-body text-white/80 hover:text-primary transition-colors duration-300 text-left"
                >
                  Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cart')}
                  className="font-body text-white/80 hover:text-primary transition-colors duration-300 text-left"
                >
                  Mon Panier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('account')}
                  className="font-body text-white/80 hover:text-primary transition-colors duration-300 text-left"
                >
                  Mon Compte
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="font-body text-white/80 hover:text-primary transition-colors duration-300 text-left"
                >
                  Connexion
                </button>
              </li>
              <li>
                <a href="#" className="font-body text-white/80 hover:text-primary transition-colors duration-300">
                  Livraison & Retours
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6 text-lg">
              Newsletter
            </h4>
            <p className="font-body text-white/80 mb-4 text-sm">
              Recevez nos dernières offres et nouveautés directement dans votre boîte mail.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="font-body px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="btn-primary">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="font-body text-white/80 mr-2">Suivez-nous :</span>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-all duration-300 transform hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-all duration-300 transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-all duration-300 transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-all duration-300 transform hover:scale-110">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="font-body text-white/70 text-sm">
              © 2024 La Diva Shop. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;