import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Lock, Mail, ArrowRight, Heart } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
  onLogin: (isLoggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      onLogin(true);
      onNavigate('account');
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Salon La Diva - Ambiance luxueuse"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-pale/80 via-rose-poudre/60 to-rose-pale/90 backdrop-blur-sm"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-dore/30 animate-float">
        <Sparkles className="w-16 h-16" />
      </div>
      <div className="absolute bottom-20 right-10 text-dore/30 animate-float" style={{ animationDelay: '1s' }}>
        <Heart className="w-12 h-12" />
      </div>
      <div className="absolute top-1/3 right-20 text-dore/20 animate-float" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-8 h-8" />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-chandelier-pattern opacity-20"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Welcome */}
          <div className="text-center mb-8 animate-fade-in">
            <div 
              className="flex items-center justify-center space-x-3 mb-6 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <Sparkles className="text-rose-vif w-12 h-12" />
              <h1 className="font-great-vibes text-6xl text-rose-vif">
                La Boutique
              </h1>
            </div>
            <h2 className="font-montserrat text-2xl font-bold text-vert-emeraude mb-2">
              Bienvenue
            </h2>
            <p className="font-montserrat text-gray-700">
              Connectez-vous à votre espace beauté
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-rose-pale/50 p-8 animate-slide-up">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block font-montserrat font-semibold text-gray-700">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-vif w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-rose-pale rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat text-gray-800 placeholder-gray-500 bg-white/90 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block font-montserrat font-semibold text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-vif w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 border-2 border-rose-pale rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat text-gray-800 placeholder-gray-500 bg-white/90 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-rose-vif transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-rose-vif bg-white border-2 border-rose-pale rounded focus:ring-rose-vif focus:ring-2"
                  />
                  <span className="font-montserrat text-sm text-gray-700">
                    Se souvenir de moi
                  </span>
                </label>
                <button
                  type="button"
                  className="font-montserrat text-sm text-dore hover:text-dore-fonce transition-colors font-semibold"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-montserrat font-bold py-4 rounded-2xl transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-rose-pale/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/95 font-montserrat text-gray-500">
                    Nouveau client ?
                  </span>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="button"
                className="w-full bg-transparent border-2 border-rose-pale text-rose-vif font-montserrat font-semibold py-4 rounded-2xl hover:bg-rose-pale hover:border-rose-vif transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Créer un compte
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-rose-pale/30">
              <div className="flex items-center justify-center space-x-6 text-sm font-montserrat text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-vert-emeraude rounded-full"></div>
                  <span>Connexion sécurisée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-dore rounded-full"></div>
                  <span>Données protégées</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="font-montserrat text-sm text-gray-600">
              © 2024 La Boutique Gabon. Salon de beauté de luxe.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Sparkles Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 animate-ping">
          <div className="w-2 h-2 bg-dore rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-3/4 left-3/4 animate-ping" style={{ animationDelay: '1s' }}>
          <div className="w-1 h-1 bg-rose-vif rounded-full opacity-40"></div>
        </div>
        <div className="absolute top-1/2 left-1/6 animate-ping" style={{ animationDelay: '2s' }}>
          <div className="w-1.5 h-1.5 bg-vert-emeraude rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;