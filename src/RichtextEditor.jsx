import React, { useCallback, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Divider } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  applyFormatting,
  insertLink,
  countContentRealLength,
  getCurrentBlockFormat,
  insertImage,
  cleanupEditorHTML,
} from "./utils/editorsUtils";
import { LinkTooltip } from "./LinkTooltip";
import {
  Toolbar,
  DEFAULT_TOOL_GROUPS,
  DEFAULT_RIGHT_TOOL_GROUPS,
  DEFAULT_TEXT_COLORS,
} from "./Toolbar";
import { getAutoTranslations, getTranslations } from "./i18n";

/**
 * Design tokens from Figma
 */
const designTokens = {
  colors: {
    borderPrimary: "#0b89d1",
    textDefault: "#536886",
    textPrimary: "#0b89d1",
    surfaceBase: "#ffffff",
  },
  spacing: {
    spacing1: "8px",
    spacing1_5: "12px",
  },
  borderRadius: "4px",
  typography: {
    inputText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "24px",
    },
    inputLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "16px",
    },
  },
};

/**
 * Styled editor component with rich text formatting styles
 */
const StyledEditor = styled(Box)(({ theme }) => ({
  padding: `${designTokens.spacing.spacing1} ${designTokens.spacing.spacing1_5}`,
  paddingTop: theme.spacing(0),
  outline: "none",
  fontFamily: designTokens.typography.inputText.fontFamily,
  fontSize: designTokens.typography.inputText.fontSize,
  fontWeight: designTokens.typography.inputText.fontWeight,
  lineHeight: designTokens.typography.inputText.lineHeight,
  color: theme.palette.text.primary,
  "& p": {
    margin: `${theme.spacing(1)}px 0`,
    "&:first-of-type": { marginTop: 0 },
    "&:last-of-type": { marginBottom: 0 },
  },
  "& h1": {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: `${theme.spacing(1.5)}px 0`,
  },
  "& h2": {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: `${theme.spacing(1)}px 0`,
  },
  "& h3": {
    fontSize: "1.25rem",
    fontWeight: "bold",
    margin: `${theme.spacing(1)}px 0`,
  },
  "& ul": {
    listStyle: "disc",
    paddingLeft: theme.spacing(3),
    margin: `${theme.spacing(1)}px 0`,
  },
  "& ol": {
    listStyle: "decimal",
    paddingLeft: theme.spacing(3),
    margin: `${theme.spacing(1)}px 0`,
  },
  "& li": {
    margin: `${theme.spacing(0.5)}px 0`,
  },
  "& blockquote": {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: theme.spacing(2),
    fontStyle: "italic",
    margin: `${theme.spacing(2)}px 0`,
    color: theme.palette.text.secondary,
  },
  "& a": {
    color: theme.palette.primary.main,
    textDecoration: "underline",
    "&:hover": {
      opacity: 0.8,
    },
  },
  "& strong": { fontWeight: "bold" },
  "& em": { fontStyle: "italic" },
  "& u": { textDecoration: "underline" },
  "& img": {
    maxWidth: "100%",
    height: "auto",
    display: "block",
    margin: "8px 0",
    borderRadius: "4px",
  },
}));

/**
 * RichTextEditor component
 * A full-featured rich text editor with toolbar and link management
 */
