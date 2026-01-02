# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Build for production (outputs to dist/)
yarn build

# Development with hot reload
yarn start
```

No test or lint scripts are configured.

## Architecture

This is an npm package that provides a rich text editor component built with Material-UI and contentEditable.

### Entry Point

`src/index.js` - Exports all public components and utilities:
- `RichTextEditor` (default export) - Main editor component
- `Toolbar` - Standalone toolbar component
- `LinkTooltip` - Link editing modal component
- Utility functions from `utils/editorsUtils.js`

### Core Components

**RichTextEditor** (`src/RichtextEditor.jsx`)
- Main component using contentEditable for text editing
- Manages editor state: focus, selection, link tooltip visibility, character count
- Integrates Toolbar and LinkTooltip components
- Uses `@mui/material/styles` for styled components
- Handles keyboard shortcuts (Ctrl/Cmd + B/I/U/K/S/E/Z/Y/[/])

**Toolbar** (`src/Toolbar.jsx`)
- Formatting controls using MUI IconButton and Select components
- Receives `onFormat` callback and current format state as props
- Groups: heading dropdown, text formatting, lists, indentation

**LinkTooltip** (`src/LinkTooltip.jsx`)
- Modal for inserting/editing hyperlinks
- Positioned relative to text selection
- Auto-prefixes URLs with `https://` if no protocol specified

### Utilities (`src/utils/editorsUtils.js`)

- `applyFormatting(command, value)` - Wraps `document.execCommand`
- `insertLink(url, range)` - Creates links with proper attributes (`target="_blank"`, `rel="noopener noreferrer"`)
- `getCurrentBlockFormat()` - Returns current block element type (h1-h6, p, blockquote)
- `countContentRealLength(html)` - Character count excluding HTML tags
- `getSelectionInfo()`, `removeLink()`, `isFormatActive()`, `insertHTML()`, `cleanHTML()`

### Build Configuration

Uses Rollup (`rollup.config.js`) to output:
- CommonJS: `dist/index.js`
- ESM: `dist/index.es.js`

Peer dependencies (React, ReactDOM, MUI) are externalized.

## Key Dependencies

- `@mui/material`, `@mui/icons-material` - UI components
- `@emotion/react`, `@emotion/styled` - Styling
- `prop-types` - Runtime type checking (no TypeScript)
