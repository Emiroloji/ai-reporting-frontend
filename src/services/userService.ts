import api from './http';
import type { User } from '../types/auth';

export const userService = {
  getProfile: async (): Promise<User> => {
    const res = await api.get<User>('/users/profile');
    return res.data;
  },
  updateProfile: async (data: Partial<Pick<User, 'firstName' | 'lastName'>>): Promise<User> => {
    const res = await api.put<User>('/users/profile', data);
    return res.data;
  },
};