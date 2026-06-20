import api from './axios';

export const getStores = () => api.get('/stores');

export const createStore = (data) => api.post('/stores', data);

export const updateStore = (storeId, data) => api.put(`/stores/${storeId}`, data);
