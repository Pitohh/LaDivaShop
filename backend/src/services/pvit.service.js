import axios from 'axios';
import { query } from '../config/database.js';

/**
 * PVit Payment Service
 * Intégration de l'API PVit pour Airtel Money et Moov Money
 * Based on PVit API Documentation v4.3
 */

export const pvitService = {
    /**
     * Get stored token for operator from database
     */
    async getStoredToken(operateur) {
        try {
            const result = await query(
                'SELECT token FROM pvit_tokens WHERE operateur = $1',
                [operateur]
            );

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0].token;
        } catch (error) {
            console.error('Error getting PVit token:', error);
            return null;
        }
    },

    /**
     * Update token in database
     */
    async updateToken(operateur, newToken) {
        try {
            await query(
                `INSERT INTO pvit_tokens (operateur, token)
         VALUES ($1, $2)
         ON CONFLICT (operateur) 
         DO UPDATE SET token = $2, updated_at = NOW()`,
                [operateur, newToken]
            );
        } catch (error) {
            console.error('Error updating PVit token:', error);
        }
    },

    /**
     * Get code marchand for operator
     */
    getCodeMarchand(operateur) {
        if (operateur === 'AM') {
            return process.env.PVIT_AM_CODE_MARCHAND;
        } else if (operateur === 'MC') {
            return process.env.PVIT_MC_CODE_MARCHAND;
        }
        throw new Error('Opérateur invalide');
    },

    /**
     * Initiate payment (Action = 1)
     * @param {number} montant - Montant sans frais en FCFA
     * @param {string} referenceMarchand - Référence unique (max 13 chars)
     * @param {string} numeroClient - Numéro téléphone client
     * @param {string} operateur - 'AM' (Airtel) ou 'MC' (Moov)
     */
    async initiatePayment(montant, referenceMarchand, numeroClient, operateur) {
        try {
            const codeMarchand = this.getCodeMarchand(operateur);

            // Prepare POST data
            const formData = new URLSearchParams();
            formData.append('code_marchand', codeMarchand);
            formData.append('montant', montant.toString());
            formData.append('reference_marchand', referenceMarchand);
            formData.append('numero_client', numeroClient);
            formData.append('action', '1'); // Demande de paiement
            formData.append('service', 'REST'); // Service REST
            formData.append('operateur', operateur);

            console.log(`PVit: Initiating payment for ${montant} FCFA with ${operateur}`);

            // Send request to PVit API
            const response = await axios.post(
                process.env.PVIT_API_URL,
                formData.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    timeout: 30000 // 30 seconds timeout
                }
            );

            console.log('PVit response status:', response.status);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('PVit initiate payment error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    },

    /**
     * Calculate fees (Action = 5)
     */
    async calculateFees(montant, operateur) {
        try {
            const codeMarchand = this.getCodeMarchand(operateur);
            const token = await this.getStoredToken(operateur);

            if (!token) {
                throw new Error('Token PVit non disponible');
            }

            const formData = new URLSearchParams();
            formData.append('code_marchand', codeMarchand);
            formData.append('montant', montant.toString());
            formData.append('token', token);
            formData.append('action', '5'); // Requête de commission
            formData.append('service', 'REST');
            formData.append('operateur', operateur);

            const response = await axios.post(
                process.env.PVIT_API_URL,
                formData.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('PVit calculate fees error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    },

    /**
     * Get transaction status (Action = 3)
     */
    async getTransactionStatus(referenceMarchand, operateur, nombreJours = 15) {
        try {
            const codeMarchand = this.getCodeMarchand(operateur);
            const token = await this.getStoredToken(operateur);

            if (!token) {
                throw new Error('Token PVit non disponible');
            }

            const formData = new URLSearchParams();
            formData.append('action', '3'); // Requête de statut
            formData.append('code_marchand', codeMarchand);
            formData.append('reference_marchand', referenceMarchand);
            formData.append('token', token);
            formData.append('service', 'REST');
            formData.append('operateur', operateur);
            formData.append('nombre_jours', nombreJours.toString());

            const response = await axios.post(
                process.env.PVIT_API_URL,
                formData.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('PVit get status error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }
};
