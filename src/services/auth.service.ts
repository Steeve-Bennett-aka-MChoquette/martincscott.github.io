/**
 * Centralized Authentication Service
 *
 * This service consolidates all authentication logic for the static site.
 * It wraps Supabase auth methods with additional security measures.
 *
 * SECURITY NOTE: This is a client-side auth service for a static site.
 * Real data security is enforced by Supabase RLS policies.
 */

import { supabase } from '../utils/supabase';
import {
  csrf,
  generateOAuthState,
  validateOAuthState,
  clearCSRFToken,
  getCSRFToken,
  validateCSRFToken
} from '../utils/csrf';
import type { User, Session, Provider, AuthError } from '@supabase/supabase-js';

// =============================================================================
// Types
// =============================================================================

export interface AuthResult<T = any> {
  data: T | null;
  error: AuthError | Error | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  metadata?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email: string | null;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  provider?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdateData {
  display_name?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
}

export type OAuthProvider = 'github' | 'google';

// =============================================================================
// Auth State Management
// =============================================================================

let currentUser: User | null = null;
let currentSession: Session | null = null;
const authListeners: Set<(user: User | null) => void> = new Set();

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') return null;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth: Error getting user', error);
      return null;
    }

    currentUser = data?.user ?? null;
    return currentUser;
  } catch (error) {
    console.error('Auth: Unexpected error getting user', error);
    return null;
  }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  if (typeof window === 'undefined') return null;

  try {
    // Access getSession if available, otherwise return null
    const client = supabase as any;
    if (client.auth?.getSession) {
      const { data, error } = await client.auth.getSession();
      if (error) {
        console.error('Auth: Error getting session', error);
        return null;
      }
      currentSession = data?.session ?? null;
      return currentSession;
    }
    return null;
  } catch (error) {
    console.error('Auth: Unexpected error getting session', error);
    return null;
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  authListeners.add(callback);

  // Set up Supabase auth listener
  const client = supabase as any;
  if (client.auth?.onAuthStateChange) {
    const { data } = client.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        currentUser = session?.user ?? null;
        currentSession = session;
        notifyAuthListeners();
      }
    );

    return () => {
      authListeners.delete(callback);
      data?.subscription?.unsubscribe?.();
    };
  }

  return () => {
    authListeners.delete(callback);
  };
}

function notifyAuthListeners(): void {
  authListeners.forEach(callback => callback(currentUser));
}

// =============================================================================
// Email/Password Authentication
// =============================================================================

/**
 * Sign in with email and password
 */
export async function signInWithPassword(
  credentials: LoginCredentials,
  csrfToken?: string
): Promise<AuthResult<{ user: User; session: Session }>> {
  // Validate CSRF token if provided
  if (csrfToken && !validateCSRFToken(csrfToken)) {
    return {
      data: null,
      error: new Error('Invalid security token. Please refresh and try again.')
    };
  }

  // Validate origin
  if (!csrf.validateOrigin()) {
    return {
      data: null,
      error: new Error('Request origin not allowed.')
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      return { data: null, error };
    }

    currentUser = data?.user ?? null;
    currentSession = data?.session ?? null;

    // Refresh CSRF token after successful login
    csrf.refresh();
    notifyAuthListeners();

    return { data: data as { user: User; session: Session }, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Login failed')
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(
  credentials: SignupCredentials,
  csrfToken?: string
): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
  // Validate CSRF token if provided
  if (csrfToken && !validateCSRFToken(csrfToken)) {
    return {
      data: null,
      error: new Error('Invalid security token. Please refresh and try again.')
    };
  }

  // Validate origin
  if (!csrf.validateOrigin()) {
    return {
      data: null,
      error: new Error('Request origin not allowed.')
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: credentials.metadata
      }
    });

    if (error) {
      return { data: null, error };
    }

    // Refresh CSRF token after successful signup
    csrf.refresh();

    return {
      data: { user: data?.user ?? null, session: data?.session ?? null },
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Signup failed')
    };
  }
}

