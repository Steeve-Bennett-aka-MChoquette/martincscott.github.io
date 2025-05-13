import { createClient } from '@supabase/supabase-js';

// Add fallbacks for environment variables to prevent build failures
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client with error handling
let supabaseClient;

try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Provide a mock client for build process to continue
  supabaseClient = {
    auth: {
      signInWithPassword: async () => ({ error: new Error('Supabase client not initialized') }),
      signInWithOAuth: async () => ({ error: new Error('Supabase client not initialized') }),
      signOut: async () => ({ error: new Error('Supabase client not initialized') }),
      getUser: async () => ({ data: null, error: new Error('Supabase client not initialized') })
    }
  };
}

export const supabase = supabaseClient;
