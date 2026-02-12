# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Build for production (outputs to dist/)
yarn build

# Development with hot reload
```

No test or lint scripts are configured. The `prepare` script runs `yarn build` automatically on `yarn install`.

## Architecture

This is an npm package (`@sonar/rich-text-editor`) providing a rich text editor component built with Material-UI and `contentEditable`. It uses `document.execCommand` for formatting operations and the Selection/Range API for cursor management.

### Entry Point

`src/index.js` - Exports all public components, utilities, and i18n functions. `RichTextEditor` is both a named and default export.

### Core Components

**RichTextEditor** (`src/RichtextEditor.jsx`) - Main component wrapping a `contentEditable` div with toolbar and link tooltip. Manages editor state (focus, selection, block/inline formats, character count). Handles keyboard shortcuts (Ctrl/Cmd + B/I/U/K/S/E/Z/Y/[/]). Supports i18n via `locale` prop or auto-detection from `<html lang>`.

**Toolbar** (`src/Toolbar.jsx`) - Configurable formatting controls. Tools are defined in the `TOOLBAR_TOOLS` map and organized into groups via `toolGroups` (left side) and `rightToolGroups` (right side) props. Contains custom SVG icon components matching Figma designs. Supports a `TooltipComponent` prop to override MUI's default Tooltip.

**LinkTooltip** (`src/LinkTooltip.jsx`) - Modal for inserting/editing hyperlinks, positioned relative to text selection. Auto-prefixes URLs with `https://`.

**ColorPicker** (`src/ColorPicker.jsx`) - Popover with a 5x4 grid of color swatches for text color. Exports `FIGMA_TEXT_COLORS` palette.

**CustomSelect** (`src/CustomSelect.jsx`) - Borderless dropdown matching Figma design, used for the heading format selector.

### i18n System (`src/i18n/`)

Auto-detects language from `<html lang>` attribute or `navigator.language`. Currently supports `en-US` and `de-DE`. Locale files in `src/i18n/locales/`. Translations cover toolbar titles, heading labels, link tooltip text, and editor placeholder.

### Utilities (`src/utils/editorsUtils.js`)

- `applyFormatting(command, value)` - Wraps `document.execCommand` with special handling for `formatBlock` inside lists
- `insertLink(url, range)` - Creates links with `target="_blank"` and `rel="noopener noreferrer"`
- `getCurrentBlockFormat()` - Returns current block element type (h1-h6, p, blockquote)
- `countContentRealLength(html)` - Character count excluding HTML tags
- `cleanupEditorHTML(editorElement)` - Fixes malformed HTML after block format changes
- `insertImage(src, options)` - Inserts image at cursor position
- `getSelectionInfo()`, `removeLink()`, `isFormatActive()`, `insertHTML()`, `cleanHTML()`

### Build Configuration

Uses Rollup (`rollup.config.js`) to output:

- CommonJS: `dist/index.js`
- ESM: `dist/index.es.js`

Peer dependencies (React 18/19, ReactDOM, MUI 6, Emotion, prop-types) are externalized.

## Key Patterns

- All components use `prop-types` for runtime type checking (no TypeScript).
- Styling uses MUI's `styled()` API and `sx` prop with design tokens from Figma.
- The editor relies on `document.execCommand` which is deprecated but still functional in browsers. Selection state is preserved/restored manually via the Range API (e.g., `storedRange` state in RichTextEditor).
- Components add `className="notranslate" translate="no"` to prevent browser auto-translation of toolbar UI.
