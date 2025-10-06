import { supabase } from '../lib/supabase';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: 0,
        email: data.user.email || '',
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        role: 'user',
        credits: 0,
      },
    };
  },

  register: async (payload: RegisterRequest): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          first_name: payload.firstName,
          last_name: payload.lastName,
        },
      },
    });

    if (error) throw error;
  },

  refreshToken: async (_refreshToken: string): Promise<LoginResponse> => {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    return {
      accessToken: data.session?.access_token || '',
      refreshToken: data.session?.refresh_token || '',
      user: {
        id: 0,
        email: data.user?.email || '',
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        role: 'user',
        credits: 0,
      },
    };
  },
};