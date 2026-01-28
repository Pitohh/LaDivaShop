import { api } from '../lib/api';

export const reportsService = {
    getSalesStats: async () => {
        return await api.get('/reports/sales');
    },

    getTopProducts: async () => {
        return await api.get('/reports/top-products');
    },

    getKPIs: async () => {
        return await api.get('/reports/kpis');
    }
};
