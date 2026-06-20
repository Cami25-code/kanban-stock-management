import api from './axios';

export const getProducts = (page = 1) => api.get('/products', { params: { page } });

export const getAllProducts = () => api.get('/products', { params: { per_page: 1000 } });

export const createProduct = (data) => api.post('/products', data);

export const getProduct = (productId) => api.get(`/products/${productId}`);
