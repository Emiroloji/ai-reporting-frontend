export interface CreditTransaction {
  id: number;
  userId: number;
  amount: number;
  type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS';
  description: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  balanceAfter: number;
  createdAt: string;
}

export interface CreditBalance {
  userId: number;
  balance: number;
  lastUpdated: string;
}

export interface AddCreditRequest {
  amount: number;
  description?: string;
}