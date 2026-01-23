export {
  // Translations
  defaultTranslations,
  locales,
  supportedLanguages,
  defaultLanguage,

  // Language detection
  detectLanguage,
  getTranslations,
  getAutoTranslations,

  // Helper functions
  createTranslator,
  getToolbarTitles,
  getHeadingOptions,
} from "./translations";

// Export individual locales (full locale code naming)
export { enUS } from "./locales/en";
export { deDE } from "./locales/de";
