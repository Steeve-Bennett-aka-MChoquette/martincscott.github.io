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
 * @param {string} namespace - The translation namespace (section name in the main translation file)
 * @param {string} locale - The locale to load translations for
 * @returns {object} - The translations object
 */
export async function loadTranslations(namespace, locale = 'fr') {
  try {
    // Load the main translation file for the specified locale
    const translations = await import(`../i18n/${locale}.json`);
    
    // If namespace is specified, return that section, otherwise return the whole file
    if (namespace && translations.default && translations.default[namespace]) {
      return translations.default[namespace];
    }
    
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}/${namespace}`, error);
    
    // Fallback to specific translation file if it exists
    try {
      const specificTranslations = await import(`../i18n/${namespace}.json`);
      return specificTranslations[locale] || specificTranslations.fr;
    } catch (specificError) {
      console.error(`Failed to load specific translations for ${namespace}`, specificError);
      return {};
    }
  }
}
