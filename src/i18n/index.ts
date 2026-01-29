/**
 * i18n Module - Internationalization for Astro
 *
 * Usage in Astro components:
 * ```astro
 * ---
 * import { useTranslations, getLocaleFromUrl } from '../i18n';
 *
 * const locale = getLocaleFromUrl(Astro.url);
 * const t = useTranslations(locale);
 * ---
 * <h1>{t('hero.title')}</h1>
 * <p>{t('nav.home')}</p>
 * ```
 *
 * @module i18n
 */

import {
  type Locale,
  type Translations,
  type TranslationNamespace,
  type TranslationsByNamespace,
  LOCALES,
  DEFAULT_LOCALE,
  isLocale
} from './types';

import { fr } from './translations/fr';
import { en } from './translations/en';

// =============================================================================
// Translation Dictionary
// =============================================================================

/** All translations indexed by locale */
const translations: Record<Locale, Translations> = {
  fr,
  en
};

// =============================================================================
// Core Functions
// =============================================================================

/**
 * Get translations for a specific locale
 *
 * @param locale - The locale to get translations for
 * @returns The complete translations object for that locale
 *
 * @example
 * ```ts
 * const t = getTranslations('fr');
 * console.log(t.nav.home); // "Accueil"
 * ```
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}

/**
 * Get translations for a specific namespace
 *
 * @param locale - The locale to get translations for
 * @param namespace - The namespace to retrieve
 * @returns The translations for that namespace
 *
 * @example
 * ```ts
 * const auth = getNamespaceTranslations('en', 'auth');
 * console.log(auth.login); // "Login"
 * ```
 */
export function getNamespaceTranslations<N extends TranslationNamespace>(
  locale: Locale,
  namespace: N
): TranslationsByNamespace<N> {
  const t = getTranslations(locale);
  return t[namespace];
}

// =============================================================================
// Locale Detection
// =============================================================================

/**
 * Extract locale from URL
 *
 * @param url - The URL object to extract locale from
 * @returns The detected locale or the default locale
 *
 * @example
 * ```ts
 * const locale = getLocaleFromUrl(Astro.url);
 * // URL: /fr/about -> 'fr'
 * // URL: /en/blog  -> 'en'
 * // URL: /about    -> 'fr' (default)
 * ```
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/');
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

/**
 * Extract locale from path string
 *
 * @param path - The path string to extract locale from
 * @returns The detected locale or the default locale
 *
 * @example
 * ```ts
 * getLocaleFromPath('/fr/about'); // 'fr'
 * getLocaleFromPath('/en/blog');  // 'en'
 * getLocaleFromPath('/about');    // 'fr' (default)
 * ```
 */
export function getLocaleFromPath(path: string): Locale {
  if (!path) return DEFAULT_LOCALE;

  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];

  return isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}

// =============================================================================
// Translation Helper (useTranslations)
// =============================================================================

/**
 * Create a translation function for a given locale
 *
 * @param locale - The locale to use for translations
 * @returns A function that retrieves translations by key path
 *
 * @example
 * ```astro
 * ---
 * import { useTranslations, getLocaleFromUrl } from '../i18n';
 *
 * const locale = getLocaleFromUrl(Astro.url);
 * const t = useTranslations(locale);
 * ---
 * <h1>{t('hero.title')}</h1>
 * <nav>
 *   <a href="/">{t('nav.home')}</a>
 *   <a href="/about">{t('nav.about')}</a>
 * </nav>
 * ```
 */
export function useTranslations(locale: Locale) {
  const translationData = getTranslations(locale);

  /**
   * Get a translation value by dot-notation path
   *
   * @param key - The translation key path (e.g., 'nav.home', 'auth.login')
   * @returns The translated string
   */
  function t(key: string): string {
    const keys = key.split('.');
    let result: unknown = translationData;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        // Key not found - return key as fallback (helps identify missing translations)
        console.warn(`[i18n] Missing translation: ${key} for locale: ${locale}`);
        return key;
      }
    }

    if (typeof result === 'string') {
      return result;
    }

    // For non-string values, return the key
    return key;
  }

  /**
   * Get a namespace object for direct access
   *
   * @param namespace - The namespace to get
   * @returns The namespace object with all its translations
   */
  function ns<N extends TranslationNamespace>(namespace: N): TranslationsByNamespace<N> {
    return translationData[namespace];
  }

  return Object.assign(t, { ns, locale, translations: translationData });
}

