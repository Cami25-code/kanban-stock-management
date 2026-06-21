import api from './axios';

export const getDashboardSummary = () => api.get('/dashboard');

export const getSalesVsPurchases = () => api.get('/stats/sales-vs-purchases');

export const getOrdersSummary = () => api.get('/stats/orders-summary');

export const getTopProducts = (limit = 3) =>
  api.get('/stats/top-products', { params: { limit } });

export const getLowStock = (limit = 5) => api.get('/stats/low-stock', { params: { limit } });
