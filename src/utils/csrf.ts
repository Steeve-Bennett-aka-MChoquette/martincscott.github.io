/**
 * CSRF Protection for Static Sites (GitHub Pages)
 *
 * Since GitHub Pages cannot validate tokens server-side, this provides:
 * 1. Client-side token generation and validation
 * 2. OAuth state parameter protection
 * 3. Double-submit pattern with sessionStorage
 * 4. Origin validation for requests
 *
 * IMPORTANT: This is a UX security layer. Real data protection is via Supabase RLS.
 */

// Token configuration
const TOKEN_KEY = 'csrf_token';
const TOKEN_EXPIRY_KEY = 'csrf_token_expiry';
const OAUTH_STATE_KEY = 'oauth_state';
const TOKEN_LIFETIME_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a cryptographically secure random token
 */
export function generateToken(length: number = 32): string {
  if (typeof window === 'undefined') {
    return 'ssr-placeholder-token';
  }

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create a CSRF token for the current session
 */
export function getCSRFToken(): string {
  if (typeof window === 'undefined') {
    return 'ssr-placeholder-token';
  }

  const existingToken = sessionStorage.getItem(TOKEN_KEY);
  const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);

  // Check if token exists and is not expired
  if (existingToken && expiry && Date.now() < parseInt(expiry, 10)) {
    return existingToken;
  }

  // Generate new token
  const newToken = generateToken();
  const newExpiry = Date.now() + TOKEN_LIFETIME_MS;

  sessionStorage.setItem(TOKEN_KEY, newToken);
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, newExpiry.toString());

  return newToken;
}

/**
 * Validate a CSRF token against the stored token
 */
export function validateCSRFToken(token: string): boolean {
  if (typeof window === 'undefined') {
    return true; // SSR bypass
  }

  const storedToken = sessionStorage.getItem(TOKEN_KEY);
  const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!storedToken || !expiry) {
    console.warn('CSRF: No stored token found');
    return false;
  }

  if (Date.now() > parseInt(expiry, 10)) {
    console.warn('CSRF: Token expired');
    clearCSRFToken();
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (token.length !== storedToken.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Clear the CSRF token (on logout or expiry)
 */
export function clearCSRFToken(): void {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * Refresh the CSRF token (call after successful form submission)
 */
export function refreshCSRFToken(): string {
  clearCSRFToken();
  return getCSRFToken();
}

// =============================================================================
// OAuth State Protection
// =============================================================================

/**
 * Generate and store OAuth state parameter
 * Prevents CSRF attacks on OAuth callback
 */
export function generateOAuthState(): string {
  if (typeof window === 'undefined') {
    return 'ssr-placeholder-state';
  }

  const state = generateToken(24);
  const stateData = {
    token: state,
    timestamp: Date.now(),
    nonce: generateToken(8)
  };

  sessionStorage.setItem(OAUTH_STATE_KEY, JSON.stringify(stateData));
  return state;
}

/**
 * Validate OAuth state parameter from callback
 */
export function validateOAuthState(returnedState: string): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  const storedData = sessionStorage.getItem(OAUTH_STATE_KEY);

  if (!storedData) {
    console.warn('OAuth: No stored state found');
    return false;
  }

  try {
    const { token, timestamp } = JSON.parse(storedData);

    // State expires after 10 minutes
    if (Date.now() - timestamp > 10 * 60 * 1000) {
      console.warn('OAuth: State expired');
      clearOAuthState();
      return false;
    }

    const isValid = token === returnedState;

    if (isValid) {
      clearOAuthState(); // One-time use
    }

    return isValid;
  } catch {
    console.error('OAuth: Invalid state data');
    return false;
  }
}

/**
 * Clear OAuth state
 */
export function clearOAuthState(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(OAUTH_STATE_KEY);
}

// =============================================================================
// Origin Validation
// =============================================================================

/**
 * Get allowed origins for the site
 */
export function getAllowedOrigins(): string[] {
  const origins = [
    'https://martincscott.github.io',
    'https://martincscott.com', // If using custom domain
  ];

  // Allow localhost in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    origins.push(
      'http://localhost:4321',
      'http://localhost:3000',
      'http://127.0.0.1:4321',
      'http://127.0.0.1:3000'
    );
  }

  return origins;
}

/**
 * Validate that a request comes from an allowed origin
 */
export function validateOrigin(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  const currentOrigin = window.location.origin;
  const allowedOrigins = getAllowedOrigins();

  return allowedOrigins.some(origin =>
    currentOrigin === origin || currentOrigin.startsWith(origin)
  );
}

// =============================================================================
// Form Protection Utilities
// =============================================================================

/**
 * Create a hidden CSRF input field for forms
 */
export function createCSRFInput(): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = '_csrf';
  input.value = getCSRFToken();
  return input;
}

/**
 * Add CSRF token to a form element
 */
export function protectForm(form: HTMLFormElement): void {
  // Remove existing CSRF input if present
  const existingInput = form.querySelector('input[name="_csrf"]');
  if (existingInput) {
    existingInput.remove();
  }

  // Add new CSRF input
  form.appendChild(createCSRFInput());
}

/**
 * Validate CSRF token from form data
 */
export function validateFormCSRF(formData: FormData): boolean {
  const token = formData.get('_csrf');

  if (!token || typeof token !== 'string') {
    console.warn('CSRF: No token in form data');
    return false;
  }

  return validateCSRFToken(token);
}

// =============================================================================
// Request Headers
// =============================================================================

/**
 * Get headers with CSRF token for fetch requests
 */
export function getCSRFHeaders(): Record<string, string> {
  return {
    'X-CSRF-Token': getCSRFToken(),
    'X-Requested-With': 'XMLHttpRequest' // Helps prevent simple CSRF
  };
}

/**
 * Create fetch options with CSRF protection
 */
export function createSecureFetchOptions(
  method: string = 'POST',
  body?: any
): RequestInit {
  const headers: Record<string, string> = {
    ...getCSRFHeaders(),
    'Content-Type': 'application/json'
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: 'same-origin' // Only send cookies to same origin
  };

  if (body) {
    options.body = JSON.stringify({
      ...body,
      _csrf: getCSRFToken()
    });
  }

  return options;
}

// =============================================================================
// Initialization
// =============================================================================

/**
 * Initialize CSRF protection on page load
 * Call this in your main layout/app component
 */
export function initCSRFProtection(): void {
  if (typeof window === 'undefined') return;

  // Generate initial token
  getCSRFToken();

  // Auto-protect all forms on the page
  document.querySelectorAll('form').forEach(form => {
    if (form instanceof HTMLFormElement) {
      protectForm(form);
    }
  });

  // Watch for dynamically added forms
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLFormElement) {
          protectForm(node);
        }
        if (node instanceof HTMLElement) {
          node.querySelectorAll('form').forEach(form => {
            if (form instanceof HTMLFormElement) {
              protectForm(form);
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// =============================================================================
// Export all utilities
// =============================================================================

export const csrf = {
  // Token management
  getToken: getCSRFToken,
  validate: validateCSRFToken,
  refresh: refreshCSRFToken,
  clear: clearCSRFToken,

  // OAuth protection
  generateOAuthState,
  validateOAuthState,
  clearOAuthState,

  // Origin validation
  validateOrigin,
  getAllowedOrigins,

  // Form protection
  protectForm,
  validateFormCSRF,
  createCSRFInput,

  // Request helpers
  getHeaders: getCSRFHeaders,
  createFetchOptions: createSecureFetchOptions,

  // Initialization
  init: initCSRFProtection
};

export default csrf;
