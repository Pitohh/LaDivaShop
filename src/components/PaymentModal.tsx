import React, { useState, useEffect } from 'react';
import { X, Smartphone, Check, AlertCircle, Loader2 } from 'lucide-react';
import { paymentsService } from '../services/payments.service';
import { ordersService } from '../services/orders.service';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    orderId?: string; // If proceeding from an existing order
    cartItems?: any[]; // If creating a new order directly
    onSuccess: () => void;
}

type PaymentStep = 'input' | 'processing' | 'waiting' | 'success' | 'error';
type Operator = 'AM' | 'MC';

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    amount,
    orderId,
    cartItems,
    onSuccess
}) => {
    const [step, setStep] = useState<PaymentStep>('input');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [operator, setOperator] = useState<Operator>('AM');
    const [error, setError] = useState<string | null>(null);
    const [fees, setFees] = useState<number | null>(null);

    // Calculate fees when amount or operator changes
    useEffect(() => {
        const calculateFees = async () => {
            try {
                // En attendant l'implémentation réelle des frais côté backend qui retourne le montant exact
                // Simulation simple pour l'UI, ou appel API si disponible
                // const result = await paymentsService.calculateFees(amount, operator);
                // setFees(result.fees);

                // Estimation temporaire (ex: 1%)
                setFees(Math.ceil(amount * 0.01));
            } catch (err) {
                console.error('Error calculating fees', err);
            }
        };

        if (isOpen) {
            calculateFees();
        }
    }, [amount, operator, isOpen]);

    const handlePayment = async () => {
        if (!phoneNumber || phoneNumber.length < 8) {
            setError('Veuillez entrer un numéro de téléphone valide');
            return;
        }

        setStep('processing');
        setError(null);

        try {
            let currentOrderId = orderId;

            // Create order if not exists
            if (!currentOrderId && cartItems) {
                const newOrder = await ordersService.create({
                    totalAmount: amount,
                    items: cartItems.map(item => ({
                        productId: item.id.toString(), // Ensure string ID
                        productName: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    shippingAddress: { // Placeholder address, should be gathered properly
                        firstName: "Client",
                        lastName: "LaDiva",
                        address: "Libreville",
                        city: "Libreville",
                        country: "Gabon",
                        phone: phoneNumber
                    },
                    paymentMethod: 'mobile-money'
                });
                currentOrderId = newOrder.id;
            }

            if (!currentOrderId) {
                throw new Error("Impossible de créer la commande");
            }

            // Initiate payment
            const response = await paymentsService.initiatePayment({
                orderId: currentOrderId,
                numeroClient: phoneNumber,
                operateur: operator
            });

            if (response.success) {
                setStep('waiting');

                // Start polling for status
                pollPaymentStatus(response.payment.reference);
            } else {
                throw new Error(response.message || 'Erreur lors de l\'initiation');
            }

        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            setStep('error');
        }
    };

    const pollPaymentStatus = async (ref: string) => {
        const maxAttempts = 60; // 2 minutes (2s insterval)
        let attempts = 0;

        const interval = setInterval(async () => {
            attempts++;
            try {
                const status = await paymentsService.getPaymentStatus(ref);

                if (status.status === 'success') {
                    clearInterval(interval);
                    setStep('success');
                    setTimeout(onSuccess, 3000);
                } else if (status.status === 'failed' || status.status === 'error') {
                    clearInterval(interval);
                    setError('Le paiement a échoué ou a été annulé');
                    setStep('error');
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setError('Délai d\'attente dépassé. Veuillez vérifier si vous avez été débité.');
                    setStep('error');
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 2000);

        // Cleanup interval on unmount or step change handled by useEffect return if needed,
        // but here we just let it run until success/fail/timeout/close
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-vif to-rose-poudre p-6 flex justify-between items-center text-white">
                    <h2 className="font-great-vibes text-3xl">Paiement Mobile</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'input' && (
                        <div className="space-y-6">
                            {/* Amount Display */}
                            <div className="text-center bg-gray-50 p-4 rounded-xl">
                                <p className="text-gray-600 font-montserrat text-sm">Montant à payer</p>
                                <p className="text-3xl font-bold text-vert-emeraude font-montserrat">
                                    {(amount + (fees || 0)).toLocaleString()} FCFA
                                </p>
                                {fees !== null && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Dont frais estimés: {fees.toLocaleString()} FCFA
                                    </p>
                                )}
                            </div>

                            {/* Operator Selection */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700 font-montserrat">
                                    Choisir l'opérateur
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setOperator('AM')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${operator === 'AM'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 hover:border-red-200'
                                            }`}
                                    >
                                        <Smartphone className={`w-8 h-8 ${operator === 'AM' ? 'text-red-500' : 'text-gray-400'}`} />
                                        <span className="font-semibold font-montserrat">Airtel Money</span>
                                    </button>
                                    <button
                                        onClick={() => setOperator('MC')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${operator === 'MC'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-200'
                                            }`}
                                    >
                                        <Smartphone className={`w-8 h-8 ${operator === 'MC' ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <span className="font-semibold font-montserrat">Moov Money</span>
                                    </button>
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700 font-montserrat">
                                    Numéro de téléphone
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                        placeholder={operator === 'AM' ? "077xxxxxx" : "066xxxxxx"}
                                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-vif focus:border-transparent font-montserrat text-lg"
                                        maxLength={9}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 font-montserrat">
                                    Entrez le numéro avec lequel vous allez payer
                                </p>
                            </div>

                            {/* Pay Button */}
                            <button
                                onClick={handlePayment}
                                className="w-full bg-gradient-to-r from-vert-emeraude to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 font-montserrat flex items-center justify-center gap-2"
                            >
                                <span>Payer Maintenant</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                                    {(amount + (fees || 0)).toLocaleString()} FCFA
                                </span>
                            </button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-12 text-center space-y-4">
                            <Loader2 className="w-16 h-16 text-rose-vif animate-spin mx-auto" />
                            <h3 className="text-xl font-semibold font-montserrat text-gray-800">Initiation du paiement...</h3>
                            <p className="text-gray-500 font-montserrat">Veuillez patienter quelques instants</p>
                        </div>
                    )}

                    {step === 'waiting' && (
                        <div className="py-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Smartphone className="w-10 h-10 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-montserrat text-gray-800 mb-2">Vérifiez votre téléphone</h3>
                                <p className="text-gray-600 font-montserrat px-4">
                                    Un message USSD a été envoyé au <span className="font-semibold text-gray-900">{phoneNumber}</span>.
                                    Veuillez saisir votre code PIN pour valider le paiement.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl mx-4 border border-gray-200">
                                <p className="text-sm text-gray-500 font-montserrat flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    En attente de validation...
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-12 text-center space-y-6">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto transform scale-110">
                                <Check className="w-12 h-12 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-montserrat text-green-600 mb-2">Paiement Réussi !</h3>
                                <p className="text-gray-600 font-montserrat">
                                    Merci pour votre commande. Vous allez recevoir un email de confirmation.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="py-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="w-10 h-10 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-montserrat text-red-600 mb-2">Échec du paiement</h3>
                                <p className="text-gray-600 font-montserrat px-4 mb-4">
                                    {error || "Une erreur est survenue lors du traitement."}
                                </p>
                                <button
                                    onClick={() => setStep('input')}
                                    className="bg-gray-900 text-white font-semibold py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors font-montserrat"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
