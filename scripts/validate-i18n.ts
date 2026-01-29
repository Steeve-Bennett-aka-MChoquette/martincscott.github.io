#!/usr/bin/env npx tsx
/**
 * i18n Validation Script
 *
 * Validates that all translation files have consistent keys across all locales.
 * Run this as part of your build process or pre-commit hook.
 *
 * Usage:
 *   npx tsx scripts/validate-i18n.ts
 *   npm run validate:i18n
 *
 * Exit codes:
 *   0 - All translations valid
 *   1 - Validation errors found
 *
 * @module scripts/validate-i18n
 */

import { fr } from '../src/i18n/translations/fr';
import { en } from '../src/i18n/translations/en';
import { LOCALES, type Locale, type Translations } from '../src/i18n/types';

// =============================================================================
// Configuration
// =============================================================================

const REFERENCE_LOCALE: Locale = 'fr';
const translations: Record<Locale, Translations> = { fr, en };

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get all keys from a nested object as dot-notation paths
 */
function getAllKeys(obj: Record<string, unknown>, prefix = ''): Map<string, unknown> {
  const keys = new Map<string, unknown>();

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedKeys = getAllKeys(value as Record<string, unknown>, fullKey);
      nestedKeys.forEach((v, k) => keys.set(k, v));
    } else {
      keys.set(fullKey, value);
    }
  }

  return keys;
}

/**
 * Get value at a dot-notation path
 */
function getValueAtPath(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return result;
}

/**
 * Check if value is a valid translation (string or array of objects)
 */
function isValidTranslation(value: unknown): boolean {
  if (typeof value === 'string') return true;
  if (Array.isArray(value)) {
    return value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'title' in item &&
        'description' in item
    );
  }
  return false;
}

// =============================================================================
// Validation
// =============================================================================

interface ValidationError {
  type: 'missing' | 'extra' | 'type_mismatch' | 'empty';
  locale: Locale;
  key: string;
  details?: string;
}

interface ValidationWarning {
  type: 'length_diff';
  locale: Locale;
  key: string;
  details: string;
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    totalKeys: number;
    checkedLocales: number;
    keysPerLocale: Record<Locale, number>;
  };
}

/**
 * Validate all translations
 */
function validate(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const referenceKeys = getAllKeys(translations[REFERENCE_LOCALE] as unknown as Record<string, unknown>);

  const stats = {
    totalKeys: referenceKeys.size,
    checkedLocales: LOCALES.length,
    keysPerLocale: {} as Record<Locale, number>
  };

  // Get key counts for each locale
  for (const locale of LOCALES) {
    const localeKeys = getAllKeys(translations[locale] as unknown as Record<string, unknown>);
    stats.keysPerLocale[locale] = localeKeys.size;
  }

  // Validate each locale against the reference
  for (const locale of LOCALES) {
    if (locale === REFERENCE_LOCALE) continue;

    const localeTranslations = translations[locale] as unknown as Record<string, unknown>;
    const localeKeys = getAllKeys(localeTranslations);

    // Check for missing keys
    for (const [key, refValue] of referenceKeys) {
      const localeValue = getValueAtPath(localeTranslations, key);

      if (localeValue === undefined) {
        errors.push({
          type: 'missing',
          locale,
          key,
          details: `Expected: ${typeof refValue === 'string' ? `"${refValue.slice(0, 50)}..."` : typeof refValue}`
        });
        continue;
      }

      // Check type consistency
      if (typeof refValue !== typeof localeValue) {
        errors.push({
          type: 'type_mismatch',
          locale,
          key,
          details: `Reference type: ${typeof refValue}, Locale type: ${typeof localeValue}`
        });
        continue;
      }

      // Check for empty strings
      if (typeof localeValue === 'string' && localeValue.trim() === '') {
        errors.push({
          type: 'empty',
          locale,
          key,
          details: 'Translation is an empty string'
        });
        continue;
      }

      // Warning: significant length difference (possible incomplete translation)
      if (typeof refValue === 'string' && typeof localeValue === 'string') {
        const refLen = refValue.length;
        const localeLen = localeValue.length;
        const ratio = Math.min(refLen, localeLen) / Math.max(refLen, localeLen);

        if (ratio < 0.3 && Math.abs(refLen - localeLen) > 20) {
          warnings.push({
            type: 'length_diff',
            locale,
            key,
            details: `Reference: ${refLen} chars, ${locale}: ${localeLen} chars (ratio: ${(ratio * 100).toFixed(0)}%)`
          });
        }
      }
    }

    // Check for extra keys not in reference
    for (const key of localeKeys.keys()) {
      if (!referenceKeys.has(key)) {
        errors.push({
          type: 'extra',
          locale,
          key,
          details: 'Key exists in this locale but not in reference'
        });
      }
    }
  }

  return { errors, warnings, stats };
}

