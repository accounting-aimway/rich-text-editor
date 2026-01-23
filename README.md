# Material-UI Rich Text Editor

A comprehensive rich text editor built with Material-UI components, featuring a fully configurable toolbar, link management, image insertion, text alignment, and keyboard shortcuts.

## Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Block Formatting**: Headings (H1-H6), paragraphs, lists
- **Text Alignment**: Left, center, right, justify
- **Image Insertion**: Insert images with base64 or custom upload handler
- **Link Management**: Insert, edit, and remove links with a modal interface
- **Configurable Toolbar**: Fully customizable toolbar - show only the tools you need
- **Keyboard Shortcuts**: Full keyboard support for common formatting operations
- **Character Counter**: Optional character limit with visual feedback
- **Responsive Design**: Clean, modern UI that adapts to different screen sizes
- **Theme Support**: Automatically adapts to MUI light/dark themes

## Installation

```bash
npm install material-ui-rich-editor
# or
yarn add material-ui-rich-editor
```

### Peer Dependencies

```bash
npm install react react-dom @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## Basic Usage

```jsx
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RichTextEditor } from "material-ui-rich-editor";

const theme = createTheme();

function App() {
  const [content, setContent] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <RichTextEditor
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
      />
    </ThemeProvider>
  );
}
```

## RichTextEditor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `""` | Name attribute for the editor |
| `value` | `string` | `""` | HTML content of the editor |
| `onChange` | `function` | `() => {}` | Callback when content changes. Receives `{ target: { name, value } }` |
| `onBlur` | `function` | `undefined` | Callback when editor loses focus |
| `placeholder` | `string` | `"Start typing..."` | Placeholder text when editor is empty |
| `maxChars` | `number` | `null` | Maximum character limit (excludes HTML tags) |
| `height` | `string \| number` | `"auto"` | Editor height |
| `minHeight` | `string \| number` | `"150px"` | Minimum editor height |
| `maxHeight` | `string \| number` | `null` | Maximum editor height (enables scrolling) |
| `sx` | `object` | `{}` | MUI sx prop for container styling |
| `style` | `object` | `undefined` | Inline styles for container |
| `toolGroups` | `array` | `DEFAULT_TOOL_GROUPS` | Configurable toolbar layout |
| `toolTitles` | `object` | `{}` | Custom tooltip titles for toolbar tools |
| `headingOptions` | `array` | Default headings | Custom heading dropdown options |
| `onImageUpload` | `function` | `undefined` | Custom image upload handler |
| `locale` | `string` | Auto-detected | Language code ("en", "de"). Auto-detects from `<html lang>` if not provided |
| `translations` | `object` | `{}` | Custom translations to override defaults |
| `TooltipComponent` | `React.ComponentType` | MUI Tooltip | Custom Tooltip component for toolbar buttons |
| `rightToolGroups` | `array` | `DEFAULT_RIGHT_TOOL_GROUPS` | Right-side toolbar tools (search, help) |
| `onSearch` | `function` | `undefined` | Callback when search button is clicked |
| `onHelp` | `function` | `undefined` | Callback when help button is clicked |
| `textColors` | `array` | `DEFAULT_TEXT_COLORS` | Custom color palette for text color picker |

## Custom Tooltip Component

You can pass a custom Tooltip component to replace the default MUI Tooltip for toolbar buttons. Your component must accept `title`, `placement`, and `children` props.

```jsx
import MessageActionsTooltip from "@/components/MessageActionsTooltip";

<RichTextEditor
  value={content}
  onChange={handleChange}
  TooltipComponent={MessageActionsTooltip}
/>
```

### Custom Tooltip Example

```jsx
import { Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    fontSize: "14px",
  },
}));

<RichTextEditor
  value={content}
  onChange={handleChange}
  TooltipComponent={CustomTooltip}
