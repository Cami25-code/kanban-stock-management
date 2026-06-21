import api from './axios';

export const createSale = (data) => api.post('/sales', data);
