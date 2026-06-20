import api from './axios';

export const getOrders = (page = 1, showAll = false) =>
  api.get('/orders', { params: { page, status: showAll ? 'all' : undefined } });

export const createOrder = (data) => api.post('/orders', data);

export const updateOrderStatus = (orderId, status) =>
  api.put(`/orders/${orderId}`, { status });
