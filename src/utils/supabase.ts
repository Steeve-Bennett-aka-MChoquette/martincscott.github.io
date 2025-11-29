import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Mock auth interface for SSR
interface MockAuthResult {
  data: null;
  error: Error | null;
}

interface MockAuth {
  signInWithPassword: () => Promise<MockAuthResult>;
  signInWithOAuth: () => Promise<MockAuthResult>;
  signOut: () => Promise<{ error: Error | null }>;
  getUser: () => Promise<MockAuthResult>;
  resetPasswordForEmail: () => Promise<MockAuthResult>;
  signUp: () => Promise<MockAuthResult>;
  updateUser: () => Promise<MockAuthResult>;
  refreshSession: () => Promise<MockAuthResult>;
}

interface MockStorageBucket {
  upload: () => Promise<MockAuthResult>;
  getPublicUrl: () => { data: { publicUrl: string } };
  list: () => Promise<{ data: any[] | null; error: Error | null }>;
}

interface MockStorage {
  from: () => MockStorageBucket;
}

interface MockSupabaseClient {
  auth: MockAuth;
  storage: MockStorage;
}

type SupabaseClientType = SupabaseClient | MockSupabaseClient;

// Create Supabase client with error handling
let supabaseClient: SupabaseClientType;

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
      signUp: async () => ({ data: null, error: null }),
      updateUser: async () => ({ data: null, error: null }),
      refreshSession: async () => ({ data: null, error: null })
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        list: async () => ({ data: [], error: null })
      })
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
    const initError = new Error('Supabase client failed to initialize. Please check your configuration.');
    supabaseClient = {
      auth: {
        signInWithPassword: async () => ({ data: null, error: initError }),
        signInWithOAuth: async () => ({ data: null, error: initError }),
        signOut: async () => ({ error: initError }),
        getUser: async () => ({ data: null, error: initError }),
        resetPasswordForEmail: async () => ({ data: null, error: initError }),
        signUp: async () => ({ data: null, error: initError }),
        updateUser: async () => ({ data: null, error: initError }),
        refreshSession: async () => ({ data: null, error: initError })
      },
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: initError }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
          list: async () => ({ data: [], error: initError })
        })
      }
    };
  }
}

export const supabase = supabaseClient;
