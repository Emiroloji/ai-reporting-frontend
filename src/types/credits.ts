export interface UserCredits {
  total: number;
  used: number;
  remaining: number;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  type: 'use' | 'add' | string;
  description?: string;
  createdAt: string;
}