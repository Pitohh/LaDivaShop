import React from 'react';
import { ArrowRight, Crown } from 'lucide-react';

interface HeroBannerProps {
  onNavigate: (page: string) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-[70vh] bg-gradient-to-br from-rose-pale via-white to-rose-pale overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-chandelier-pattern opacity-30"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-dore opacity-20 animate-float">
        <Crown className="w-16 h-16" />
      </div>
      <div className="absolute bottom-20 right-10 text-dore opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <Crown className="w-12 h-12" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h2 className="font-great-vibes text-6xl md:text-7xl text-vert-emeraude mb-6 leading-tight">
              Bienvenue dans
              <span className="block text-rose-vif">notre boutique</span>
            </h2>
            <p className="font-montserrat text-lg text-gray-700 mb-8 leading-relaxed max-w-lg">
              Découvrez notre collection exclusive de produits de beauté pour femmes africaines : 
              soins capillaires, ongles, perruques et tissages de qualité premium.
            </p>
            <button 
              onClick={() => onNavigate('catalog')}
              className="group bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto lg:mx-0"
            >
              <span>Découvrir nos produits</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Femme africaine élégante - Salon de beauté"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-vif to-rose-poudre rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-montserrat font-semibold text-gray-800">Qualité Premium</p>
                  <p className="font-montserrat text-sm text-gray-600">Produits certifiés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;