import { pvitService } from '../services/pvit.service.js';
import { query } from '../config/database.js';

export const paymentsController = {
    /**
     * Initiate payment
     */
    async initiatePayment(req, res) {
        try {
            const { orderId, numeroClient, operateur } = req.body;

            // Validate input
            if (!orderId || !numeroClient || !operateur) {
                return res.status(400).json({
                    error: 'orderId, numeroClient, and operateur are required'
                });
            }

            if (!['AM', 'MC'].includes(operateur)) {
                return res.status(400).json({
                    error: 'Opérateur must be AM (Airtel) or MC (Moov)'
                });
            }

            // Get order
            const orderResult = await query(
                'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
                [orderId, req.user.id]
            );

            if (orderResult.rows.length === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }

            const order = orderResult.rows[0];

            // Check if order is already paid
            if (order.payment_status === 'completed') {
                return res.status(400).json({ error: 'Order already paid' });
            }

            // Generate unique reference (max 13 chars)
            const referenceMarchand = `ORD${Date.now().toString().slice(-9)}`;
            const montant = order.total_amount;

            // Create payment record
            const paymentResult = await query(
                `INSERT INTO payments 
         (order_id, reference_marchand, montant, total_amount, numero_client, operateur, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
                [orderId, referenceMarchand, montant, montant, numeroClient, operateur, 'initiating']
            );

            const payment = paymentResult.rows[0];

            // Initiate payment with PVit
            const pvitResponse = await pvitService.initiatePayment(
                montant,
                referenceMarchand,
                numeroClient,
                operateur
            );

            // Update payment with PVit response
            await query(
                `UPDATE payments SET 
         pvit_response = $1,
         status = $2
         WHERE id = $3`,
                [
                    JSON.stringify(pvitResponse),
                    pvitResponse.success ? 'pending' : 'error',
                    payment.id
                ]
            );

            // Update order payment status
            await query(
                `UPDATE orders SET 
         payment_status = $1,
         payment_reference = $2
         WHERE id = $3`,
                ['processing', referenceMarchand, orderId]
            );

            res.json({
                success: pvitResponse.success,
                payment: {
                    id: payment.id,
                    reference: referenceMarchand,
                    montant,
                    operateur,
                    status: pvitResponse.success ? 'pending' : 'error'
                },
                message: pvitResponse.success
                    ? 'Paiement initié. Veuillez valider sur votre téléphone.'
                    : 'Erreur lors de l\'initiation du paiement',
                pvitResponse: pvitResponse.data
            });
        } catch (error) {
            console.error('Initiate payment error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    /**
     * PVit callback handler (receives final transaction status)
     */
    async handleCallback(req, res) {
        try {
            console.log('PVit Callback received');

            // Parse XML callback data
            const result = req.body.result;

            if (!result) {
                return res.status(400).send('Invalid callback data');
            }

            const {
                statut,
                ref: referenceMarchand,
                numero_client: numeroClient,
                token,
                amount,
                fees,
                message
            } = result;

            // Update token if provided
            if (token) {
                // Determine operator from payment record
                const paymentResult = await query(
                    'SELECT operateur FROM payments WHERE reference_marchand = $1',
                    [referenceMarchand]
                );

                if (paymentResult.rows.length > 0) {
                    await pvitService.updateToken(paymentResult.rows[0].operateur, token);
                }
            }

            // Update payment status
            const paymentStatus = statut === '1' ? 'success' : 'failed';

            const updateResult = await query(
                `UPDATE payments SET
         status = $1,
         fees = $2,
         callback_data = $3,
         error_message = $4
         WHERE reference_marchand = $5
         RETURNING order_id`,
                [
                    paymentStatus,
                    fees || 0,
                    JSON.stringify(result),
                    message || null,
                    referenceMarchand
                ]
            );

            if (updateResult.rows.length === 0) {
                console.error('Payment not found for reference:', referenceMarchand);
                return res.status(404).send('Payment not found');
            }

            const orderId = updateResult.rows[0].order_id;

            // Update order status based on payment result
            if (paymentStatus === 'success') {
                await query(
                    `UPDATE orders SET
           payment_status = 'completed',
           status = 'confirmed'
           WHERE id = $1`,
                    [orderId]
                );

                // =====================================================
                // STOCK MANAGEMENT LOGIC (P0)
                // =====================================================
                try {
                    // 1. Get order items
                    const orderRes = await query('SELECT items FROM orders WHERE id = $1', [orderId]);
                    if (orderRes.rows.length > 0) {
                        const items = orderRes.rows[0].items; // JSONB array

                        // 2. Loop and update stock for each item
                        for (const item of items) {
                            // item structure expected: { productId, quantity, ... }
                            if (item.productId && item.quantity) {
                                await query(
                                    `UPDATE products 
                                     SET stock = stock - $1, sales = sales + $1 
                                     WHERE id = $2 AND stock >= $1`,
                                    [item.quantity, item.productId]
                                );
                                console.log(`📉 Stock updated for product ${item.productId}: -${item.quantity}`);
                            }
                        }
                    }
                } catch (stockError) {
                    console.error('❌ Error updating stock:', stockError);
                    // We do not fail the request here because payment is already successful
                    // Ideally we should log this to an "Admin Alert" system
                }

                console.log(`✅ Payment successful for order ${orderId}`);
            } else {
                await query(
                    `UPDATE orders SET
           payment_status = 'failed'
           WHERE id = $1`,
                    [orderId]
                );

                console.log(`❌ Payment failed for order ${orderId}: ${message}`);
            }

            // Respond to PVit (they expect a 200 OK)
            res.status(200).send('OK');
        } catch (error) {
            console.error('Callback handler error:', error);
            res.status(500).send('Error processing callback');
        }
    },

    /**
     * Get payment status
     */
    async getPaymentStatus(req, res) {
        try {
            const { reference } = req.params;

            const result = await query(
                `SELECT p.*, o.status as order_status
         FROM payments p
         JOIN orders o ON p.order_id = o.id
         WHERE p.reference_marchand = $1 AND o.user_id = $2`,
                [reference, req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Get payment status error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    /**
     * Calculate fees for a given amount
     */
    async calculateFees(req, res) {
        try {
            const { montant, operateur } = req.body;

            if (!montant || !operateur) {
                return res.status(400).json({
                    error: 'montant and operateur are required'
                });
            }

            if (!['AM', 'MC'].includes(operateur)) {
                return res.status(400).json({
                    error: 'Opérateur must be AM (Airtel) or MC (Moov)'
                });
            }

            const response = await pvitService.calculateFees(montant, operateur);

            res.json(response);
        } catch (error) {
            console.error('Calculate fees error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
