// Export utility functions
export * from "./utils/editorsUtils";

// Export components
export { RichTextEditor } from "./RichtextEditor";
export { Toolbar, TOOLBAR_TOOLS, DEFAULT_TOOL_GROUPS, DEFAULT_TOOL_TITLES, DEFAULT_RIGHT_TOOL_GROUPS, DEFAULT_TEXT_COLORS } from "./Toolbar";
export { LinkTooltip } from "./LinkTooltip";
export { CustomSelect } from "./CustomSelect";
export { ColorPicker, FIGMA_TEXT_COLORS } from "./ColorPicker";

// Export i18n utilities
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

  // Individual locales (full locale code naming)
  enUS,
  deDE,
} from "./i18n";

// Default export
import { RichTextEditor } from "./RichtextEditor";
export default RichTextEditor;