/>
```

## Configurable Toolbar

The toolbar is fully configurable using the `toolGroups` prop. Pass an array of tool group arrays to customize which tools appear and how they're grouped. Each group is separated by a divider.

### Available Tools

| Tool Key | Description | Keyboard Shortcut |
|----------|-------------|-------------------|
| `undo` | Undo last action | Ctrl/Cmd+Z |
| `redo` | Redo last action | Ctrl+Y / Cmd+Shift+Z |
| `heading` | Heading/paragraph dropdown | - |
| `bold` | Bold text | Ctrl+B |
| `italic` | Italic text | Ctrl+I |
| `underline` | Underline text | Ctrl+U |
| `strikethrough` | Strikethrough text | Ctrl+S |
| `textColor` | Text color picker | - |
| `link` | Insert/edit link | Ctrl+K |
| `clearFormat` | Remove formatting | Ctrl+E |
| `bulletList` | Bullet list | - |
| `numberedList` | Numbered list | - |
| `outdent` | Decrease indent | Ctrl+[ |
| `indent` | Increase indent | Ctrl+] |
| `alignLeft` | Left align | - |
| `alignCenter` | Center align | - |
| `alignRight` | Right align | - |
| `alignJustify` | Justify | - |
| `image` | Insert image | - |
| `search` | Search in content | - |
| `help` | Help/info button | - |

### Default Toolbar Configuration

```jsx
import { DEFAULT_TOOL_GROUPS, DEFAULT_RIGHT_TOOL_GROUPS } from "material-ui-rich-editor";

// DEFAULT_TOOL_GROUPS (left side):
[
  ["heading"],
  ["bold", "italic", "underline"],
  ["textColor", "strikethrough"],
  ["bulletList", "numberedList"],
  ["outdent", "indent"],
  ["alignLeft", "alignCenter", "alignRight"],
  ["image", "link"],
  ["undo", "redo"],
]

// DEFAULT_RIGHT_TOOL_GROUPS (right side):
[
  ["search", "help"],
]
```

### Custom Toolbar Examples

#### Basic Text Formatting Only

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  toolGroups={[
    ["bold", "italic", "underline"],
  ]}
/>
```

#### Without Image and Alignment

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  toolGroups={[
    ["heading"],
    ["bold", "italic", "underline", "link"],
    ["bulletList", "numberedList"],
    ["outdent", "indent"],
  ]}
/>
```

#### Minimal Editor

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  toolGroups={[
    ["bold", "italic", "link"],
  ]}
/>
```

#### Full Featured with Custom Grouping

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  toolGroups={[
    ["heading"],
    ["bold", "italic", "underline", "strikethrough"],
    ["link", "image"],
    ["alignLeft", "alignCenter", "alignRight"],
    ["bulletList", "numberedList"],
    ["clearFormat"],
  ]}
/>
```

## Custom Tooltips

Customize the tooltip text for any toolbar button using the `toolTitles` prop:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  toolTitles={{
    bold: "Make text bold",
    italic: "Make text italic",
    link: "Add a hyperlink",
    image: "Upload an image",
    alignCenter: "Center align text",
  }}
/>
```

### Default Tooltip Titles

```jsx
import { DEFAULT_TOOL_TITLES } from "material-ui-rich-editor";

// DEFAULT_TOOL_TITLES equals:
{
  undo: "Undo (Ctrl/Cmd+Z)",
  redo: "Redo (Ctrl+Y / Cmd+Shift+Z)",
  bold: "Bold (Ctrl+B)",
  italic: "Italic (Ctrl+I)",
  underline: "Underline (Ctrl+U)",
  strikethrough: "Strikethrough (Ctrl+S)",
  link: "Insert Link (Ctrl+K)",
  clearFormat: "Remove Formatting (Ctrl+E)",
  bulletList: "Bullet List",
  numberedList: "Numbered List",
  outdent: "Decrease Indent",
  indent: "Increase Indent",
  alignLeft: "Align Left",
  alignCenter: "Align Center",
  alignRight: "Align Right",
  alignJustify: "Justify",
  image: "Insert Image",
}
```