export const RichTextEditor = ({
  name = "",
  value = "",
  onChange = () => {},
  onBlur,
  placeholder,
  maxChars = null,
  height = "auto",
  minHeight = "150px",
  maxHeight = null,
  sx = {},
  style,
  toolGroups = DEFAULT_TOOL_GROUPS,
  toolTitles = {},
  headingOptions,
  onImageUpload,
  locale,
  translations = {},
  TooltipComponent,
  rightToolGroups = DEFAULT_RIGHT_TOOL_GROUPS,
  onSearch,
  onHelp,
  textColors = DEFAULT_TEXT_COLORS,
}) => {
  // Get MUI theme from parent
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Get base translations - either from specified locale or auto-detected
  const baseTranslations = locale
    ? getTranslations(locale)
    : getAutoTranslations();

  // Merge custom translations with base translations
  const mergedTranslations = {
    ...baseTranslations,
    ...translations,
    toolbar: { ...baseTranslations.toolbar, ...(translations.toolbar || {}) },
    headings: {
      ...baseTranslations.headings,
      ...(translations.headings || {}),
    },
    linkTooltip: {
      ...baseTranslations.linkTooltip,
      ...(translations.linkTooltip || {}),
    },
    editor: { ...baseTranslations.editor, ...(translations.editor || {}) },
  };

  // Get placeholder from prop or translations
  const resolvedPlaceholder =
    placeholder || mergedTranslations.editor.placeholder;

  // Refs for DOM elements
  const editorRef = useRef(null);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  // State management
  const [showLinkTooltip, setShowLinkTooltip] = useState(false);
  const [linkTooltipPosition, setLinkTooltipPosition] = useState({
    x: 0,
    y: 0,
  });
  const [currentLink, setCurrentLink] = useState("");
  const [charLeft, setCharLeft] = useState(
    maxChars ? countContentRealLength(value) : null,
  );
  const [isLinkEdit, setIsLinkEdit] = useState(false);
  const [storedRange, setStoredRange] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [currentBlockFormat, setCurrentBlockFormat] = useState("p");
  const [isEmpty, setIsEmpty] = useState(() => {
    return !value || value === "<br>" || value === "<p><br></p>";
  });

  // Current inline format states
  const [currentInlineFormats, setCurrentInlineFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    link: false,
    unorderedList: false,
    orderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
    // Update isEmpty state when value prop changes
    const contentEmpty = !value || value === "<br>" || value === "<p><br></p>";
    setIsEmpty(contentEmpty);
  }, [value]);

  /**
   * Update current block format
   */
  const updateCurrentBlockFormat = useCallback(() => {
    if (editorRef.current) {
      setCurrentBlockFormat(getCurrentBlockFormat());
    }
  }, []);

  // Initialize block format on mount
  useEffect(() => {
    updateCurrentBlockFormat();
  }, [updateCurrentBlockFormat]);

  /**
   * Handle input changes in the editor
   */
  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      const html = editorRef.current.innerHTML;
      if (maxChars) {
        const charLeftLength = countContentRealLength(html);
        setCharLeft(charLeftLength);
      }
      // Update isEmpty state
      const contentEmpty = !html || html === "<br>" || html === "<p><br></p>";
      setIsEmpty(contentEmpty);
      onChange({ target: { name, value: html } });
      updateCurrentBlockFormat();
      updateCurrentInlineFormats();
    }
  }, [
    onChange,
    name,
    maxChars,
    updateCurrentBlockFormat,
    updateCurrentInlineFormats,
  ]);

  /**
   * Handle formatting commands from toolbar
   * @param {string} command - The formatting command
   * @param {string} value - Optional value for the command
   */
  const handleFormat = useCallback(
    (command, value) => {
      if (command === "createLink") {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          const range = selection.getRangeAt(0).cloneRange();
          setStoredRange(range);
          const rect = range.getBoundingClientRect();
          const editorRect = editorRef.current?.getBoundingClientRect();
          if (editorRect) {
            setLinkTooltipPosition({
              x: rect.left - editorRect.left + rect.width / 2,
              y: rect.bottom - editorRect.top + 5,
            });
            setCurrentLink("");
            setIsLinkEdit(false);
            setShowLinkTooltip(true);
          }
        } else {
          const range = selection?.getRangeAt(0);
          if (range) {
            setStoredRange(range.cloneRange());
            const rect = range.getBoundingClientRect();
            const editorRect = editorRef.current?.getBoundingClientRect();
            if (editorRect) {
              setLinkTooltipPosition({
                x: rect.left - editorRect.left,
                y: rect.bottom - editorRect.top + 5,
              });
              setCurrentLink("");
              setIsLinkEdit(false);
              setShowLinkTooltip(true);
            }
          }
        }
        return;
      }

      if (command === "removeFormat") {
        document.execCommand("removeFormat", false, null);
        handleInput();
        return;
      }

      if (command === "insertImage") {
        insertImage(value);
        handleInput();
        return;
      }

      applyFormatting(command, value);

      // Clean up malformed HTML after block format changes
      if (command === "formatBlock") {
        cleanupEditorHTML(editorRef.current);
      }

      editorRef.current?.focus();
      handleInput();
      updateCurrentBlockFormat();
      updateCurrentInlineFormats();
    },
    [handleInput, updateCurrentInlineFormats, updateCurrentBlockFormat],
  );

  /**
   * Handle link submission from tooltip
   * @param {string} url - The URL to insert
   */
  const handleLinkSubmit = useCallback(
    (url) => {
      insertLink(url, storedRange || undefined);
      setShowLinkTooltip(false);
      setStoredRange(null);
      handleInput();
    },
    [handleInput, storedRange],
  );

  /**
   * Handle clicks on links for editing
   * @param {MouseEvent} e - Click event
   */
  const handleClick = useCallback((e) => {
    const target = e.target;
    if (target.tagName === "A") {
      e.preventDefault();
      const range = document.createRange();
      range.selectNode(target);
      setStoredRange(range);
      const rect = target.getBoundingClientRect();
      const editorRect = editorRef.current?.getBoundingClientRect();
      if (editorRect) {
        setLinkTooltipPosition({
          x: rect.left - editorRect.left + rect.width / 2,
          y: rect.bottom - editorRect.top + 5,
        });
        setCurrentLink(target.getAttribute("href") || "");
        setIsLinkEdit(true);
        setShowLinkTooltip(true);
      }
    } else {
      setShowLinkTooltip(false);
    }
  }, []);

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            handleFormat("bold");
            break;
          case "i":
            e.preventDefault();
            handleFormat("italic");
            break;
          case "u":
            e.preventDefault();
            handleFormat("underline");
            break;
          case "k":
            e.preventDefault();
            handleFormat("createLink");
            break;
          case "s":
            e.preventDefault();
            handleFormat("strikeThrough");
            break;
          case "e":
            e.preventDefault();
            handleFormat("removeFormat");
            break;
          case "z":
            e.preventDefault();
            // Cmd+Shift+Z or Ctrl+Shift+Z = Redo, Cmd+Z or Ctrl+Z = Undo
            if (e.shiftKey) {
              handleFormat("redo");
            } else {
              handleFormat("undo");
            }
            break;
          case "y":
            // Ctrl+Y = Redo (Windows/Linux)
            e.preventDefault();
            handleFormat("redo");
            break;
          case "]":
            e.preventDefault();
            handleFormat("indent");
            break;
          case "[":
            e.preventDefault();
            handleFormat("outdent");
            break;
        }
      }

      if (e.key === "Escape") {
        setShowLinkTooltip(false);
        setStoredRange(null);
      }
    },
    [handleFormat],
  );

  /**
   * Update current inline format states
   */
  const updateCurrentInlineFormats = useCallback(() => {
    updateCurrentBlockFormat();
    const selection = document.getSelection();
    if (!selection || !editorRef.current) return;
    if (!editorRef.current.contains(selection.anchorNode)) return;

    setCurrentInlineFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      link: document.queryCommandState("createLink"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      orderedList: document.queryCommandState("insertOrderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
    });
  }, [updateCurrentBlockFormat]);

  // Add event listeners for selection changes
  // Note: selectionchange is a document-level event, not element-level
  useEffect(() => {
    const updateFormats = () => {
      updateCurrentBlockFormat();
      updateCurrentInlineFormats();
    };

    document.addEventListener("selectionchange", updateFormats);

    return () => {
      document.removeEventListener("selectionchange", updateFormats);
    };
  }, [updateCurrentBlockFormat, updateCurrentInlineFormats]);

  return (
    <Box
      ref={containerRef}
      tabIndex={-1}
      sx={{
        border: `1px solid ${maxChars && charLeft > maxChars ? theme.palette.error.main : theme.palette.primary.main}`,
        borderRadius: designTokens.borderRadius,
        "&:focus-within": {
          borderColor:
            maxChars && charLeft > maxChars
              ? theme.palette.error.main
              : theme.palette.primary.main,
        },
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        fontFamily: designTokens.typography.inputText.fontFamily,
        ...sx,
      }}
      style={style}
      onBlur={() => {
        const active = document.activeElement;
        if (containerRef.current?.contains(active)) return;
        setIsFocused(false);
        if (typeof onBlur === "function") {
          onBlur({ target: { value: editorRef.current?.innerHTML } });
        }
      }}
    >
      {/* Toolbar */}
      <Toolbar
        onFormat={handleFormat}
        toolGroups={toolGroups}
        toolTitles={toolTitles}
        headingOptions={headingOptions}
        currentBlockFormat={currentBlockFormat}
        currentInlineFormats={currentInlineFormats}
        onImageUpload={onImageUpload}
        translations={mergedTranslations}
        TooltipComponent={TooltipComponent}
        rightToolGroups={rightToolGroups}
        onSearch={onSearch}
        onHelp={onHelp}
        textColors={textColors}
        disabled={!isFocused}
      />
      {/* Divider between toolbar and editor */}
      <Divider sx={{ borderColor: theme.palette.divider }} />
      {/* Editor content area */}
      <Box style={{ position: "relative" }}>
        <StyledEditor
          ref={editorRef}
          contentEditable
          className="notranslate"
          translate="no"
          onFocus={() => setIsFocused(true)}
          onInput={handleInput}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          sx={{
            minHeight,
            height,
            maxHeight,
            overflowY: maxHeight ? "auto" : undefined,
          }}
          suppressContentEditableWarning
        />

        {/* Placeholder text */}
        {isEmpty && !isFocused && (
          <Box
            sx={{
              position: "absolute",
              top: designTokens.spacing.spacing1,
              left: designTokens.spacing.spacing1_5,
              color: theme.palette.text.secondary,
              pointerEvents: "none",
              userSelect: "none",
              fontFamily: designTokens.typography.inputText.fontFamily,
              fontSize: designTokens.typography.inputText.fontSize,
              lineHeight: designTokens.typography.inputText.lineHeight,
            }}
          >
            {resolvedPlaceholder}
          </Box>
        )}

        {/* Link tooltip */}
        {showLinkTooltip && (
          <LinkTooltip
            position={linkTooltipPosition}
            onSubmit={handleLinkSubmit}
            onClose={() => {
              setShowLinkTooltip(false);
              setStoredRange(null);
            }}
            initialValue={currentLink}
            isEdit={isLinkEdit}
            tooltipRef={tooltipRef}
            storedRange={storedRange}
            translations={mergedTranslations.linkTooltip}
          />
        )}

        {/* Character counter - styled as floating label */}
        {maxChars && (
          <Box
            sx={{
              position: "absolute",
              bottom: "-1px",
              right: "11px",
              height: "2px",
              display: "flex",
              alignItems: "center",
              padding: "0 4px",
              background: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                color:
                  charLeft > maxChars
                    ? theme.palette.error.main
                    : theme.palette.primary.main,
                fontFamily: designTokens.typography.inputLabel.fontFamily,
                fontSize: designTokens.typography.inputLabel.fontSize,
                fontWeight: designTokens.typography.inputLabel.fontWeight,
                lineHeight: designTokens.typography.inputLabel.lineHeight,
                whiteSpace: "nowrap",
              }}
            >
              {`${charLeft}/${maxChars}`}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// PropTypes for type checking
RichTextEditor.propTypes = {
  /** Name attribute for the editor */
  name: PropTypes.string,
  /** Current value of the editor */
  value: PropTypes.string,
  /** Callback function when content changes */
  onChange: PropTypes.func,
  /** Callback function when editor loses focus */
  onBlur: PropTypes.func,
  /** Placeholder text when editor is empty */
  placeholder: PropTypes.string,
  /** Maximum number of characters allowed */
  maxChars: PropTypes.number,
  /** Height of the editor */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Minimum height of the editor */
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Maximum height of the editor */
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Additional styles for the container */
  sx: PropTypes.object,
  /** Additional inline styles */
  style: PropTypes.object,
  /** Array of tool group arrays defining which toolbar tools to show */
  toolGroups: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  /** Custom tooltip titles for toolbar tools */
  toolTitles: PropTypes.objectOf(PropTypes.string),
  /** Custom heading dropdown options */
  headingOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  /** Custom image upload handler - receives File object */
  onImageUpload: PropTypes.func,
  /** Locale code for translations (e.g., "en", "de"). Auto-detected if not provided. */
  locale: PropTypes.string,
  /** Custom translations to override defaults */
  translations: PropTypes.shape({
    toolbar: PropTypes.object,
    headings: PropTypes.object,
    linkTooltip: PropTypes.object,
    editor: PropTypes.object,
  }),
  /** Custom Tooltip component to use instead of MUI Tooltip */
  TooltipComponent: PropTypes.elementType,
  /** Array of tool group arrays for right side of toolbar */
  rightToolGroups: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  /** Callback when search button is clicked */
  onSearch: PropTypes.func,
  /** Callback when help button is clicked */
  onHelp: PropTypes.func,
  /** Custom color palette for text color picker */
  textColors: PropTypes.arrayOf(PropTypes.string),
};

// Default props
RichTextEditor.defaultProps = {
  name: "",
  value: "",
  onChange: () => {},
  onBlur: undefined,
  placeholder: undefined,
  maxChars: null,
  height: "auto",
  minHeight: "150px",
  maxHeight: null,
  sx: {},
  style: undefined,
  toolGroups: DEFAULT_TOOL_GROUPS,
  toolTitles: {},
  headingOptions: undefined,
  onImageUpload: undefined,
  locale: undefined,
  translations: {},
  TooltipComponent: undefined,
  rightToolGroups: DEFAULT_RIGHT_TOOL_GROUPS,
  onSearch: undefined,
  onHelp: undefined,
  textColors: DEFAULT_TEXT_COLORS,
};
