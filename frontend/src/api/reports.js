import api from './axios';

export const getReportsOverview = () => api.get('/reports/overview');

export const getBestCategories = () => api.get('/reports/best-categories');

export const getProfitVsRevenue = () => api.get('/reports/profit-vs-revenue');

export const getBestProducts = () => api.get('/reports/best-products');
