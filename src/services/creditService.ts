import api from './http';
import type { CreditTransaction, CreditBalance, AddCreditRequest } from '../types/credits';

export const creditService = {
  getMyCredits: async (): Promise<CreditBalance> => {
    const res = await api.get<CreditBalance>('/credits/my');
    return res.data;
  },

  getCreditHistory: async (): Promise<CreditTransaction[]> => {
    const res = await api.get<CreditTransaction[]>('/credits/history');
    return res.data;
  },

  addCredits: async (data: AddCreditRequest): Promise<CreditBalance> => {
    const res = await api.post<CreditBalance>('/credits/add', data);
    return res.data;
  },
};