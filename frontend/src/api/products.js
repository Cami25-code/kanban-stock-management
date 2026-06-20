import api from './axios';

export const getProducts = (page = 1) => api.get('/products', { params: { page } });

export const createProduct = (data) => api.post('/products', data);