## Custom Heading Options

Customize the heading dropdown options using the `headingOptions` prop:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  headingOptions={[
    { value: "h1", label: "Title" },
    { value: "h2", label: "Subtitle" },
    { value: "p", label: "Body Text" },
  ]}
/>
```

## Image Upload

### Default Behavior (Base64)

By default, images are converted to base64 and embedded directly in the HTML content:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  toolGroups={[["bold", "italic", "image"]]}
/>
```

### Custom Upload Handler

For server-side uploads, provide an `onImageUpload` handler:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  onImageUpload={async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const { url } = await response.json();
    // Handle the returned URL as needed
  }}
/>
```

## Character Limit

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  maxChars={500}
/>
```

The character counter appears at the bottom-right and turns red when the limit is exceeded.

## Text Color

The text color tool provides a color picker dropdown:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  textColors={[
    "#000000", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#808080",
  ]}
/>
```

## Search and Help

The search and help buttons appear on the right side of the toolbar. Provide callbacks to handle their actions:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  onSearch={() => {
    // Open search dialog or implement search functionality
    console.log("Search clicked");
  }}
  onHelp={() => {
    // Open help documentation or show keyboard shortcuts
    console.log("Help clicked");
  }}
/>
```

To hide the right-side tools:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  rightToolGroups={[]}  // Empty array hides right-side tools
/>
```

## Internationalization (i18n)

The editor supports full internationalization with automatic language detection. It currently supports **English (en-US)** and **German (de-DE)**.

### Automatic Language Detection

The editor automatically detects the language from your application:

1. First, it checks the `<html lang="...">` attribute (recommended)
2. Then falls back to `navigator.language`
3. Defaults to English if no supported language is detected

Both full locale codes (e.g., `de-DE`, `en-US`) and short codes (e.g., `de`, `en`) are supported for compatibility with i18next and other i18n libraries.

```html
<!-- Set this in your HTML to auto-detect German -->
<html lang="de-DE">
<!-- Or use short code -->
<html lang="de">
```

The editor will automatically use German translations when `lang="de"` or `lang="de-DE"` is set.

### Explicit Locale

You can also explicitly set the locale:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  locale="de-DE"  // Force German translations (or use "de")
/>
```

### Custom Translation Overrides

Override specific translations while keeping the rest:

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  translations={{
    toolbar: {
      bold: "Custom Bold Text",
    },
    editor: {
      placeholder: "Custom placeholder...",
    },
  }}
/>
```

### Default Translations Structure

```jsx
import { defaultTranslations } from "material-ui-rich-editor";

// defaultTranslations equals:
{
  toolbar: {
    undo: "Undo (Ctrl/Cmd+Z)",
    redo: "Redo (Ctrl+Y / Cmd+Shift+Z)",
    bold: "Bold (Ctrl+B)",
    italic: "Italic (Ctrl+I)",
    underline: "Underline (Ctrl+U)",
    strikethrough: "Strikethrough (Ctrl+S)",
    link: "Insert Link (Ctrl+K)",
    clearFormat: "Remove Formatting (Ctrl+E)",
    bulletList: "Bullet List",
    numberedList: "Numbered List",
    outdent: "Decrease Indent",
    indent: "Increase Indent",
    alignLeft: "Align Left",
    alignCenter: "Align Center",
    alignRight: "Align Right",
    alignJustify: "Justify",
    image: "Insert Image",
  },
  headings: {
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    p: "Paragraph",
  },
  linkTooltip: {
    insertTitle: "Insert Link",
    editTitle: "Edit Link",
    placeholder: "Enter URL (e.g., https://example.com)",
    insert: "Insert",
    update: "Update",
    cancel: "Cancel",
    remove: "Remove",
  },
  editor: {
    placeholder: "Start typing...",
  },
}
```

### Helper Functions

```jsx
import {
  defaultTranslations,
  createTranslator,
  getToolbarTitles,
  getHeadingOptions,
} from "material-ui-rich-editor";

