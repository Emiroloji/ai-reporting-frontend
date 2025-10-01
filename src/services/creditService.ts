import api from './http';
import type { UserCredits, CreditTransaction } from '../types/credits';

export const creditService = {
  getCredits: async (): Promise<UserCredits> => {
    const res = await api.get<UserCredits>('/users/credits');
    return res.data;
  },
  getCreditHistory: async (): Promise<CreditTransaction[]> => {
    const res = await api.get<CreditTransaction[]>('/users/credit-history');
    return res.data;
  },
  useCredits: async (data: { amount: number; reason?: string }): Promise<UserCredits> => {
    const res = await api.post<UserCredits>('/credits/use', data);
    return res.data;
  },
};