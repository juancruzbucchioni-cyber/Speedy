import { create } from 'zustand';
import { AuthResponse, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface UserPerfil {
  id: string;
  username: string;
  full_name?: string | null;
  address?: string | null;
  phone?: string | null;
  is_admin?: boolean | null;
}

interface AuthState {
  user: User | null;
  profile: UserPerfil | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setPerfil: (profile: UserPerfil | null) => void;
  checkUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null, data: AuthResponse['data'] | null }>;
  signOut: () => Promise<void>;
  fetchUserPerfil: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setPerfil: (profile) => set({ profile }),
  checkUser: async () => {
    if (!isSupabaseConfigured) {
      set({ user: null, profile: null, loading: false });
      return;
    }

    try {
      // Get the current session instead of just the user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        set({ user: null, profile: null, loading: false });
        return;
      }
      
      // If we have a session, get the user
      if (sessionData?.session) {
        const { data: userData } = await supabase.auth.getUser();
        set({ user: userData.user, loading: false });
        
        // If user exists, fetch their profile
        if (userData.user) {
          await get().fetchUserPerfil(userData.user.id);
        }
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch (error) {
      console.error('Error checking user:', error);
      set({ user: null, profile: null, loading: false });
    }
  },
  fetchUserPerfil: async (userId) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If the profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const username = userData.user.email?.split('@')[0] || 'user';
            const { data: newPerfil, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                username: username,
                created_at: new Date().toISOString()
              })
              .select()
              .single();
              
            if (createError) {
              console.error('Error creating user profile:', createError);
            } else if (newPerfil) {
              set({ profile: newPerfil as UserPerfil });
            }
          }
        }
        return;
      }
      
      if (data) {
        set({ profile: data as UserPerfil });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
  signIn: async (email, password) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data?.user) {
        set({ user: data.user, loading: false });
        // Fetch user profile after successful sign in
        await get().fetchUserPerfil(data.user.id);
      }
      
      return { error };
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      return { error: error instanceof Error ? error : new Error('No se pudo iniciar sesion') };
    }
  },
  signUp: async (email, password, username) => {
    if (!isSupabaseConfigured) {
      return {
        error: { message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env' },
        data: null
      };
    }

    try {
      // La disponibilidad del username la valida la constraint unica de Supabase.
      // Asi evitamos permitir lecturas publicas de la tabla profiles.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      
      if (!error && data?.user) {
        // Create the profile manually to ensure it exists
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username,
            created_at: new Date().toISOString()
          });
          
        if (profileError?.code === '23505') {
          return {
            error: { message: 'Ese usuario ya existe. Elegi otro nombre.' },
            data: null,
          };
        }

        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          // Fetch the newly created profile
          await get().fetchUserPerfil(data.user.id);
        }
        
        set({ 
          user: data.user,
          loading: false 
        });
      }
      
      return { error, data };
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      return { error: error instanceof Error ? error : new Error('No se pudo crear la cuenta'), data: null };
    }
  },
  signOut: async () => {
    if (!isSupabaseConfigured) {
      set({ user: null, profile: null });
      return;
    }

    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
}));