/**
 * Shorthand alias for useTranslations
 * @see useTranslations
 */
export const createTranslator = useTranslations;

// =============================================================================
// URL Utilities
// =============================================================================

/**
 * Get the path for a different locale
 *
 * @param url - The current URL
 * @param targetLocale - The locale to switch to
 * @returns The path with the new locale prefix
 *
 * @example
 * ```ts
 * // Current URL: /fr/about
 * getLocalizedPath(Astro.url, 'en'); // '/en/about'
 *
 * // Current URL: /about
 * getLocalizedPath(Astro.url, 'en'); // '/en/about'
 * ```
 */
export function getLocalizedPath(url: URL, targetLocale: Locale): string {
  const currentLocale = getLocaleFromUrl(url);
  const { pathname } = url;

  // Remove current locale prefix if present
  let pathWithoutLocale = pathname;
  if (pathname.startsWith(`/${currentLocale}/`)) {
    pathWithoutLocale = pathname.slice(currentLocale.length + 1);
  } else if (pathname === `/${currentLocale}`) {
    pathWithoutLocale = '/';
  }

  // Ensure path starts with /
  if (!pathWithoutLocale.startsWith('/')) {
    pathWithoutLocale = '/' + pathWithoutLocale;
  }

  // Add target locale prefix
  return `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
}

/**
 * Get all localized versions of a path
 *
 * @param path - The path to localize
 * @returns Object mapping locales to their paths
 *
 * @example
 * ```ts
 * getAllLocalizedPaths('/about');
 * // { fr: '/fr/about', en: '/en/about' }
 * ```
 */
export function getAllLocalizedPaths(path: string): Record<Locale, string> {
  // Remove any existing locale prefix
  let cleanPath = path;
  for (const locale of LOCALES) {
    if (path.startsWith(`/${locale}/`)) {
      cleanPath = path.slice(locale.length + 1);
      break;
    } else if (path === `/${locale}`) {
      cleanPath = '/';
      break;
    }
  }

  // Generate paths for all locales
  const result: Record<Locale, string> = {} as Record<Locale, string>;
  for (const locale of LOCALES) {
    result[locale] = `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
  }
  return result;
}

// =============================================================================
// Validation Utilities (for build-time checks)
// =============================================================================

/**
 * Get all keys from a nested object as dot-notation paths
 */
function getAllKeys(obj: object, prefix = ''): Set<string> {
  const keys = new Set<string>();

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedKeys = getAllKeys(value as object, fullKey);
      nestedKeys.forEach((k) => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }

  return keys;
}

/**
 * Validate that all translations have the same keys
 * Call this in a build script to ensure translation completeness
 *
 * @returns Array of missing key errors, empty if all valid
 */
export function validateTranslations(): string[] {
  const errors: string[] = [];
  const referenceLocale: Locale = 'fr';
  const referenceKeys = getAllKeys(translations[referenceLocale]);

  for (const locale of LOCALES) {
    if (locale === referenceLocale) continue;

    const localeKeys = getAllKeys(translations[locale]);

    // Check for missing keys
    referenceKeys.forEach((key) => {
      if (!localeKeys.has(key)) {
        errors.push(`Missing key "${key}" in locale "${locale}"`);
      }
    });

    // Check for extra keys
    localeKeys.forEach((key) => {
      if (!referenceKeys.has(key)) {
        errors.push(`Extra key "${key}" in locale "${locale}" not in reference`);
      }
    });
  }

  return errors;
}

// =============================================================================
// Re-exports
// =============================================================================

export {
  type Locale,
  type Translations,
  type TranslationNamespace,
  type TranslationsByNamespace,
  LOCALES,
  DEFAULT_LOCALE,
  isLocale
} from './types';

// Export individual translation objects for direct access if needed
export { fr } from './translations/fr';
export { en } from './translations/en';

// =============================================================================
// Default Export
// =============================================================================

export default {
  // Core
  getTranslations,
  getNamespaceTranslations,
  useTranslations,
  createTranslator,

  // Locale detection
  getLocaleFromUrl,
  getLocaleFromPath,

  // URL utilities
  getLocalizedPath,
  getAllLocalizedPaths,

  // Validation
  validateTranslations,

  // Constants
  LOCALES,
  DEFAULT_LOCALE
};
