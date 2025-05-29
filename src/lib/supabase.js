import { createClient } from '@supabase/supabase-js';

// Add fallbacks for environment variables to prevent build failures
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create Supabase client with error handling
let supabaseClient;

// Check if we're in a server-side rendering environment
if (import.meta.env.SSR) {
  // During build/SSR, use a mock client to avoid errors
  console.log('Using mock Supabase client for SSR/build');
  supabaseClient = {
    auth: {
      signInWithPassword: async () => ({ data: null, error: null }),
      signInWithOAuth: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: null, error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null })
    }
  };
} else {
  // In the browser, use the real Supabase client
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Provide a fallback that shows a clear error message
    supabaseClient = {
      auth: {
        signInWithPassword: async () => ({ error: new Error('Supabase client failed to initialize. Please check your configuration.') }),
        signInWithOAuth: async () => ({ error: new Error('Supabase client failed to initialize. Please check your configuration.') }),
        signOut: async () => ({ error: new Error('Supabase client failed to initialize. Please check your configuration.') }),
        getUser: async () => ({ data: null, error: new Error('Supabase client failed to initialize. Please check your configuration.') }),
        resetPasswordForEmail: async () => ({ error: new Error('Supabase client failed to initialize. Please check your configuration.') }),
        signUp: async () => ({ error: new Error('Supabase client failed to initialize. Please check your configuration.') })
      }
    };
  }
}

export const supabase = supabaseClient;