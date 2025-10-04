import api from './http';
import type { User } from '../types/auth';

export const userService = {
  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/user/me');
    return res.data;
  },

  updateProfile: async (data: Partial<Pick<User, 'firstName' | 'lastName'>>): Promise<User> => {
    const res = await api.put<User>('/user/me', data);
    return res.data;
  },
};