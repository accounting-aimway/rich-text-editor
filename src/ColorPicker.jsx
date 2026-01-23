import React from "react";
import PropTypes from "prop-types";
import { Box, Popover, SvgIcon } from "@mui/material";

/**
 * Check icon for selected color
 */
const CheckIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Default color palette matching Figma design
 * 5 rows x 4 columns = 20 colors
 */
export const FIGMA_TEXT_COLORS = [
  // Row 1: Alert/Status colors + grey
  "#45bb36", // Success green
  "#f2b04f", // Warning orange
  "#ef5b5c", // Error red
  "#536886", // Grey/main
  // Row 2: Red, Pink, Purple shades
  "#f44336", // Red
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#673ab7", // Deep Purple
  // Row 3: Blue shades
  "#3f51b5", // Indigo
  "#2196f3", // Blue
  "#03a9f4", // Light Blue
  "#00bcd4", // Cyan
  // Row 4: Green shades
  "#009688", // Teal
  "#4caf50", // Green
  "#8bc34a", // Light Green
  "#cddc39", // Lime
  // Row 5: Yellow/Orange shades
  "#ffeb3b", // Yellow
  "#ffc107", // Amber
  "#ff9800", // Orange
  "#ff5722", // Deep Orange
];

/**
 * Determines if a color is light (for contrast calculation)
 * @param {string} hexColor - Hex color code
 * @returns {boolean} True if color is light
 */
const isLightColor = (hexColor) => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
};

/**
 * ColorPicker component
 * A popover with a grid of color swatches
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the popover is open
 * @param {HTMLElement} props.anchorEl - Anchor element for positioning
 * @param {Function} props.onClose - Callback when popover closes
 * @param {Function} props.onColorSelect - Callback when color is selected
 * @param {string} props.selectedColor - Currently selected color
 * @param {Array} props.colors - Array of color hex values
 */
export const ColorPicker = ({
  open,
  anchorEl,
  onClose,
  onColorSelect,
  selectedColor,
  colors = FIGMA_TEXT_COLORS,
}) => {
  const handleColorClick = (color) => {
    onColorSelect(color);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "8px",
            boxShadow: "0px 4px 16px 0px rgba(87, 104, 131, 0.2)",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          p: "8px",
          bgcolor: "white",
          borderRadius: "8px",
        }}
      >
        {/* Render rows of 4 colors each */}
        {Array.from({ length: Math.ceil(colors.length / 4) }, (_, rowIndex) => (
          <Box
            key={`row-${rowIndex}`}
            sx={{
              display: "flex",
              gap: "4px",
            }}
          >
            {colors.slice(rowIndex * 4, rowIndex * 4 + 4).map((color) => {
              const isSelected = selectedColor?.toLowerCase() === color.toLowerCase();
              const isLight = isLightColor(color);

              return (
                <Box
                  key={color}
                  onClick={() => handleColorClick(color)}
                  sx={{
                    position: "relative",
                    width: 32,
                    height: 32,
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: "1px solid #e5e8ec",
                    bgcolor: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.1s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {isSelected && (
                    <CheckIcon
                      sx={{
                        fontSize: 16,
                        color: isLight ? "rgba(0, 0, 0, 0.7)" : "white",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Popover>
  );
};

ColorPicker.propTypes = {
  /** Whether the popover is open */
  open: PropTypes.bool.isRequired,
  /** Anchor element for positioning */
  anchorEl: PropTypes.instanceOf(Element),
  /** Callback when popover closes */
  onClose: PropTypes.func.isRequired,
  /** Callback when color is selected */
  onColorSelect: PropTypes.func.isRequired,
  /** Currently selected color */
  selectedColor: PropTypes.string,
  /** Array of color hex values */
  colors: PropTypes.arrayOf(PropTypes.string),
};

ColorPicker.defaultProps = {
  anchorEl: null,
  selectedColor: "#536886",
  colors: FIGMA_TEXT_COLORS,
};
