import axios from 'axios';
import type {
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosError,
} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

const AUTH_WHITELIST: string[] = ['/auth/login', '/auth/register', '/auth/refresh-token'];

api.interceptors.request.use((config) => {
  const url = (config.url || '').toLowerCase();
  const isAuth = AUTH_WHITELIST.some((p) => url.includes(p));
  if (!isAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // headers'ı düz obje olarak ele alıp Authorization ekleyelim
      const headers: Record<string, string> = (config.headers ?? {}) as Record<string, string>;
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers as AxiosRequestHeaders;
    }
  }
  return config;
});

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    // Axios hatası değilse olduğu gibi fırlat
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const err = error as AxiosError;
    const original = err.config as RetryConfig | undefined;

    if (err.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        flushQueue(null);
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((newToken) => {
            if (!newToken) return reject(err);
            const headers: Record<string, string> = (original.headers ?? {}) as Record<string, string>;
            headers.Authorization = `Bearer ${newToken}`;
            original.headers = headers as AxiosRequestHeaders;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const resp = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
        );
        const newAccess = (resp.data as { accessToken?: string })?.accessToken ?? null;
        const newRefresh = (resp.data as { refreshToken?: string })?.refreshToken ?? null;

        if (newAccess) localStorage.setItem('accessToken', newAccess);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

        flushQueue(newAccess);
        if (newAccess && original) {
          const headers: Record<string, string> = (original.headers ?? {}) as Record<string, string>;
          headers.Authorization = `Bearer ${newAccess}`;
          original.headers = headers as AxiosRequestHeaders;
          return api(original);
        }
        return Promise.reject(err);
      } catch (e) {
        flushQueue(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;