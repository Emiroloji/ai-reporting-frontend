import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const url = (config.url || '').toLowerCase();

  const isAuthEndpoint =
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh');

  if (!isAuthEndpoint) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as import('axios').AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;