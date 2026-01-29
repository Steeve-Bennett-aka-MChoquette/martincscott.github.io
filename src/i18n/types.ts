/**
 * i18n Type Definitions
 *
 * STRICT TYPES - No index signatures allowed.
 * All translation keys must be explicitly defined.
 *
 * @module i18n/types
 */

// =============================================================================
// Locale Types
// =============================================================================

/** Supported locales */
export const LOCALES = ['fr', 'en'] as const;

/** Locale type derived from LOCALES array */
export type Locale = (typeof LOCALES)[number];

/** Default locale (French) */
export const DEFAULT_LOCALE: Locale = 'fr';

/** Type guard for locale validation */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.includes(value as Locale);
}

// =============================================================================
// Translation Section Types
// =============================================================================

/** Site metadata translations */
export interface SiteTranslations {
  title: string;
  description: string;
}

/** Navigation translations */
export interface NavTranslations {
  home: string;
  about: string;
  blog: string;
  projects: string;
  contact: string;
}

/** Hero section translations */
export interface HeroTranslations {
  title: string;
  subtitle: string;
}

/** Single feature item */
export interface FeatureItem {
  title: string;
  description: string;
}

/** Features section translations */
export interface FeaturesTranslations {
  title: string;
  subtitle: string;
  items: [FeatureItem, FeatureItem, FeatureItem, FeatureItem, FeatureItem, FeatureItem];
}

/** Call to action translations */
export interface CtaTranslations {
  title: string;
  subtitle: string;
  button: string;
  download: string;
  github: string;
}

/** Footer translations */
export interface FooterTranslations {
  rights: string;
  privacy: string;
  terms: string;
}

/** Logos section translations */
export interface LogosTranslations {
  title: string;
}

/** Blog section translations (main) */
export interface BlogTranslations {
  title: string;
  readMore: string;
  publishedOn: string;
  backToAll: string;
  recentPosts: string;
  postedOn: string;
  backToList: string;
}

/** Projects section translations (main) */
export interface ProjectsTranslations {
  title: string;
  description: string;
  latestWork: string;
  latestWorkSubtitle: string;
  viewProject: string;
  readMore: string;
  backToAll: string;
  noProjects: string;
  recentProjects: string;
  viewDetails: string;
  backToList: string;
  postedOn: string;
  noProjectsFound: string;
  checkBackLater: string;
  projectNotFound: string;
  projectNotFoundDescription: string;
  backToProjects: string;
}

/** Pagination translations */
export interface PaginationTranslations {
  prev: string;
  next: string;
  page: string;
}

/** Contact form translations */
export interface ContactTranslations {
  title: string;
  name: string;
  email: string;
  message: string;
  send: string;
  success: string;
  error: string;
  letsCollaborate: string;
  collaborateText: string;
}

/** About page translations */
export interface AboutTranslations {
  title: string;
  subtitle: string;
}

/** 404 page translations */
export interface NotFoundTranslations {
  title: string;
  message: string;
  button: string;
}

/** Authentication translations */
export interface AuthTranslations {
  login: string;
  signup: string;
  email: string;
  password: string;
  forgotPassword: string;
  resetPassword: string;
  sendResetLink: string;
  backToLogin: string;
  enterEmail: string;
  alreadyHaveAccount: string;
  clientPortal: string;
  newToPortal: string;
  createAccount: string;
  needAssistance: string;
  orLoginWith: string;
}

/** Secure dashboard translations */
export interface SecureTranslations {
  title: string;
  welcome: string;
  logout: string;
  loading: string;
  authError: string;
  logoutError: string;
  profile: string;
  viewProfile: string;
}

/** Profile page translations */
export interface ProfileTranslations {
  title: string;
  personalInfo: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  changeAvatar: string;
  save: string;
  saving: string;
  saved: string;
  saveError: string;
  backToDashboard: string;
  accountInfo: string;
  provider: string;
  createdAt: string;
  lastSignIn: string;
}

// =============================================================================
// Main Translation Interface
// =============================================================================

/**
 * Complete translations object structure.
 * Every locale MUST implement this exact interface.
 */
export interface Translations {
  site: SiteTranslations;
  nav: NavTranslations;
  hero: HeroTranslations;
  features: FeaturesTranslations;
  cta: CtaTranslations;
  footer: FooterTranslations;
  logos: LogosTranslations;
  blog: BlogTranslations;
  projects: ProjectsTranslations;
  pagination: PaginationTranslations;
  contact: ContactTranslations;
  about: AboutTranslations;
  notFound: NotFoundTranslations;
  auth: AuthTranslations;
  secure: SecureTranslations;
  profile: ProfileTranslations;
}

// =============================================================================
// Namespace Types (for selective loading)
// =============================================================================

/** All available translation namespaces */
export type TranslationNamespace = keyof Translations;

/** Get translation type for a specific namespace */
export type TranslationsByNamespace<N extends TranslationNamespace> = Translations[N];

// =============================================================================
// Path Types (for dot notation access)
// =============================================================================

/** Helper type to create dot-notation paths */
type PathImpl<K extends string | number, V> = V extends object
  ? `${K}` | `${K}.${Path<V>}`
  : `${K}`;

/** Generate all possible dot-notation paths for an object */
type Path<T> = {
  [K in keyof T]-?: PathImpl<K & string, T[K]>;
}[keyof T];

/** All valid translation key paths (e.g., "nav.home", "auth.login") */
export type TranslationKey = Path<Translations>;

// =============================================================================
// Utility Types
// =============================================================================

/** Extract value type at a given path */
export type TranslationValue<P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof Translations
    ? Rest extends keyof Translations[K]
      ? Translations[K][Rest]
      : never
    : never
  : P extends keyof Translations
    ? Translations[P]
    : never;

/** Translation dictionary type (maps locales to translations) */
export type TranslationDictionary = {
  [L in Locale]: Translations;
};

// =============================================================================
// Legacy Compatibility Types (deprecated)
// =============================================================================

/**
 * @deprecated Use Translations instead
 */
export type MainTranslations = Translations;

/**
 * @deprecated Use TranslationsByNamespace<'auth'> instead
 */
export type LegacyAuthTranslations = AuthTranslations & { [key: string]: string };

/**
 * @deprecated Use specific namespace types instead
 */
export interface TranslationFile {
  [key: string]: unknown;
}
