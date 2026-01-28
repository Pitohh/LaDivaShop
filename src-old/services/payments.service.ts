import { api } from '../lib/api';

export interface PaymentInitiateRequest {
    orderId: string;
    numeroClient: string;
    operateur: 'AM' | 'MC'; // AM = Airtel Money, MC = Moov Money
}

export interface PaymentResponse {
    success: boolean;
    payment: {
        id: string;
        reference: string;
        montant: number;
        operateur: string;
        status: string;
    };
    message: string;
    pvitResponse: any;
}

export interface PaymentStatus {
    id: string;
    reference_marchand: string;
    montant: number;
    fees: number;
    total_amount: number;
    numero_client: string;
    operateur: string;
    status: string;
    order_status: string;
    created_at: string;
}

export interface FeesCalculation {
    success: boolean;
    data: any;
}

export const paymentsService = {
    /**
     * Initiate payment with PVit (Airtel Money or Moov Money)
     */
    async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentResponse> {
        try {
            const response = await api.post('/payments/initiate', request);
            return response;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to initiate payment');
        }
    },

    /**
     * Get payment status by reference
     */
    async getPaymentStatus(reference: string): Promise<PaymentStatus> {
        try {
            const status = await api.get(`/payments/status/${reference}`);
            return status;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to get payment status');
        }
    },

    /**
     * Calculate fees for a given amount and operator
     */
    async calculateFees(montant: number, operateur: 'AM' | 'MC'): Promise<FeesCalculation> {
        try {
            const fees = await api.post('/payments/calculate-fees', { montant, operateur });
            return fees;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to calculate fees');
        }
    },
};
