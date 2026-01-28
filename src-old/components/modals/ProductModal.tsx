import React, { useState, useEffect } from 'react';
import { X, Upload, Check } from 'lucide-react';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: any) => Promise<void>;
    product?: any; // If present, we are editing
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Soins Capillaires', // Default
        description: '',
        image: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category || 'Soins Capillaires',
                description: product.description || '',
                image: product.image || ''
            });
        } else {
            // Reset for new product
            setFormData({
                name: '',
                price: '',
                stock: '',
                category: 'Soins Capillaires',
                description: '',
                image: ''
            });
        }
    }, [product, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Format data: ensure numbers are numbers
            const dataToSave = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                // For now, we hardcode images array as backend expects array
                images: formData.image ? [formData.image] : []
            };
            await onSave(dataToSave);
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erreur lors de la sauvegarde du produit');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-rose-pale/30 bg-rose-pale/10">
                    <h2 className="font-montserrat font-bold text-xl text-gray-800">
                        {product ? 'Modifier le produit' : 'Nouveau produit'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block font-montserrat font-semibold text-gray-700 text-sm mb-1">
                            Nom du produit
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif font-montserrat"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-montserrat font-semibold text-gray-700 text-sm mb-1">
                                Prix (FCFA)
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif font-montserrat"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block font-montserrat font-semibold text-gray-700 text-sm mb-1">
                                Stock
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif font-montserrat"
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-montserrat font-semibold text-gray-700 text-sm mb-1">
                            Catégorie
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif font-montserrat bg-white"
                        >
                            <option value="Soins Capillaires">Soins Capillaires</option>
                            <option value="Vernis à Ongles">Vernis à Ongles</option>
                            <option value="Perruques">Perruques</option>
                            <option value="Tissages">Tissages</option>
                            <option value="Accessoires">Accessoires</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-montserrat font-semibold text-gray-700 text-sm mb-1">
                            URL Image
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="flex-1 px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif font-montserrat"
                                placeholder="https://..."
                            />
                        </div>
                        {formData.image && (
                            <div className="mt-2 text-xs text-green-600 flex items-center">
                                <Check className="w-3 h-3 mr-1" /> Image prévisualisée
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-montserrat font-semibold text-gray-700 text-sm mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif font-montserrat h-24 resize-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-montserrat font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-vert-emeraude to-vert-emeraude/90 text-white font-montserrat font-semibold hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
