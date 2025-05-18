import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client with proper type extensions for client-side only
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    cookies: {
      get: (key) => {
        if (typeof document === "undefined") return null;
        return document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*=\\s*([^;]*).*$)|^.*$`), '$1');
      },
      set: (key, value, options) => {
        if (typeof document === "undefined") return;
        document.cookie = `${key}=${value};path=/;domain=.martincscott.com;max-age=31536000;secure;samesite=strict`;
      },
      remove: (key, options) => {
        if (typeof document === "undefined") return;
        document.cookie = `${key}=;path=/;domain=.martincscott.com;max-age=0`;
      }
    }
  }
});

// Add client-side only session method for compatibility
supabase.auth.session = () => {
  return new Promise((resolve) => {
    const session = supabase.auth.session();
    resolve({ data: { session }, error: null });
  });
};

export { supabase };
