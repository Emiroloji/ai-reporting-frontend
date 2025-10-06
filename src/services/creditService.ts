import { supabase } from '../lib/supabase';
import type { CreditTransaction, CreditBalance, AddCreditRequest } from '../types/credits';

interface DbCreditTransaction {
  id: number;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

const mapDbTransactionToTransaction = (dbTx: DbCreditTransaction): CreditTransaction => ({
  id: dbTx.id,
  userId: 0,
  amount: dbTx.amount,
  type: dbTx.transaction_type.toUpperCase() as CreditTransaction['type'],
  description: dbTx.description,
  balanceAfter: 0,
  createdAt: dbTx.created_at,
});

export const creditService = {
  getMyCredits: async (): Promise<CreditBalance> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .rpc('get_user_credit_balance', { user_uuid: user.id });

    if (error) throw error;

    return {
      userId: 0,
      balance: data || 0,
      lastUpdated: new Date().toISOString(),
    };
  },

  getCreditHistory: async (): Promise<CreditTransaction[]> => {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as DbCreditTransaction[]).map(mapDbTransactionToTransaction);
  },

  addCredits: async (creditData: AddCreditRequest): Promise<CreditBalance> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        amount: creditData.amount,
        transaction_type: 'purchase',
        description: creditData.description || 'Manual credit addition',
      });

    if (error) throw error;

    return creditService.getMyCredits();
  },
};