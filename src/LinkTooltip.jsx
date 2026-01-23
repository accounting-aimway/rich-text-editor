import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAutoTranslations } from "./i18n";

/**
 * LinkTooltip component for inserting and editing links
 * Provides a modal-like interface for link management
 */
export const LinkTooltip = ({
  position,
  onSubmit,
  onClose,
  initialValue = "",
  isEdit = false,
  tooltipRef,
  storedRange,
  translations = {},
}) => {
  // Get auto-detected translations and merge with custom translations
  const baseTranslations = getAutoTranslations().linkTooltip;
  const t = { ...baseTranslations, ...translations };
  const [url, setUrl] = useState(initialValue);
  const inputRef = useRef(null);

  // Focus and select input when component mounts or initialValue changes
  useEffect(() => {
    setUrl(initialValue);
    // Focus the input after a brief delay to ensure it's rendered
    setTimeout(() => {
      if (inputRef.current && typeof inputRef.current.focus === "function") {
        inputRef.current.focus();
      }
      if (inputRef.current && typeof inputRef.current.select === "function") {
        inputRef.current.select();
      }
    }, 50);
  }, [initialValue]);

  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      let formattedUrl = url.trim();
      // Add https:// if no protocol is specified
      if (!formattedUrl.match(/^https?:\/\//)) {
        formattedUrl = "https://" + formattedUrl;
      }
      onSubmit(formattedUrl);
    }
  };

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  /**
   * Handle link removal
   * Restores selection and removes the link
   */
  const handleRemoveLink = () => {
    if (storedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(storedRange);
    }
    document.execCommand("unlink");
    onClose();
  };

  return (
    <Paper
      elevation={0}
      ref={tooltipRef}
      sx={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: "translateX(-50%)",
        zIndex: 1000,
        p: "48px",
        minWidth: 430,
        maxWidth: 450,
        borderRadius: "16px",
        boxShadow: "0px 4px 16px 0px rgba(87, 104, 131, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Header with title and close button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "24px",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "32px",
            color: "#536886",
            flex: 1,
          }}
        >
          {isEdit ? t.editTitle : t.insertTitle}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            p: "4px",
            borderRadius: "4px",
            color: "#536886",
            "&:hover": {
              backgroundColor: "rgba(83, 104, 134, 0.08)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      {/* URL Input */}
      <TextField
        inputRef={inputRef}
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.placeholder}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            height: "40px",
            borderRadius: "4px",
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            lineHeight: "24px",
            color: "#536886",
            "& fieldset": {
              borderColor: "#e5e8ec",
            },
            "&:hover fieldset": {
              borderColor: "#0b89d1",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0b89d1",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 12px",
          },
        }}
      />

      {/* Action buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "16px",
          width: "100%",
        }}
      >
        {isEdit && (
          <Button
            type="button"
            onClick={handleRemoveLink}
            sx={{
              backgroundColor: "#def3ff",
              color: "#0b89d1",
              fontFamily: "Roboto, sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "16px",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "12px 16px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#c5e8fc",
              },
            }}
          >
            {t.remove}
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!url.trim()}
          sx={{
            backgroundColor: "#0b89d1",
            color: "#ffffff",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "16px",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            padding: "12px 16px",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#0976b5",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(11, 137, 209, 0.5)",
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}
        >
          {isEdit ? t.update : t.insert}
        </Button>
      </Box>
    </Paper>
  );
};

// PropTypes for type checking
LinkTooltip.propTypes = {
  /** Position object with x and y coordinates */
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  /** Callback function when link is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Callback function when tooltip is closed */
  onClose: PropTypes.func.isRequired,
  /** Initial URL value for the input field */
  initialValue: PropTypes.string,
  /** Whether the tooltip is in edit mode */
  isEdit: PropTypes.bool,
  /** Ref for the tooltip container */
  tooltipRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  /** Stored range for link editing */
  storedRange: PropTypes.object,
  /** Custom translations for the link tooltip */
  translations: PropTypes.shape({
    insertTitle: PropTypes.string,
    editTitle: PropTypes.string,
    placeholder: PropTypes.string,
    insert: PropTypes.string,
    update: PropTypes.string,
    cancel: PropTypes.string,
    remove: PropTypes.string,
  }),
};

// Default props
LinkTooltip.defaultProps = {
  initialValue: "",
  isEdit: false,
  tooltipRef: null,
  storedRange: null,
  translations: {},
};
