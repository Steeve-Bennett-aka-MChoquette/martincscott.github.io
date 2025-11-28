/**
 * Internationalization utilities
 */

export type Locale = 'en' | 'fr';

export interface AuthTranslations {
  email: string;
  password: string;
  createAccount: string;
  login: string;
  orLoginWith: string;
  forgotPassword: string;
  clientPortal: string;
  newToPortal: string;
  needAssistance: string;
  signup: string;
  [key: string]: string;
}

export interface NavTranslations {
  about: string;
  projects: string;
  blog: string;
  contact: string;
  [key: string]: string;
}

export interface SiteTranslations {
  title: string;
  description: string;
  [key: string]: string;
}

export interface FooterTranslations {
  rights: string;
  [key: string]: string;
}

export interface ContactTranslations {
  name: string;
  email: string;
  message: string;
  send: string;
  success: string;
  error: string;
  [key: string]: string;
}

export interface NotFoundTranslations {
  title: string;
  message: string;
  button: string;
  [key: string]: string;
}

export interface AboutTranslations {
  title: string;
  [key: string]: string;
}

export interface MainTranslations {
  site: SiteTranslations;
  nav: NavTranslations;
  footer: FooterTranslations;
  [key: string]: unknown;
}

export interface TranslationFile {
  [key: string]: unknown;
}

interface AuthTranslationFile {
  en: AuthTranslations;
  fr: AuthTranslations;
  [key: string]: AuthTranslations;
}

function isValidLocale(locale: string): locale is Locale {
  return locale === 'en' || locale === 'fr';
}

/**
 * Get locale from file path or URL
 * @param path - The path to extract locale from
 * @returns The detected locale or undefined
 */
export function getLocaleFromPath(path: string): Locale | undefined {
  if (!path) {
    console.warn('Path is undefined in getLocaleFromPath');
    return undefined;
  }

  console.log('Getting locale from path:', path);

  const segments = path.split('/');
  for (const segment of segments) {
    if (segment === 'en' || segment === 'fr') {
      console.log('Found locale in path:', segment);
      return segment;
    }
  }

  console.log('No locale found in path');
  return undefined;
}

/**
 * Load translations from a namespace
 * @param namespace - The translation namespace (section name in the main translation file)
 * @param locale - The locale to load translations for
 * @returns The translations object
 */
export async function loadTranslations(
  namespace: string | null,
  locale: string = 'fr'
): Promise<MainTranslations | AuthTranslations | TranslationFile> {
  // Validate and normalize locale
  const validLocale: Locale = isValidLocale(locale) ? locale : 'fr';
  // Fallback translations for auth namespace to prevent UI breakage
  const authFallback: AuthTranslations = {
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
      const authTranslations = await import(`../i18n/auth.json`) as { default: AuthTranslationFile };

      if (authTranslations.default[validLocale]) {
        console.log(`Using ${validLocale} translations from auth.json`);
        return authTranslations.default[validLocale];
      } else if (authTranslations.default.fr) {
        console.log(`Falling back to fr translations from auth.json`);
        return authTranslations.default.fr;
      }

      console.warn(`Could not find any translations in auth.json, using fallback`);
      return authFallback;
    } catch (error) {
      console.error('Failed to load auth translations:', error);
      return authFallback;
    }
  }

  // For other namespaces, try to load from the main locale file
  try {
    const translations = await import(`../i18n/${validLocale}.json`) as { default: MainTranslations };

    if (namespace && translations.default && translations.default[namespace]) {
      return translations.default[namespace] as TranslationFile;
    }

    return translations.default || {};
  } catch (error) {
    console.error(`Failed to load translations for ${validLocale}/${namespace}`, error);
    return {};
  }
}
