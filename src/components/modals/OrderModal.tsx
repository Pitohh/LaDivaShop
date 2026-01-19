import React, { useState, useEffect } from 'react';
import { X, Package, CreditCard, Truck, User, MapPin } from 'lucide-react';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (orderId: string, status: string, paymentStatus: string) => Promise<void>;
    order: any;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSave, order }) => {
    const [status, setStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (order) {
            setStatus(order.status || 'pending');
            setPaymentStatus(order.payment || 'pending');
        }
    }, [order, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(order.rawId || order.id, status, paymentStatus);
            onClose();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Erreur lors de la mise à jour de la commande');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-rose-pale/30 bg-rose-pale/10">
                    <div>
                        <h2 className="font-montserrat font-bold text-xl text-gray-800">
                            Commande #{order.interactionId || order.id.substring(0, 8).toUpperCase()}
                        </h2>
                        <p className="text-sm font-montserrat text-gray-600">
                            {new Date(order.date || Date.now()).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="font-montserrat font-semibold text-gray-800 mb-3 flex items-center">
                            <User className="w-4 h-4 mr-2 text-rose-vif" />
                            Information Client
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-montserrat">
                            <div>
                                <span className="text-gray-500 block">Nom complet</span>
                                <span className="font-medium text-gray-800">{order.customer}</span>
                            </div>
                            <div>
                                {/* Address if available, otherwise generic */}
                                <span className="text-gray-500 block">Adresse de livraison</span>
                                <span className="font-medium text-gray-800">Libreville, Gabon</span>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="font-montserrat font-semibold text-gray-800 mb-3 flex items-center">
                            <Package className="w-4 h-4 mr-2 text-vert-emeraude" />
                            Articles ({order.items})
                        </h3>
                        <div className="bg-white border border-rose-pale/30 rounded-xl overflow-hidden">
                            {/* Simplified item view since we might just have count in the summary object passing in */}
                            <div className="p-4 text-center text-gray-500 italic font-montserrat text-sm">
                                Voir détails complets dans la base de données (Liste des articles)
                            </div>
                        </div>
                    </div>

                    {/* Status Management */}
                    <form id="orderForm" onSubmit={handleSubmit} className="border-t border-rose-pale/30 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-montserrat font-semibold text-gray-700 text-sm mb-2 flex items-center">
                                    <Truck className="w-4 h-4 mr-2 text-blue-500" />
                                    Statut Livraison
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif font-montserrat bg-white"
                                >
                                    <option value="pending">En attente</option>
                                    <option value="confirmed">Confirmée</option>
                                    <option value="processing">En cours de préparation</option>
                                    <option value="shipped">Expédiée</option>
                                    <option value="delivered">Livrée</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-montserrat font-semibold text-gray-700 text-sm mb-2 flex items-center">
                                    <CreditCard className="w-4 h-4 mr-2 text-dore" />
                                    Statut Paiement
                                </label>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className="w-full px-4 py-3 border border-rose-pale rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-vif font-montserrat bg-white"
                                >
                                    <option value="pending">En attente</option>
                                    <option value="completed">Payé (Completed)</option>
                                    <option value="failed">Échoué</option>
                                    <option value="refunded">Remboursé</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-rose-pale/30 bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-montserrat font-semibold hover:bg-white transition-colors"
                    >
                        Fermer
                    </button>
                    <button
                        type="submit"
                        form="orderForm"
                        disabled={isLoading}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-dore to-dore-fonce text-white font-montserrat font-semibold hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
