/**
 * i18n translations module for the Rich Text Editor
 * Supports automatic language detection from the document
 */

import { enUS } from "./locales/en";
import { deDE } from "./locales/de";

/**
 * Available locales mapped by full locale code
 * Also supports short codes (en, de) for compatibility
 */
export const locales = {
  "en-US": enUS,
  "de-DE": deDE,
  // Short code aliases for compatibility with i18next and other configs
  "en": enUS,
  "de": deDE,
};

/**
 * Supported language codes (both full and short formats)
 */
export const supportedLanguages = ["en-US", "de-DE", "en", "de"];

/**
 * Default language
 */
export const defaultLanguage = "en-US";

/**
 * Default translations (English US)
 */
export const defaultTranslations = enUS;

/**
 * Normalize a language code to full locale format
 * @param {string} lang - Language code (e.g., "en", "en-US", "de", "de-DE")
 * @returns {string|null} Normalized locale code or null if not supported
 */
const normalizeLocale = (lang) => {
  if (!lang) return null;

  // Check for exact match first (e.g., "en-US", "de-DE")
  if (supportedLanguages.includes(lang)) {
    return lang;
  }

  // Try to match by primary language code (e.g., "en" -> "en-US", "de" -> "de-DE")
  const primaryLang = lang.split("-")[0].toLowerCase();
  const matchingLocale = supportedLanguages.find(
    (locale) => locale.split("-")[0].toLowerCase() === primaryLang
  );

  return matchingLocale || null;
};

/**
 * Detect the current language from various sources
 * Priority: 1. html lang attribute, 2. navigator.language, 3. default (en-US)
 * @returns {string} Detected language code (e.g., "en-US", "de-DE")
 */
export const detectLanguage = () => {
  // Check if running in browser
  if (typeof document === "undefined") {
    return defaultLanguage;
  }

  // 1. Check html lang attribute (most reliable as it's set by the app)
  const htmlLang = document.documentElement.lang;
  if (htmlLang) {
    const normalized = normalizeLocale(htmlLang);
    if (normalized) {
      return normalized;
    }
  }

  // 2. Check navigator.language
  if (typeof navigator !== "undefined" && navigator.language) {
    const normalized = normalizeLocale(navigator.language);
    if (normalized) {
      return normalized;
    }
  }

  // 3. Default to English (US)
  return defaultLanguage;
};

/**
 * Get translations for a specific language
 * @param {string} lang - Language code (e.g., "en", "en-US", "de", "de-DE")
 * @returns {Object} Translations object
 */
export const getTranslations = (lang) => {
  // Direct lookup first (supports both "en" and "en-US" formats)
  if (lang && locales[lang]) {
    return locales[lang];
  }
  // Fallback to normalized locale
  const normalizedLocale = normalizeLocale(lang) || defaultLanguage;
  return locales[normalizedLocale] || locales[defaultLanguage];
};

/**
 * Get translations based on auto-detected language
 * @returns {Object} Translations object for detected language
 */
export const getAutoTranslations = () => {
  const detectedLang = detectLanguage();
  return getTranslations(detectedLang);
};

/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object to merge
 * @returns {Object} Merged object
 */
const deepMerge = (target, source) => {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }

  return result;
};

/**
 * Create a translation function with the given language or custom translations
 * @param {string|Object} langOrTranslations - Language code or custom translations object
 * @returns {Function} Translation function
 */
export const createTranslator = (langOrTranslations = {}) => {
  let translations;

  if (typeof langOrTranslations === "string") {
    translations = getTranslations(langOrTranslations);
  } else {
    const autoTranslations = getAutoTranslations();
    translations = deepMerge(autoTranslations, langOrTranslations);
  }

  /**
   * Get a translation by key path (e.g., "toolbar.bold" or "linkTooltip.insert")
   * @param {string} keyPath - Dot-separated key path
   * @param {string} fallback - Fallback value if key not found
   * @returns {string} Translated string
   */
  return (keyPath, fallback = "") => {
    const keys = keyPath.split(".");
    let value = translations;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return fallback || keyPath;
      }
    }

    return typeof value === "string" ? value : fallback || keyPath;
  };
};

/**
 * Get toolbar titles for a specific language or merged with custom translations
 * @param {string|Object} langOrTranslations - Language code or translation object
 * @returns {Object} Toolbar titles object
 */
export const getToolbarTitles = (langOrTranslations = {}) => {
  let translations;

  if (typeof langOrTranslations === "string") {
    translations = getTranslations(langOrTranslations);
  } else {
    const autoTranslations = getAutoTranslations();
    translations = deepMerge(autoTranslations, langOrTranslations);
  }

  return translations.toolbar;
};

/**
 * Get heading options for a specific language or merged with custom translations
 * @param {string|Object} langOrTranslations - Language code or translation object
 * @returns {Array} Heading options array with fontSize for visual representation
 */
export const getHeadingOptions = (langOrTranslations = {}) => {
  let translations;

  if (typeof langOrTranslations === "string") {
    translations = getTranslations(langOrTranslations);
  } else {
    const autoTranslations = getAutoTranslations();
    translations = deepMerge(autoTranslations, langOrTranslations);
  }

  return [
    { value: "h1", label: translations.headings.h1, fontSize: "24px", fontWeight: 700 },
    { value: "h2", label: translations.headings.h2, fontSize: "20px", fontWeight: 700 },
    { value: "h3", label: translations.headings.h3, fontSize: "16px", fontWeight: 700 },
    { value: "p", label: translations.headings.p, fontSize: "14px", fontWeight: 400 },
  ];
};
