import api from './axios';

export const getSuppliers = () => api.get('/suppliers');

export const createSupplier = (data) => api.post('/suppliers', data);
