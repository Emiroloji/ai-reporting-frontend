import api from './http';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/auth/login', credentials);
    return res.data;
  },

  register: async (payload: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', payload);
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/auth/refresh-token', { refreshToken });
    return res.data;
  },
};