// =============================================================================
// Output Formatting
// =============================================================================

function formatResults(result: ValidationResult): void {
  const { errors, warnings, stats } = result;

  console.log('\n' + colors.bold + colors.cyan + '═══════════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.bold + colors.cyan + '                    i18n VALIDATION REPORT                      ' + colors.reset);
  console.log(colors.bold + colors.cyan + '═══════════════════════════════════════════════════════════════' + colors.reset);

  // Stats
  console.log('\n' + colors.bold + 'Statistics:' + colors.reset);
  console.log(`  Reference locale: ${colors.blue}${REFERENCE_LOCALE}${colors.reset}`);
  console.log(`  Total keys: ${colors.blue}${stats.totalKeys}${colors.reset}`);
  console.log(`  Locales checked: ${colors.blue}${stats.checkedLocales}${colors.reset}`);
  console.log('\n  Keys per locale:');
  for (const [locale, count] of Object.entries(stats.keysPerLocale)) {
    const diff = count - stats.totalKeys;
    const diffStr = diff === 0 ? colors.green + '✓' : (diff > 0 ? colors.yellow + `+${diff}` : colors.red + `${diff}`);
    console.log(`    ${locale}: ${count} ${diffStr}${colors.reset}`);
  }

  // Errors
  if (errors.length > 0) {
    console.log('\n' + colors.bold + colors.red + `Errors (${errors.length}):` + colors.reset);

    const groupedErrors: Record<string, ValidationError[]> = {};
    for (const error of errors) {
      const group = `${error.locale}:${error.type}`;
      if (!groupedErrors[group]) groupedErrors[group] = [];
      groupedErrors[group].push(error);
    }

    for (const [group, errs] of Object.entries(groupedErrors)) {
      const [locale, type] = group.split(':');
      const typeLabel = {
        missing: 'Missing keys',
        extra: 'Extra keys',
        type_mismatch: 'Type mismatches',
        empty: 'Empty values'
      }[type] || type;

      console.log(`\n  ${colors.yellow}[${locale}]${colors.reset} ${typeLabel}:`);
      for (const err of errs.slice(0, 10)) {
        console.log(`    ${colors.red}✗${colors.reset} ${err.key}`);
        if (err.details) {
          console.log(`      ${colors.cyan}→ ${err.details}${colors.reset}`);
        }
      }
      if (errs.length > 10) {
        console.log(`    ${colors.yellow}... and ${errs.length - 10} more${colors.reset}`);
      }
    }
  }

  // Warnings
  if (warnings.length > 0) {
    console.log('\n' + colors.bold + colors.yellow + `Warnings (${warnings.length}):` + colors.reset);
    for (const warning of warnings.slice(0, 5)) {
      console.log(`  ${colors.yellow}⚠${colors.reset} [${warning.locale}] ${warning.key}`);
      console.log(`    ${colors.cyan}→ ${warning.details}${colors.reset}`);
    }
    if (warnings.length > 5) {
      console.log(`  ${colors.yellow}... and ${warnings.length - 5} more${colors.reset}`);
    }
  }

  // Summary
  console.log('\n' + colors.bold + '═══════════════════════════════════════════════════════════════' + colors.reset);
  if (errors.length === 0) {
    console.log(colors.bold + colors.green + '✓ All translations are valid!' + colors.reset);
  } else {
    console.log(colors.bold + colors.red + `✗ Found ${errors.length} error(s) and ${warnings.length} warning(s)` + colors.reset);
  }
  console.log(colors.bold + '═══════════════════════════════════════════════════════════════' + colors.reset + '\n');
}

// =============================================================================
// Main
// =============================================================================

function main(): void {
  console.log(colors.cyan + '\nValidating i18n translations...' + colors.reset);

  const result = validate();
  formatResults(result);

  // Exit with error code if there are errors
  if (result.errors.length > 0) {
    process.exit(1);
  }

  process.exit(0);
}

main();
