/**
 * Legacy i18n Utilities - DEPRECATED
 *
 * This module is maintained for backward compatibility.
 * New code should import from '@/i18n' instead.
 *
 * Migration guide:
 * ```ts
 * // Old (deprecated)
 * import { loadTranslations, getLocaleFromPath } from '../utils/i18n';
 * const translations = await loadTranslations('auth', 'en');
 *
 * // New (recommended)
 * import { useTranslations, getLocaleFromUrl } from '../i18n';
 * const locale = getLocaleFromUrl(Astro.url);
 * const t = useTranslations(locale);
 * const authText = t('auth.login');
 * ```
 *
 * @deprecated Use '@/i18n' module instead
 * @module utils/i18n
 */

// Re-export everything from new i18n module for backward compatibility
import {
  type Locale,
  type Translations,
  LOCALES,
  DEFAULT_LOCALE,
  isLocale,
  getTranslations,
  getNamespaceTranslations,
  getLocaleFromPath as newGetLocaleFromPath,
  useTranslations
} from '../i18n';

// =============================================================================
// Legacy Type Exports (for backward compatibility)
// =============================================================================

export type { Locale };

/**
 * @deprecated Use Translations['auth'] instead
 */
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

/**
 * @deprecated Use Translations['nav'] instead
 */
export interface NavTranslations {
  about: string;
  projects: string;
  blog: string;
  contact: string;
  [key: string]: string;
}

/**
 * @deprecated Use Translations['site'] instead
 */
export interface SiteTranslations {
  title: string;
  description: string;
  [key: string]: string;
}

/**
 * @deprecated Use Translations['footer'] instead
 */
export interface FooterTranslations {
  rights: string;
  [key: string]: string;
}

/**
 * @deprecated Use Translations['contact'] instead
 */
export interface ContactTranslations {
  name: string;
  email: string;
  message: string;
  send: string;
  success: string;
  error: string;
  [key: string]: string;
}

/**
 * @deprecated Use Translations['notFound'] instead
 */
export interface NotFoundTranslations {
  title: string;
  message: string;
  button: string;
  [key: string]: string;
}

/**
 * @deprecated Use Translations['about'] instead
 */
export interface AboutTranslations {
  title: string;
  [key: string]: string;
}

/**
 * @deprecated Use Translations from '@/i18n' instead
 */
export interface MainTranslations {
  site: SiteTranslations;
  nav: NavTranslations;
  footer: FooterTranslations;
  [key: string]: unknown;
}

/**
 * @deprecated Use specific types from '@/i18n' instead
 */
export interface TranslationFile {
  [key: string]: unknown;
}

interface AuthTranslationFile {
  en: AuthTranslations;
  fr: AuthTranslations;
  [key: string]: AuthTranslations;
}

// =============================================================================
// Legacy Functions (with deprecation warnings)
// =============================================================================

function isValidLocale(locale: string): locale is Locale {
  return isLocale(locale);
}

/**
 * Get locale from file path or URL
 *
 * @deprecated Use getLocaleFromUrl(Astro.url) from '@/i18n' instead
 * @param path - The path to extract locale from
 * @returns The detected locale or undefined
 */
export function getLocaleFromPath(path: string): Locale | undefined {
  if (!path) {
    return undefined;
  }

  const locale = newGetLocaleFromPath(path);

  // Return undefined for default locale to match old behavior
  const segments = path.split('/');
  for (const segment of segments) {
    if (segment === 'en' || segment === 'fr') {
      return segment;
    }
  }

  return undefined;
}

/**
 * Load translations from a namespace
 *
 * @deprecated Use useTranslations(locale) from '@/i18n' instead
 * @param namespace - The translation namespace (section name in the main translation file)
 * @param locale - The locale to load translations for
 * @returns The translations object
 *
 * @example
 * ```ts
 * // Old way (deprecated)
 * const translations = await loadTranslations('auth', 'en');
 *
 * // New way (recommended)
 * import { useTranslations } from '../i18n';
 * const t = useTranslations('en');
 * // Access: t('auth.login'), t('auth.email'), etc.
 * ```
 */
export async function loadTranslations(
  namespace: string | null,
  locale: string = 'fr'
): Promise<MainTranslations | AuthTranslations | TranslationFile> {
  // Validate and normalize locale
  const validLocale: Locale = isValidLocale(locale) ? locale : 'fr';

  // Get translations from new system
  const allTranslations = getTranslations(validLocale);

  // For auth namespace, return the auth section
  if (namespace === 'auth') {
    return allTranslations.auth as unknown as AuthTranslations;
  }

  // For contact namespace
  if (namespace === 'contact') {
    return allTranslations.contact as unknown as ContactTranslations;
  }

  // For notFound namespace
  if (namespace === 'notFound') {
    return allTranslations.notFound as unknown as NotFoundTranslations;
  }

  // For secure namespace, return both secure and profile
  if (namespace === 'secure') {
    return {
      secure: allTranslations.secure,
      profile: allTranslations.profile
    } as unknown as TranslationFile;
  }

  // For projects namespace
  if (namespace === 'projects') {
    return allTranslations.projects as unknown as TranslationFile;
  }

  // For blog namespace
  if (namespace === 'blog') {
    return allTranslations.blog as unknown as TranslationFile;
  }

  // For other namespaces or null, return full translations
  if (namespace && namespace in allTranslations) {
    return allTranslations[namespace as keyof Translations] as unknown as TranslationFile;
  }

  // Return full translations cast to legacy type
  return allTranslations as unknown as MainTranslations;
}

// =============================================================================
// Re-exports for convenience
// =============================================================================

export {
  LOCALES,
  DEFAULT_LOCALE,
  isLocale,
  useTranslations,
  getTranslations,
  getNamespaceTranslations
};
