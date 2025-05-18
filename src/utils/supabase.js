import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

let supabaseClient;

if (import.meta.env.SSR) {
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
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        cookies: {
          get: (key) => document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*=\\s*([^;]*).*$)|^.*$`), '$1'),
          set: (key, value, options) => {
            document.cookie = `${key}=${value};path=/;domain=.martincscott.com;max-age=31536000;secure;samesite=strict`;
          },
          remove: (key, options) => {
            document.cookie = `${key}=;path=/;domain=.martincscott.com;max-age=0`;
          }
        }
      }
    });
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
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