// Create a translator function for custom translations
const t = createTranslator({
  toolbar: { bold: "Fett" },
});
console.log(t("toolbar.bold")); // "Fett"
console.log(t("toolbar.italic")); // "Italic (Ctrl+I)" (fallback to default)

// Get toolbar titles merged with custom translations
const titles = getToolbarTitles({ toolbar: { bold: "Fett" } });

// Get heading options from translations
const headings = getHeadingOptions({ headings: { h1: "Titel" } });
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Bold |
| `Ctrl/Cmd + I` | Italic |
| `Ctrl/Cmd + U` | Underline |
| `Ctrl/Cmd + S` | Strikethrough |
| `Ctrl/Cmd + K` | Insert Link |
| `Ctrl/Cmd + E` | Remove Formatting |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl + Y` or `Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + ]` | Indent |
| `Ctrl/Cmd + [` | Outdent |
| `Escape` | Close link tooltip |

## Exports

```jsx
import RichTextEditor, {
  // Components
  Toolbar,
  LinkTooltip,
  CustomSelect,

  // Toolbar configuration
  TOOLBAR_TOOLS,
  DEFAULT_TOOL_GROUPS,
  DEFAULT_TOOL_TITLES,
  DEFAULT_RIGHT_TOOL_GROUPS,
  DEFAULT_TEXT_COLORS,

  // i18n utilities
  defaultTranslations,
  locales,
  supportedLanguages,
  detectLanguage,
  getTranslations,
  getAutoTranslations,
  createTranslator,
  getToolbarTitles,
  getHeadingOptions,
  enUS,  // English (US) translations
  deDE,  // German (Germany) translations

  // Utility functions
  applyFormatting,
  insertLink,
  insertImage,
  insertHTML,
  removeLink,
  getSelectionInfo,
  getCurrentBlockFormat,
  isFormatActive,
  countContentRealLength,
  cleanHTML,
} from "material-ui-rich-editor";
```

## Standalone Toolbar

You can use the Toolbar component separately:

```jsx
import { Toolbar } from "material-ui-rich-editor";

<Toolbar
  onFormat={(command, value) => {
    // Handle formatting command
  }}
  toolGroups={[["bold", "italic", "underline"]]}
  currentBlockFormat="p"
  currentInlineFormats={{
    bold: false,
    italic: true,
    underline: false,
  }}
/>
```

### Toolbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFormat` | `function` | **required** | Callback for formatting commands |
| `toolGroups` | `array` | `DEFAULT_TOOL_GROUPS` | Array of tool group arrays |
| `toolTitles` | `object` | `{}` | Custom tooltip titles (overrides defaults) |
| `headingOptions` | `array` | Default headings | Custom heading dropdown options |
| `currentBlockFormat` | `string` | `"p"` | Current block format (h1-6, p) |
| `currentInlineFormats` | `object` | `{}` | Current inline format states |
| `onImageUpload` | `function` | `undefined` | Custom image upload handler |
| `translations` | `object` | `{}` | Custom translations for i18n support |
| `TooltipComponent` | `React.ComponentType` | MUI Tooltip | Custom Tooltip component for buttons |

## Theming

The editor automatically adapts to your MUI theme:

```jsx
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

<ThemeProvider theme={darkTheme}>
  <RichTextEditor value={content} onChange={handleChange} />
</ThemeProvider>
```

## Styling

### Using sx prop

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  sx={{
    border: "2px solid #1976d2",
    borderRadius: "8px",
  }}
/>
```

### Using style prop

```jsx
<RichTextEditor
  value={content}
  onChange={handleChange}
  style={{
    maxWidth: "800px",
    margin: "0 auto",
  }}
/>
```

## Development

```bash
# Install dependencies
yarn install

# Start development server with hot reload
yarn start

# Build for production
yarn build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
