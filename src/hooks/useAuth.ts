import { create } from 'zustand';
import type { LoginRequest, User } from '../types/auth';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null) {
    const maybe = err as { response?: { data?: { message?: string } } };
    const msg = maybe.response?.data?.message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return 'Beklenmeyen hata';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  init: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName'>>) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  login: async (credentials: LoginRequest) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(credentials);
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      set({ user: res.user, loading: false });
    } catch (e: unknown) {
      set({ error: getErrorMessage(e), loading: false });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, loading: false, error: null, initialized: true });
  },

  init: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ initialized: true });
      return;
    }
    set({ loading: true });
    try {
      const me = await userService.getProfile();
      set({ user: me, loading: false, initialized: true });
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, loading: false, initialized: true });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true });
    try {
      const updated = await userService.updateProfile(data);
      set({ user: updated, loading: false });
    } catch (e: unknown) {
      set({ error: getErrorMessage(e), loading: false });
      throw e;
    }
  },
}));