import { query } from '../config/database.js';

export const reportsController = {
    // Get daily sales stats for the last 30 days
    async getSalesStats(req, res) {
        try {
            const result = await query(
                `SELECT 
           to_char(created_at, 'YYYY-MM-DD') as date,
           SUM(total_amount) as amount,
           COUNT(id) as orders
         FROM orders
         WHERE status NOT IN ('cancelled', 'pending')
           AND created_at >= NOW() - INTERVAL '30 days'
         GROUP BY to_char(created_at, 'YYYY-MM-DD')
         ORDER BY date ASC`
            );

            res.json(result.rows);
        } catch (error) {
            console.error('GetSalesStats error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get top selling products
    async getTopProducts(req, res) {
        try {
            // Assuming items is JSONB array: [{ "id": "...", "name": "...", "quantity": 1 }]
            const result = await query(
                `SELECT 
           item->>'name' as name,
           SUM((item->>'quantity')::int) as sales
         FROM orders,
              jsonb_array_elements(items) as item
         WHERE status NOT IN ('cancelled', 'pending')
         GROUP BY item->>'name'
         ORDER BY sales DESC
         LIMIT 5`
            );

            res.json(result.rows);
        } catch (error) {
            console.error('GetTopProducts error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get KPI stats (Total Sales, Orders, Avg Value) - reusing logic from dashboard or providing faster endpoint
    async getKPIs(req, res) {
        try {
            const result = await query(
                `SELECT 
           COALESCE(SUM(total_amount), 0) as total_sales,
           COUNT(id) as total_orders,
           COALESCE(AVG(total_amount), 0)::int as avg_order_value
         FROM orders
         WHERE status NOT IN ('cancelled', 'pending')`
            );

            res.json(result.rows[0]);
        } catch (error) {
            console.error('GetKPIs error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
