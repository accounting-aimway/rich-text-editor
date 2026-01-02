import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Popover, MenuItem } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

/**
 * Design tokens from Figma (node-id: 32:54592)
 */
const tokens = {
  spacing: {
    spacing0_5: "4px",
    spacing1: "8px",
  },
  radius: {
    small: "4px",
  },
  typography: {
    inputText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "24px",
    },
  },
};

/**
 * Styled container matching Figma design (node-id: 32:54592)
 */
const SelectContainer = styled(Box)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const SelectInput = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  paddingLeft: tokens.spacing.spacing1,
  paddingRight: 0,
  borderRadius: tokens.radius.small,
  cursor: "pointer",
});

const DataContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  gap: tokens.spacing.spacing0_5,
});

const ContentContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: tokens.spacing.spacing1,
  overflow: "hidden",
  padding: `${tokens.spacing.spacing0_5} 0`,
});

const ValueText = styled("span")(({ theme }) => ({
  fontFamily: tokens.typography.inputText.fontFamily,
  fontSize: tokens.typography.inputText.fontSize,
  fontWeight: tokens.typography.inputText.fontWeight,
  lineHeight: tokens.typography.inputText.lineHeight,
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const ButtonContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: `0 ${tokens.spacing.spacing0_5}`,
});

const IconWrapper = styled(Box)(({ open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "32px",
  padding: `${tokens.spacing.spacing1} 0`,
  borderRadius: tokens.radius.small,
  "& > div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacing.spacing0_5,
    borderRadius: tokens.radius.small,
    overflow: "hidden",
    transition: "transform 0.2s ease",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
  },
}));

/**
 * CustomSelect component matching Figma design (node-id: 32:54592)
 * A minimal styled select dropdown without border
 */
export const CustomSelect = ({
  value,
  options = [],
  onChange,
  placeholder = "Select...",
  disabled = false,
  sx = {},
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  const handleClick = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange({ target: { value: optionValue } });
    }
    handleClose();
  };

  return (
    <SelectContainer sx={sx}>
      <SelectInput
        ref={anchorRef}
        onClick={handleClick}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        sx={{
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <DataContainer>
          <ContentContainer>
            <ValueText>{displayValue}</ValueText>
          </ContentContainer>
          <ButtonContainer>
            <IconWrapper open={open}>
              <div>
                <ExpandMoreIcon
                  sx={{
                    fontSize: 24,
                    color: theme.palette.text.secondary,
                  }}
                />
              </div>
            </IconWrapper>
          </ButtonContainer>
        </DataContainer>
      </SelectInput>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
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
              mt: 0.5,
              minWidth: 200,
              borderRadius: tokens.radius.small,
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0px 4px 16px rgba(29, 29, 43, 0.4)",
            },
          },
        }}
      >
        <Box sx={{ py: "4px" }}>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
              selected={option.value === value}
              sx={{
                height: "28px",
                minHeight: "28px",
                minWidth: 200,
                pl: "16px",
                pr: "12px",
                py: 0,
                fontFamily: tokens.typography.inputText.fontFamily,
                fontSize: tokens.typography.inputText.fontSize,
                fontWeight: tokens.typography.inputText.fontWeight,
                lineHeight: "16px",
                color: theme.palette.text.secondary,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Box>
      </Popover>
    </SelectContainer>
  );
};

CustomSelect.propTypes = {
  /** Current selected value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Array of options: [{ value: string, label: string }] */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Callback when value changes */
  onChange: PropTypes.func,
  /** Placeholder text when no value selected */
  placeholder: PropTypes.string,
  /** Whether the select is disabled */
  disabled: PropTypes.bool,
  /** Additional styles */
  sx: PropTypes.object,
};

CustomSelect.defaultProps = {
  value: undefined,
  onChange: undefined,
  placeholder: "Select...",
  disabled: false,
  sx: {},
};