// =============================================================================
// OAuth Authentication
// =============================================================================

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(
  provider: OAuthProvider,
  redirectTo?: string
): Promise<AuthResult<{ url: string }>> {
  // Validate origin
  if (!csrf.validateOrigin()) {
    return {
      data: null,
      error: new Error('Request origin not allowed.')
    };
  }

  // Generate state for CSRF protection on OAuth flow
  const state = generateOAuthState();

  try {
    const client = supabase as any;
    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback/`,
        queryParams: {
          state
        }
      }
    });

    if (error) {
      return { data: null, error };
    }

    return { data: { url: data?.url ?? '' }, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('OAuth login failed')
    };
  }
}

/**
 * Handle OAuth callback
 */
export async function handleOAuthCallback(): Promise<AuthResult<{ user: User; session: Session }>> {
  if (typeof window === 'undefined') {
    return { data: null, error: new Error('Cannot handle callback during SSR') };
  }

  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.substring(1));

  // Check for state parameter (CSRF protection)
  const state = params.get('state') || hash.get('state');
  if (state && !validateOAuthState(state)) {
    return {
      data: null,
      error: new Error('Invalid state parameter. Possible CSRF attack.')
    };
  }

  // Handle code exchange (PKCE flow)
  const code = params.get('code');
  if (code) {
    try {
      const client = supabase as any;
      if (client.auth?.exchangeCodeForSession) {
        const { data, error } = await client.auth.exchangeCodeForSession(code);

        if (error) {
          return { data: null, error };
        }

        currentUser = data?.user ?? null;
        currentSession = data?.session ?? null;
        csrf.refresh();
        notifyAuthListeners();

        return {
          data: { user: data?.user, session: data?.session },
          error: null
        };
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Code exchange failed')
      };
    }
  }

  // Handle access token from hash (implicit flow)
  const accessToken = hash.get('access_token');
  if (accessToken) {
    // Token is already in the URL, Supabase client will pick it up
    const user = await getCurrentUser();
    const session = await getSession();

    if (user) {
      csrf.refresh();
      return {
        data: { user, session: session! },
        error: null
      };
    }
  }

  return {
    data: null,
    error: new Error('No valid authentication response found')
  };
}

// =============================================================================
// Password Management
// =============================================================================

/**
 * Request password reset email
 */
export async function resetPassword(
  email: string,
  csrfToken?: string
): Promise<AuthResult<void>> {
  // Validate CSRF token if provided
  if (csrfToken && !validateCSRFToken(csrfToken)) {
    return {
      data: null,
      error: new Error('Invalid security token. Please refresh and try again.')
    };
  }

  // Validate origin
  if (!csrf.validateOrigin()) {
    return {
      data: null,
      error: new Error('Request origin not allowed.')
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback/`
    });

    if (error) {
      return { data: null, error };
    }

    // Refresh CSRF token
    csrf.refresh();

    return { data: undefined, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Password reset failed')
    };
  }
}

/**
 * Update user password (when logged in)
 */
export async function updatePassword(
  newPassword: string,
  csrfToken?: string
): Promise<AuthResult<User>> {
  // Validate CSRF token if provided
  if (csrfToken && !validateCSRFToken(csrfToken)) {
    return {
      data: null,
      error: new Error('Invalid security token. Please refresh and try again.')
    };
  }

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return { data: null, error };
    }

    // Refresh CSRF token
    csrf.refresh();

    return { data: data?.user ?? null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Password update failed')
    };
  }
}

// =============================================================================
// Profile Management
// =============================================================================

/**
 * Update user profile metadata
 */
