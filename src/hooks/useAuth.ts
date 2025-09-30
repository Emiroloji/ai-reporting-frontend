import { create } from 'zustand';
import type { LoginRequest, User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  init: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  login: async (credentials: LoginRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      set({ user: response.user ?? null, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, loading: false, error: null });
  },

  init: async () => {
    // /auth/me yoksa sadece initialized işaretleyelim
    set({ initialized: true });
  },
}));