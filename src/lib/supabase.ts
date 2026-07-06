import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://mfgdppcitpollcnqukpt.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_B30sBuCoyR-NQ86p-h0iVQ_PUeXnDah';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

