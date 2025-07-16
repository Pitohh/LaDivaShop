import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Sparkles, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gradient-to-br from-rose-pale to-rose-poudre/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-chandelier-pattern opacity-20"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div 
              className="flex items-center space-x-2 mb-6 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <Sparkles className="text-rose-vif w-8 h-8" />
              <h3 className="font-great-vibes text-4xl text-rose-vif">
                La Boutique
              </h3>
            </div>
            <p className="font-montserrat text-gray-700 mb-6 leading-relaxed max-w-md">
              Votre destination privilégiée pour des produits de beauté d'exception au Gabon. 
              Spécialisés dans les soins capillaires, ongles, perruques et tissages pour femmes africaines.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-700">
                <Phone className="w-5 h-5 text-rose-vif" />
                <span className="font-montserrat">+241 74 42 10 60</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="w-5 h-5 text-rose-vif" />
                <span className="font-montserrat">contact@laboutique.ga</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <MapPin className="w-5 h-5 text-rose-vif" />
                <span className="font-montserrat">834 LBV, Libreville, Gabon</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Clock className="w-5 h-5 text-rose-vif" />
                <span className="font-montserrat">Ouvert • Ferme à 19h</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-semibold text-gray-800 mb-6 text-lg">
              Liens Rapides
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('catalog')}
                  className="font-montserrat text-rose-vif hover:text-rose-vif/80 transition-colors duration-300 text-left"
                >
                  Catalogue
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('cart')}
                  className="font-montserrat text-rose-vif hover:text-rose-vif/80 transition-colors duration-300 text-left"
                >
                  Mon Panier
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('account')}
                  className="font-montserrat text-rose-vif hover:text-rose-vif/80 transition-colors duration-300 text-left"
                >
                  Mon Compte
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('login')}
                  className="font-montserrat text-rose-vif hover:text-rose-vif/80 transition-colors duration-300 text-left"
                >
                  Connexion
                </button>
              </li>
              <li>
                <a href="#" className="font-montserrat text-rose-vif hover:text-rose-vif/80 transition-colors duration-300">
                  Livraison & Retours
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-montserrat font-semibold text-gray-800 mb-6 text-lg">
              Newsletter
            </h4>
            <p className="font-montserrat text-gray-700 mb-4 text-sm">
              Recevez nos dernières offres et nouveautés directement dans votre boîte mail.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="font-montserrat px-4 py-3 rounded-xl border border-rose-poudre focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-rose-poudre/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="font-montserrat text-gray-700 mr-2">Suivez-nous :</span>
              <a href="#" className="w-10 h-10 bg-dore rounded-full flex items-center justify-center text-white hover:bg-dore-fonce transition-colors duration-300 transform hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-dore rounded-full flex items-center justify-center text-white hover:bg-dore-fonce transition-colors duration-300 transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-dore rounded-full flex items-center justify-center text-white hover:bg-dore-fonce transition-colors duration-300 transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-dore rounded-full flex items-center justify-center text-white hover:bg-dore-fonce transition-colors duration-300 transform hover:scale-110">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="font-montserrat text-gray-600 text-sm">
              © 2024 La Boutique Gabon. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;