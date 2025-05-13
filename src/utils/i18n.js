/**
 * Internationalization utilities
 */

/**
 * Get locale from file path or URL
 * @param {string} path - The path to extract locale from
 * @returns {string} - The detected locale or default locale
 */
export function getLocaleFromPath(path) {
  const segments = path.split('/');
  // Look for language code in the path
  for (const segment of segments) {
    if (['en', 'fr'].includes(segment)) {
      return segment;
    }
  }
  return 'fr'; // Default language (French)
}

/**
 * Load translations from a namespace
 * @param {string} namespace - The translation namespace (file name without extension)
 * @param {string} locale - The locale to load translations for
 * @returns {object} - The translations object
 */
export async function loadTranslations(namespace, locale = 'fr') {
  try {
    const translations = await import(`../i18n/${namespace}.json`);
    return translations[locale] || translations.fr;
  } catch (error) {
    console.error(`Failed to load translations for ${namespace}`, error);
    return {};
  }
}
