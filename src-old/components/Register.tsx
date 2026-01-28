import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Lock, Mail, User, ArrowRight, Heart, Phone } from 'lucide-react';
import { authService } from '../services/auth.service';

interface RegisterProps {
    onNavigate: (page: string) => void;
    onLogin: (isLoggedIn: boolean) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authService.register(formData);
            onLogin(true);
            onNavigate('account');
        } catch (error) {
            console.error('Registration error:', error);
            alert('Échec de la création de compte. Le numéro est peut-être déjà utilisé.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* ... keeping background ... */}
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1920"
                    alt="Salon La Diva - Ambiance luxueuse"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-rose-pale/80 via-rose-poudre/60 to-rose-pale/90 backdrop-blur-sm"></div>
            </div>

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
                            Créer un compte
                        </h2>
                        <p className="font-montserrat text-gray-700">
                            Rejoignez notre communauté beauté
                        </p>
                    </div>

                    {/* Register Form */}
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-rose-pale/50 p-8 animate-slide-up">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block font-montserrat font-semibold text-gray-700 text-sm">Prénom</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-vif w-4 h-4" />
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full pl-10 pr-3 py-3 border-2 border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat text-gray-800 bg-white/90"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-montserrat font-semibold text-gray-700 text-sm">Nom</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-vif w-4 h-4" />
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full pl-10 pr-3 py-3 border-2 border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat text-gray-800 bg-white/90"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block font-montserrat font-semibold text-gray-700">Numéro de téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-vif w-5 h-5" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-rose-pale rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat text-gray-800 bg-white/90"
                                        placeholder="07000000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block font-montserrat font-semibold text-gray-700">
                                    Email <span className="text-gray-400 font-normal text-sm md:inline block">(Optionnel)</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-vif w-5 h-5" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-rose-pale rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat text-gray-800 bg-white/90"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block font-montserrat font-semibold text-gray-700">Mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-vif w-5 h-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-12 py-4 border-2 border-rose-pale rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat text-gray-800 bg-white/90"
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

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full font-montserrat font-bold py-4 rounded-2xl transition-all duration-300 transform flex items-center justify-center space-x-2 mt-6 ${isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-vert-emeraude to-vert-emeraude/80 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Création du compte...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>S'inscrire</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="relative mt-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-rose-pale/50"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white/95 font-montserrat text-gray-500">
                                        Déjà client ?
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onNavigate('login')}
                                className="w-full bg-transparent border-2 border-rose-pale text-rose-vif font-montserrat font-semibold py-4 rounded-2xl hover:bg-rose-pale hover:border-rose-vif transition-all duration-300 transform hover:scale-105 active:scale-95 mt-4"
                            >
                                Se connecter
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
