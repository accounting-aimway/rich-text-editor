import React, { useCallback, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  applyFormatting,
  insertLink,
  countContentRealLength,
  getCurrentBlockFormat,
} from "./utils/editorsUtils";
import { LinkTooltip } from "./LinkTooltip";
import { Toolbar } from "./Toolbar";

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
  placeholder = "Start typing...",
  maxChars = null,
  height = "auto",
  minHeight = "150px",
  maxHeight = null,
  sx = {},
  style,
}) => {
  // Get MUI theme from parent
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

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
    maxChars ? countContentRealLength(value) : null
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

      applyFormatting(command, value);
      editorRef.current?.focus();
      handleInput();
      updateCurrentBlockFormat();
      updateCurrentInlineFormats();
    },
    [handleInput, updateCurrentInlineFormats, updateCurrentBlockFormat]
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
    [handleInput, storedRange]
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
            handleFormat("undo");
            break;
          case "y":
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
    [handleFormat]
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
          borderColor: maxChars && charLeft > maxChars ? theme.palette.error.main : theme.palette.primary.main,
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
        showStrikethrough
        showCleanFormat
        currentBlockFormat={currentBlockFormat}
        currentInlineFormats={currentInlineFormats}
      />

      {/* Editor content area */}
      <Box style={{ position: "relative" }}>
        <StyledEditor
          ref={editorRef}
          contentEditable
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
            {placeholder}
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
};

// Default props
RichTextEditor.defaultProps = {
  name: "",
  value: "",
  onChange: () => {},
  onBlur: undefined,
  placeholder: "Start typing...",
  maxChars: null,
  height: "auto",
  minHeight: "150px",
  maxHeight: null,
  sx: {},
  style: undefined,
};
