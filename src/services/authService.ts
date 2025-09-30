import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken }, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    return response.data;
  },

  // DİKKAT: /auth/me backend'de yoksa bunu eklemiyoruz/kullanmıyoruz
  // me: async (): Promise<User> => { ... }
};