export async function updateProfile(
  profileData: ProfileUpdateData,
  csrfToken?: string
): Promise<AuthResult<User>> {
  // Validate CSRF token if provided
  if (csrfToken && !validateCSRFToken(csrfToken)) {
    return {
      data: null,
      error: new Error('Invalid security token. Please refresh and try again.')
    };
  }

  // Validate origin
  if (!csrf.validateOrigin()) {
    return {
      data: null,
      error: new Error('Request origin not allowed.')
    };
  }

  try {
    const { data, error } = await supabase.auth.updateUser({
      data: profileData
    });

    if (error) {
      return { data: null, error };
    }

    currentUser = data?.user ?? null;
    notifyAuthListeners();

    // Refresh CSRF token
    csrf.refresh();

    return { data: data?.user ?? null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Profile update failed')
    };
  }
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<AuthResult<string>> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      data: null,
      error: new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.')
    };
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      data: null,
      error: new Error('File too large. Maximum size is 5MB.')
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      return { data: null, error };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return { data: urlData.publicUrl, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Avatar upload failed')
    };
  }
}

// =============================================================================
// Session Management
// =============================================================================

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResult<void>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { data: null, error };
    }

    // Clear auth state
    currentUser = null;
    currentSession = null;

    // Clear CSRF token
    clearCSRFToken();

    notifyAuthListeners();

    return { data: undefined, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Sign out failed')
    };
  }
}

/**
 * Refresh the current session
 */
export async function refreshSession(): Promise<AuthResult<Session>> {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      return { data: null, error };
    }

    currentSession = data?.session ?? null;
    currentUser = data?.user ?? null;

    return { data: data?.session ?? null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Session refresh failed')
    };
  }
}

// =============================================================================
// Auth Guards
// =============================================================================

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(
  loginPath: string = '/auth/login/'
): Promise<User | null> {
  const user = await getCurrentUser();

  if (!user && typeof window !== 'undefined') {
    // Store intended destination
    sessionStorage.setItem('auth_redirect', window.location.pathname);
    window.location.href = loginPath;
    return null;
  }

  return user;
}

/**
 * Get redirect URL after authentication
 */
export function getAuthRedirect(defaultPath: string = '/'): string {
  if (typeof window === 'undefined') return defaultPath;

  const redirect = sessionStorage.getItem('auth_redirect');
  sessionStorage.removeItem('auth_redirect');

  return redirect || defaultPath;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get user's display name (from metadata or email)
 */
export function getDisplayName(user: User | null): string {
  if (!user) return 'Guest';

  const metadata = user.user_metadata;

  return (
    metadata?.display_name ||
    metadata?.full_name ||
    metadata?.name ||
    user.email?.split('@')[0] ||
    'User'
  );
}

/**
 * Get user's avatar URL
 */
export function getAvatarUrl(user: User | null): string | null {
  if (!user) return null;

  const metadata = user.user_metadata;

  return (
    metadata?.avatar_url ||
    metadata?.picture ||
    null
  );
}

/**
 * Get auth provider name
 */
export function getProviderName(user: User | null): string {
  if (!user) return 'Unknown';

  const provider = user.app_metadata?.provider;

  switch (provider) {
    case 'github':
      return 'GitHub';
    case 'google':
      return 'Google';
    case 'email':
      return 'Email';
    default:
      return provider || 'Email';
  }
}

// =============================================================================
// Export Auth Service
// =============================================================================

export const authService = {
  // State
  getCurrentUser,
  getSession,
  onAuthStateChange,
  isAuthenticated,

  // Email/Password
  signInWithPassword,
  signUp,
  resetPassword,
  updatePassword,

  // OAuth
  signInWithOAuth,
  handleOAuthCallback,

  // Profile
  updateProfile,
  uploadAvatar,

  // Session
  signOut,
  refreshSession,

  // Guards
  requireAuth,
  getAuthRedirect,

  // Utilities
  getDisplayName,
  getAvatarUrl,
  getProviderName,

  // CSRF (re-export for convenience)
  csrf: {
    getToken: getCSRFToken,
    validate: validateCSRFToken,
    refresh: csrf.refresh
  }
};

export default authService;
