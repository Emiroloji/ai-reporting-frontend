import { supabase } from '../lib/supabase';
import type { User } from '../types/auth';

export const userService = {
  getMe: async (): Promise<User> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: 0,
      email: user.email || '',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      role: 'user',
      credits: 0,
    };
  },

  updateProfile: async (updateData: Partial<Pick<User, 'firstName' | 'lastName'>>): Promise<User> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updates: Record<string, string> = {};
    if (updateData.firstName) updates.first_name = updateData.firstName;
    if (updateData.lastName) updates.last_name = updateData.lastName;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    return userService.getMe();
  },
};