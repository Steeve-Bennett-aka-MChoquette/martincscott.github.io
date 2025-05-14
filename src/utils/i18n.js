/**
 * Internationalization utilities
 */

/**
 * Get locale from file path or URL
 * @param {string} path - The path to extract locale from
 * @returns {string} - The detected locale or default locale
 */
export function getLocaleFromPath(path) {
  // Check if path is defined
  if (!path) {
    console.warn('Path is undefined in getLocaleFromPath');
    return undefined;
  }
  
  console.log('Getting locale from path:', path);
  
  const segments = path.split('/');
  // Look for language code in the path
  for (const segment of segments) {
    if (['en', 'fr'].includes(segment)) {
      console.log('Found locale in path:', segment);
      return segment;
    }
  }
  
  console.log('No locale found in path');
  return undefined; // No locale found
}

/**
 * Load translations from a namespace
 * @param {string} namespace - The translation namespace (section name in the main translation file)
 * @param {string} locale - The locale to load translations for
 * @returns {object} - The translations object
 */
export async function loadTranslations(namespace, locale = 'fr') {
  // Fallback translations for auth namespace to prevent UI breakage
  const authFallback = {
    email: 'Email',
    password: 'Password',
    createAccount: 'Create Account',
    login: 'Login',
    orLoginWith: 'Or login with',
    forgotPassword: 'Forgot Password?',
    clientPortal: 'Client Portal Login',
    newToPortal: 'New to the platform?',
    needAssistance: 'Need Account Assistance?',
    signup: 'Sign Up'
  };

  // For auth namespace, use a direct approach that's known to work
  if (namespace === 'auth') {
    try {
      // This approach is used in login.astro and works correctly
      const authTranslations = await import(`../i18n/auth.json`);
      
      // Return the translations for the requested locale, or fall back to French
      if (authTranslations.default[locale]) {
        console.log(`Using ${locale} translations from auth.json`);
        return authTranslations.default[locale];
      } else if (authTranslations.default.fr) {
        console.log(`Falling back to fr translations from auth.json`);
        return authTranslations.default.fr;
      }
      
      // If we couldn't find the translations, return the fallback
      console.warn(`Could not find any translations in auth.json, using fallback`);
      return authFallback;
    } catch (error) {
      console.error('Failed to load auth translations:', error);
      return authFallback;
    }
  }
  
  // For other namespaces, try to load from the main locale file
  try {
    const translations = await import(`../i18n/${locale}.json`);
    
    // If namespace is specified, return that section, otherwise return the whole file
    if (namespace && translations.default && translations.default[namespace]) {
      return translations.default[namespace];
    }
    
    return translations.default || {};
  } catch (error) {
    console.error(`Failed to load translations for ${locale}/${namespace}`, error);
    return {};
  }
}
