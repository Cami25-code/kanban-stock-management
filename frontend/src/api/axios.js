import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization);

    if (error.response?.status === 401 && hadAuthHeader) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      if (window.location.pathname !== '/login') {
        toast.error('Session expirée, veuillez vous reconnecter');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
