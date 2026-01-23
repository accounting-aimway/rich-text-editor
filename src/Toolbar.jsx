import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  FormatClear,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import { Box, Divider, IconButton, Tooltip, SvgIcon } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Custom Undo icon matching Figma design
 */
const UndoIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 16 15">
    <path
      d="M3.575 14.575C3.29167 14.575 3.05417 14.4792 2.8625 14.2875C2.67083 14.0958 2.575 13.8583 2.575 13.575C2.575 13.2917 2.67083 13.0542 2.8625 12.8625C3.05417 12.6708 3.29167 12.575 3.575 12.575H9.675C10.725 12.575 11.6375 12.2417 12.4125 11.575C13.1875 10.9083 13.575 10.075 13.575 9.075C13.575 8.075 13.1875 7.24167 12.4125 6.575C11.6375 5.90833 10.725 5.575 9.675 5.575H3.375L5.275 7.475C5.45833 7.65833 5.55 7.89167 5.55 8.175C5.55 8.45833 5.45833 8.69167 5.275 8.875C5.09167 9.05833 4.85833 9.15 4.575 9.15C4.29167 9.15 4.05833 9.05833 3.875 8.875L0.275 5.275C0.175 5.175 0.104167 5.06667 0.0625 4.95C0.0208333 4.83333 0 4.70833 0 4.575C0 4.44167 0.0208333 4.31667 0.0625 4.2C0.104167 4.08333 0.175 3.975 0.275 3.875L3.875 0.275C4.05833 0.0916667 4.29167 0 4.575 0C4.85833 0 5.09167 0.0916667 5.275 0.275C5.45833 0.458333 5.55 0.691667 5.55 0.975C5.55 1.25833 5.45833 1.49167 5.275 1.675L3.375 3.575H9.675C11.2917 3.575 12.6792 4.1 13.8375 5.15C14.9958 6.2 15.575 7.50833 15.575 9.075C15.575 10.6417 14.9958 11.95 13.8375 13C12.6792 14.05 11.2917 14.575 9.675 14.575H3.575Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Redo icon matching Figma design
 */
const RedoIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 16 15">
    <path
      d="M12.2 5.575H5.9C4.85 5.575 3.9375 5.90833 3.1625 6.575C2.3875 7.24167 2 8.075 2 9.075C2 10.075 2.3875 10.9083 3.1625 11.575C3.9375 12.2417 4.85 12.575 5.9 12.575H12C12.2833 12.575 12.5208 12.6708 12.7125 12.8625C12.9042 13.0542 13 13.2917 13 13.575C13 13.8583 12.9042 14.0958 12.7125 14.2875C12.5208 14.4792 12.2833 14.575 12 14.575H5.9C4.28333 14.575 2.89583 14.05 1.7375 13C0.579167 11.95 0 10.6417 0 9.075C0 7.50833 0.579167 6.2 1.7375 5.15C2.89583 4.1 4.28333 3.575 5.9 3.575H12.2L10.3 1.675C10.1167 1.49167 10.025 1.25833 10.025 0.975C10.025 0.691667 10.1167 0.458333 10.3 0.275C10.4833 0.0916667 10.7167 0 11 0C11.2833 0 11.5167 0.0916667 11.7 0.275L15.3 3.875C15.4 3.975 15.4708 4.08333 15.5125 4.2C15.5542 4.31667 15.575 4.44167 15.575 4.575C15.575 4.70833 15.5542 4.83333 15.5125 4.95C15.4708 5.06667 15.4 5.175 15.3 5.275L11.7 8.875C11.5167 9.05833 11.2833 9.15 11 9.15C10.7167 9.15 10.4833 9.05833 10.3 8.875C10.1167 8.69167 10.025 8.45833 10.025 8.175C10.025 7.89167 10.1167 7.65833 10.3 7.475L12.2 5.575Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Strikethrough icon matching Figma design
 */
const FormatStrikethroughIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 20 16">
    <path
      d="M1 10C0.716667 10 0.479167 9.90417 0.2875 9.7125C0.0958333 9.52083 0 9.28333 0 9C0 8.71667 0.0958333 8.47917 0.2875 8.2875C0.479167 8.09583 0.716667 8 1 8H19C19.2833 8 19.5208 8.09583 19.7125 8.2875C19.9042 8.47917 20 8.71667 20 9C20 9.28333 19.9042 9.52083 19.7125 9.7125C19.5208 9.90417 19.2833 10 19 10H1ZM8.5 6V3H4.5C4.08333 3 3.72917 2.85417 3.4375 2.5625C3.14583 2.27083 3 1.91667 3 1.5C3 1.08333 3.14583 0.729167 3.4375 0.4375C3.72917 0.145833 4.08333 0 4.5 0H15.5C15.9167 0 16.2708 0.145833 16.5625 0.4375C16.8542 0.729167 17 1.08333 17 1.5C17 1.91667 16.8542 2.27083 16.5625 2.5625C16.2708 2.85417 15.9167 3 15.5 3H11.5V6H8.5ZM8.5 12H11.5V14.5C11.5 14.9167 11.3542 15.2708 11.0625 15.5625C10.7708 15.8542 10.4167 16 10 16C9.58333 16 9.22917 15.8542 8.9375 15.5625C8.64583 15.2708 8.5 14.9167 8.5 14.5V12Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Bold icon matching Figma design
 */
const BoldIcon = (props) => (
  <SvgIcon {...props} viewBox="-2 -1 15 16">
    <path
      d="M2 14C1.45 14 0.979167 13.8042 0.5875 13.4125C0.195833 13.0208 0 12.55 0 12V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H5.525C6.60833 0 7.60833 0.333333 8.525 1C9.44167 1.66667 9.9 2.59167 9.9 3.775C9.9 4.625 9.70833 5.27917 9.325 5.7375C8.94167 6.19583 8.58333 6.525 8.25 6.725C8.66667 6.90833 9.12917 7.25 9.6375 7.75C10.1458 8.25 10.4 9 10.4 10C10.4 11.4833 9.85833 12.5208 8.775 13.1125C7.69167 13.7042 6.675 14 5.725 14H2ZM3.025 11.2H5.625C6.425 11.2 6.9125 10.9958 7.0875 10.5875C7.2625 10.1792 7.35 9.88333 7.35 9.7C7.35 9.51667 7.2625 9.22083 7.0875 8.8125C6.9125 8.40417 6.4 8.2 5.55 8.2H3.025V11.2ZM3.025 5.5H5.35C5.9 5.5 6.3 5.35833 6.55 5.075C6.8 4.79167 6.925 4.475 6.925 4.125C6.925 3.725 6.78333 3.4 6.5 3.15C6.21667 2.9 5.85 2.775 5.4 2.775H3.025V5.5Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Italic icon matching Figma design
 */
const ItalicIcon = (props) => (
  <SvgIcon {...props} viewBox="-1.5 -1 16 16">
    <path
      d="M1.25 14C0.9 14 0.604167 13.8792 0.3625 13.6375C0.120833 13.3958 0 13.1 0 12.75C0 12.4 0.120833 12.1042 0.3625 11.8625C0.604167 11.6208 0.9 11.5 1.25 11.5H4L7 2.5H4.25C3.9 2.5 3.60417 2.37917 3.3625 2.1375C3.12083 1.89583 3 1.6 3 1.25C3 0.9 3.12083 0.604167 3.3625 0.3625C3.60417 0.120833 3.9 0 4.25 0H11.75C12.1 0 12.3958 0.120833 12.6375 0.3625C12.8792 0.604167 13 0.9 13 1.25C13 1.6 12.8792 1.89583 12.6375 2.1375C12.3958 2.37917 12.1 2.5 11.75 2.5H9.5L6.5 11.5H8.75C9.1 11.5 9.39583 11.6208 9.6375 11.8625C9.87917 12.1042 10 12.4 10 12.75C10 13.1 9.87917 13.3958 9.6375 13.6375C9.39583 13.8792 9.1 14 8.75 14H1.25Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Underline icon matching Figma design
 */
const UnderlineIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 14 18">
    <path
      d="M1 18C0.716667 18 0.479167 17.9042 0.2875 17.7125C0.0958333 17.5208 0 17.2833 0 17C0 16.7167 0.0958333 16.4792 0.2875 16.2875C0.479167 16.0958 0.716667 16 1 16H13C13.2833 16 13.5208 16.0958 13.7125 16.2875C13.9042 16.4792 14 16.7167 14 17C14 17.2833 13.9042 17.5208 13.7125 17.7125C13.5208 17.9042 13.2833 18 13 18H1ZM7 14C5.31667 14 4.00833 13.475 3.075 12.425C2.14167 11.375 1.675 9.98333 1.675 8.25V1.275C1.675 0.925 1.80417 0.625 2.0625 0.375C2.32083 0.125 2.625 0 2.975 0C3.325 0 3.625 0.125 3.875 0.375C4.125 0.625 4.25 0.925 4.25 1.275V8.4C4.25 9.33333 4.48333 10.0917 4.95 10.675C5.41667 11.2583 6.1 11.55 7 11.55C7.9 11.55 8.58333 11.2583 9.05 10.675C9.51667 10.0917 9.75 9.33333 9.75 8.4V1.275C9.75 0.925 9.87917 0.625 10.1375 0.375C10.3958 0.125 10.7 0 11.05 0C11.4 0 11.7 0.125 11.95 0.375C12.2 0.625 12.325 0.925 12.325 1.275V8.25C12.325 9.98333 11.8583 11.375 10.925 12.425C9.99167 13.475 8.68333 14 7 14Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Text Color icon matching Figma design (A letter only, without underline)
 */
const TextColorIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 20 14">
    <path
      d="M5.125 14C4.74167 14 4.4375 13.8375 4.2125 13.5125C3.9875 13.1875 3.94167 12.8417 4.075 12.475L8.475 0.75C8.55833 0.516667 8.7 0.333333 8.9 0.2C9.1 0.0666667 9.31667 0 9.55 0H10.45C10.7 0 10.9208 0.0666667 11.1125 0.2C11.3042 0.333333 11.4417 0.516667 11.525 0.75L15.95 12.5C16.0833 12.8667 16.0375 13.2083 15.8125 13.525C15.5875 13.8417 15.2833 14 14.9 14C14.6667 14 14.45 13.9333 14.25 13.8C14.05 13.6667 13.9083 13.4833 13.825 13.25L12.85 10.4H7.2L6.175 13.275C6.09167 13.5083 5.95417 13.6875 5.7625 13.8125C5.57083 13.9375 5.35833 14 5.125 14ZM7.9 8.4H12.1L10.05 2.6H9.95L7.9 8.4Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Bullet List icon matching Figma design
 */
const BulletListIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 18 16">
    <path
      d="M7 15C6.71667 15 6.47917 14.9042 6.2875 14.7125C6.09583 14.5208 6 14.2833 6 14C6 13.7167 6.09583 13.4792 6.2875 13.2875C6.47917 13.0958 6.71667 13 7 13H17C17.2833 13 17.5208 13.0958 17.7125 13.2875C17.9042 13.4792 18 13.7167 18 14C18 14.2833 17.9042 14.5208 17.7125 14.7125C17.5208 14.9042 17.2833 15 17 15H7ZM7 9C6.71667 9 6.47917 8.90417 6.2875 8.7125C6.09583 8.52083 6 8.28333 6 8C6 7.71667 6.09583 7.47917 6.2875 7.2875C6.47917 7.09583 6.71667 7 7 7H17C17.2833 7 17.5208 7.09583 17.7125 7.2875C17.9042 7.47917 18 7.71667 18 8C18 8.28333 17.9042 8.52083 17.7125 8.7125C17.5208 8.90417 17.2833 9 17 9H7ZM7 3C6.71667 3 6.47917 2.90417 6.2875 2.7125C6.09583 2.52083 6 2.28333 6 2C6 1.71667 6.09583 1.47917 6.2875 1.2875C6.47917 1.09583 6.71667 1 7 1H17C17.2833 1 17.5208 1.09583 17.7125 1.2875C17.9042 1.47917 18 1.71667 18 2C18 2.28333 17.9042 2.52083 17.7125 2.7125C17.5208 2.90417 17.2833 3 17 3H7ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Ordered List icon matching Figma design
 */
const OrderedListIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 18 20">
    <path
      d="M0.75 20C0.533333 20 0.354167 19.9292 0.2125 19.7875C0.0708333 19.6458 0 19.4667 0 19.25C0 19.0333 0.0708333 18.8542 0.2125 18.7125C0.354167 18.5708 0.533333 18.5 0.75 18.5H2.5V17.75H1.75C1.53333 17.75 1.35417 17.6792 1.2125 17.5375C1.07083 17.3958 1 17.2167 1 17C1 16.7833 1.07083 16.6042 1.2125 16.4625C1.35417 16.3208 1.53333 16.25 1.75 16.25H2.5V15.5H0.75C0.533333 15.5 0.354167 15.4292 0.2125 15.2875C0.0708333 15.1458 0 14.9667 0 14.75C0 14.5333 0.0708333 14.3542 0.2125 14.2125C0.354167 14.0708 0.533333 14 0.75 14H3C3.28333 14 3.52083 14.0958 3.7125 14.2875C3.90417 14.4792 4 14.7167 4 15V16C4 16.2833 3.90417 16.5208 3.7125 16.7125C3.52083 16.9042 3.28333 17 3 17C3.28333 17 3.52083 17.0958 3.7125 17.2875C3.90417 17.4792 4 17.7167 4 18V19C4 19.2833 3.90417 19.5208 3.7125 19.7125C3.52083 19.9042 3.28333 20 3 20H0.75ZM0.75 13C0.533333 13 0.354167 12.9292 0.2125 12.7875C0.0708333 12.6458 0 12.4667 0 12.25V10.25C0 9.96667 0.0958333 9.72917 0.2875 9.5375C0.479167 9.34583 0.716667 9.25 1 9.25H2.5V8.5H0.75C0.533333 8.5 0.354167 8.42917 0.2125 8.2875C0.0708333 8.14583 0 7.96667 0 7.75C0 7.53333 0.0708333 7.35417 0.2125 7.2125C0.354167 7.07083 0.533333 7 0.75 7H3C3.28333 7 3.52083 7.09583 3.7125 7.2875C3.90417 7.47917 4 7.71667 4 8V9.75C4 10.0333 3.90417 10.2708 3.7125 10.4625C3.52083 10.6542 3.28333 10.75 3 10.75H1.5V11.5H3.25C3.46667 11.5 3.64583 11.5708 3.7875 11.7125C3.92917 11.8542 4 12.0333 4 12.25C4 12.4667 3.92917 12.6458 3.7875 12.7875C3.64583 12.9292 3.46667 13 3.25 13H0.75ZM2.25 6C2.03333 6 1.85417 5.92917 1.7125 5.7875C1.57083 5.64583 1.5 5.46667 1.5 5.25V1.5H0.75C0.533333 1.5 0.354167 1.42917 0.2125 1.2875C0.0708333 1.14583 0 0.966667 0 0.75C0 0.533333 0.0708333 0.354167 0.2125 0.2125C0.354167 0.0708333 0.533333 0 0.75 0H2.25C2.46667 0 2.64583 0.0708333 2.7875 0.2125C2.92917 0.354167 3 0.533333 3 0.75V5.25C3 5.46667 2.92917 5.64583 2.7875 5.7875C2.64583 5.92917 2.46667 6 2.25 6ZM7 17C6.71667 17 6.47917 16.9042 6.2875 16.7125C6.09583 16.5208 6 16.2833 6 16C6 15.7167 6.09583 15.4792 6.2875 15.2875C6.47917 15.0958 6.71667 15 7 15H17C17.2833 15 17.5208 15.0958 17.7125 15.2875C17.9042 15.4792 18 15.7167 18 16C18 16.2833 17.9042 16.5208 17.7125 16.7125C17.5208 16.9042 17.2833 17 17 17H7ZM7 11C6.71667 11 6.47917 10.9042 6.2875 10.7125C6.09583 10.5208 6 10.2833 6 10C6 9.71667 6.09583 9.47917 6.2875 9.2875C6.47917 9.09583 6.71667 9 7 9H17C17.2833 9 17.5208 9.09583 17.7125 9.2875C17.9042 9.47917 18 9.71667 18 10C18 10.2833 17.9042 10.5208 17.7125 10.7125C17.5208 10.9042 17.2833 11 17 11H7ZM7 5C6.71667 5 6.47917 4.90417 6.2875 4.7125C6.09583 4.52083 6 4.28333 6 4C6 3.71667 6.09583 3.47917 6.2875 3.2875C6.47917 3.09583 6.71667 3 7 3H17C17.2833 3 17.5208 3.09583 17.7125 3.2875C17.9042 3.47917 18 3.71667 18 4C18 4.28333 17.9042 4.52083 17.7125 4.7125C17.5208 4.90417 17.2833 5 17 5H7Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Indent Decrease icon matching Figma design
 */
const IndentDecreaseIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 18 18">
    <path
      d="M1 18C0.716667 18 0.479167 17.9042 0.2875 17.7125C0.0958333 17.5208 0 17.2833 0 17C0 16.7167 0.0958333 16.4792 0.2875 16.2875C0.479167 16.0958 0.716667 16 1 16H17C17.2833 16 17.5208 16.0958 17.7125 16.2875C17.9042 16.4792 18 16.7167 18 17C18 17.2833 17.9042 17.5208 17.7125 17.7125C17.5208 17.9042 17.2833 18 17 18H1ZM9 14C8.71667 14 8.47917 13.9042 8.2875 13.7125C8.09583 13.5208 8 13.2833 8 13C8 12.7167 8.09583 12.4792 8.2875 12.2875C8.47917 12.0958 8.71667 12 9 12H17C17.2833 12 17.5208 12.0958 17.7125 12.2875C17.9042 12.4792 18 12.7167 18 13C18 13.2833 17.9042 13.5208 17.7125 13.7125C17.5208 13.9042 17.2833 14 17 14H9ZM9 10C8.71667 10 8.47917 9.90417 8.2875 9.7125C8.09583 9.52083 8 9.28333 8 9C8 8.71667 8.09583 8.47917 8.2875 8.2875C8.47917 8.09583 8.71667 8 9 8H17C17.2833 8 17.5208 8.09583 17.7125 8.2875C17.9042 8.47917 18 8.71667 18 9C18 9.28333 17.9042 9.52083 17.7125 9.7125C17.5208 9.90417 17.2833 10 17 10H9ZM9 6C8.71667 6 8.47917 5.90417 8.2875 5.7125C8.09583 5.52083 8 5.28333 8 5C8 4.71667 8.09583 4.47917 8.2875 4.2875C8.47917 4.09583 8.71667 4 9 4H17C17.2833 4 17.5208 4.09583 17.7125 4.2875C17.9042 4.47917 18 4.71667 18 5C18 5.28333 17.9042 5.52083 17.7125 5.7125C17.5208 5.90417 17.2833 6 17 6H9ZM1 2C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H1ZM3.15 12.15L0.35 9.35C0.25 9.25 0.2 9.13333 0.2 9C0.2 8.86667 0.25 8.75 0.35 8.65L3.15 5.85C3.31667 5.68333 3.5 5.64167 3.7 5.725C3.9 5.80833 4 5.96667 4 6.2V11.8C4 12.0333 3.9 12.1917 3.7 12.275C3.5 12.3583 3.31667 12.3167 3.15 12.15Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Indent Increase icon matching Figma design
 */
const IndentIncreaseIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 18 18">
    <path
      d="M1 18C0.716667 18 0.479167 17.9042 0.2875 17.7125C0.0958333 17.5208 0 17.2833 0 17C0 16.7167 0.0958333 16.4792 0.2875 16.2875C0.479167 16.0958 0.716667 16 1 16H17C17.2833 16 17.5208 16.0958 17.7125 16.2875C17.9042 16.4792 18 16.7167 18 17C18 17.2833 17.9042 17.5208 17.7125 17.7125C17.5208 17.9042 17.2833 18 17 18H1ZM9 14C8.71667 14 8.47917 13.9042 8.2875 13.7125C8.09583 13.5208 8 13.2833 8 13C8 12.7167 8.09583 12.4792 8.2875 12.2875C8.47917 12.0958 8.71667 12 9 12H17C17.2833 12 17.5208 12.0958 17.7125 12.2875C17.9042 12.4792 18 12.7167 18 13C18 13.2833 17.9042 13.5208 17.7125 13.7125C17.5208 13.9042 17.2833 14 17 14H9ZM9 10C8.71667 10 8.47917 9.90417 8.2875 9.7125C8.09583 9.52083 8 9.28333 8 9C8 8.71667 8.09583 8.47917 8.2875 8.2875C8.47917 8.09583 8.71667 8 9 8H17C17.2833 8 17.5208 8.09583 17.7125 8.2875C17.9042 8.47917 18 8.71667 18 9C18 9.28333 17.9042 9.52083 17.7125 9.7125C17.5208 9.90417 17.2833 10 17 10H9ZM9 6C8.71667 6 8.47917 5.90417 8.2875 5.7125C8.09583 5.52083 8 5.28333 8 5C8 4.71667 8.09583 4.47917 8.2875 4.2875C8.47917 4.09583 8.71667 4 9 4H17C17.2833 4 17.5208 4.09583 17.7125 4.2875C17.9042 4.47917 18 4.71667 18 5C18 5.28333 17.9042 5.52083 17.7125 5.7125C17.5208 5.90417 17.2833 6 17 6H9ZM1 2C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H1ZM0.85 12.15C0.683333 12.3167 0.5 12.3583 0.3 12.275C0.1 12.1917 0 12.0333 0 11.8V6.2C0 5.96667 0.1 5.80833 0.3 5.725C0.5 5.64167 0.683333 5.68333 0.85 5.85L3.65 8.65C3.75 8.75 3.8 8.86667 3.8 9C3.8 9.13333 3.75 9.25 3.65 9.35L0.85 12.15Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Link icon matching Figma design
 */
const LinkIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 20 10">
    <path
      d="M5 10C3.61667 10 2.4375 9.5125 1.4625 8.5375C0.4875 7.5625 0 6.38333 0 5C0 3.61667 0.4875 2.4375 1.4625 1.4625C2.4375 0.4875 3.61667 0 5 0H8C8.28333 0 8.52083 0.0958333 8.7125 0.2875C8.90417 0.479167 9 0.716667 9 1C9 1.28333 8.90417 1.52083 8.7125 1.7125C8.52083 1.90417 8.28333 2 8 2H5C4.16667 2 3.45833 2.29167 2.875 2.875C2.29167 3.45833 2 4.16667 2 5C2 5.83333 2.29167 6.54167 2.875 7.125C3.45833 7.70833 4.16667 8 5 8H8C8.28333 8 8.52083 8.09583 8.7125 8.2875C8.90417 8.47917 9 8.71667 9 9C9 9.28333 8.90417 9.52083 8.7125 9.7125C8.52083 9.90417 8.28333 10 8 10H5ZM7 6C6.71667 6 6.47917 5.90417 6.2875 5.7125C6.09583 5.52083 6 5.28333 6 5C6 4.71667 6.09583 4.47917 6.2875 4.2875C6.47917 4.09583 6.71667 4 7 4H13C13.2833 4 13.5208 4.09583 13.7125 4.2875C13.9042 4.47917 14 4.71667 14 5C14 5.28333 13.9042 5.52083 13.7125 5.7125C13.5208 5.90417 13.2833 6 13 6H7ZM12 10C11.7167 10 11.4792 9.90417 11.2875 9.7125C11.0958 9.52083 11 9.28333 11 9C11 8.71667 11.0958 8.47917 11.2875 8.2875C11.4792 8.09583 11.7167 8 12 8H15C15.8333 8 16.5417 7.70833 17.125 7.125C17.7083 6.54167 18 5.83333 18 5C18 4.16667 17.7083 3.45833 17.125 2.875C16.5417 2.29167 15.8333 2 15 2H12C11.7167 2 11.4792 1.90417 11.2875 1.7125C11.0958 1.52083 11 1.28333 11 1C11 0.716667 11.0958 0.479167 11.2875 0.2875C11.4792 0.0958333 11.7167 0 12 0H15C16.3833 0 17.5625 0.4875 18.5375 1.4625C19.5125 2.4375 20 3.61667 20 5C20 6.38333 19.5125 7.5625 18.5375 8.5375C17.5625 9.5125 16.3833 10 15 10H12Z"
      fill="currentColor"
    />
  </SvgIcon>
);

/**
 * Custom Image icon matching Figma design
 */
const ImageIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 18 18">
    <path
      d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM4 14H14C14.2 14 14.35 13.9083 14.45 13.725C14.55 13.5417 14.5333 13.3667 14.4 13.2L11.65 9.525C11.55 9.39167 11.4167 9.325 11.25 9.325C11.0833 9.325 10.95 9.39167 10.85 9.525L8.25 13L6.4 10.525C6.3 10.3917 6.16667 10.325 6 10.325C5.83333 10.325 5.7 10.3917 5.6 10.525L3.6 13.2C3.46667 13.3667 3.45 13.5417 3.55 13.725C3.65 13.9083 3.8 14 4 14ZM5.5 7C5.91667 7 6.27083 6.85417 6.5625 6.5625C6.85417 6.27083 7 5.91667 7 5.5C7 5.08333 6.85417 4.72917 6.5625 4.4375C6.27083 4.14583 5.91667 4 5.5 4C5.08333 4 4.72917 4.14583 4.4375 4.4375C4.14583 4.72917 4 5.08333 4 5.5C4 5.91667 4.14583 6.27083 4.4375 6.5625C4.72917 6.85417 5.08333 7 5.5 7Z"
      fill="currentColor"
    />
  </SvgIcon>
);

import { CustomSelect } from "./CustomSelect";
import { ColorPicker, FIGMA_TEXT_COLORS } from "./ColorPicker";
import { getAutoTranslations, getHeadingOptions } from "./i18n";

/**
 * Available tool definitions
 * Each tool has a unique key, command, icon, label/title, and group
 */
export const TOOLBAR_TOOLS = {
  // Text formatting
  bold: {
    command: "bold",
    icon: BoldIcon,
    title: "Bold (Ctrl+B)",
    group: "text",
  },
  italic: {
    command: "italic",
    icon: ItalicIcon,
    title: "Italic (Ctrl+I)",
    group: "text",
  },
  underline: {
    command: "underline",
    icon: UnderlineIcon,
    title: "Underline (Ctrl+U)",
    group: "text",
  },
  strikethrough: {
    command: "strikeThrough",
    icon: FormatStrikethroughIcon,
    title: "Strikethrough (Ctrl+S)",
    group: "text",
  },
  link: {
    command: "createLink",
    icon: LinkIcon,
    title: "Insert Link (Ctrl+K)",
    group: "link",
  },
  clearFormat: {
    command: "removeFormat",
    icon: FormatClear,
    title: "Remove Formatting (Ctrl+E)",
    group: "clean",
  },

  // Lists
  bulletList: {
    command: "insertUnorderedList",
    icon: BulletListIcon,
    title: "Bullet List",
    group: "list",
  },
  numberedList: {
    command: "insertOrderedList",
    icon: OrderedListIcon,
    title: "Numbered List",
    group: "list",
  },

  // Indentation
  outdent: {
    command: "outdent",
    icon: IndentDecreaseIcon,
    title: "Decrease Indent",
    group: "indent",
  },
  indent: {
    command: "indent",
    icon: IndentIncreaseIcon,
    title: "Increase Indent",
    group: "indent",
  },

  // Alignment
  alignLeft: {
    command: "justifyLeft",
    icon: FormatAlignLeft,
    title: "Align Left",
    group: "align",
  },
  alignCenter: {
    command: "justifyCenter",
    icon: FormatAlignCenter,
    title: "Align Center",
    group: "align",
  },
  alignRight: {
    command: "justifyRight",
    icon: FormatAlignRight,
    title: "Align Right",
    group: "align",
  },
  alignJustify: {
    command: "justifyFull",
    icon: FormatAlignJustify,
    title: "Justify",
    group: "align",
  },

  // Media
  image: {
    command: "insertImage",
    icon: ImageIcon,
    title: "Insert Image",
    group: "media",
    isFileInput: true,
  },

  // History
  undo: {
    command: "undo",
    icon: UndoIcon,
    title: "Undo (Ctrl/Cmd+Z)",
    group: "history",
  },
  redo: {
    command: "redo",
    icon: RedoIcon,
    title: "Redo (Ctrl+Y / Cmd+Shift+Z)",
    group: "history",
  },

  // Text Color
  textColor: {
    command: "foreColor",
    icon: TextColorIcon,
    title: "Text Color",
    group: "color",
    hasDropdown: true,
  },

  // Search
  search: {
    command: "search",
    icon: SearchIcon,
    title: "Search",
    group: "search",
  },

  // Help
  help: {
    command: "help",
    icon: HelpIcon,
    title: "Help",
    group: "help",
  },
};

/**
 * Default text colors for the color picker
 * Uses the Figma design palette (5 rows x 4 columns = 20 colors)
 */
export const DEFAULT_TEXT_COLORS = FIGMA_TEXT_COLORS;

/**
 * Default tool groups configuration (left side)
 * Tools are organized in groups separated by dividers
 */
export const DEFAULT_TOOL_GROUPS = [
  ["heading"], // Special: heading dropdown
  ["bold", "italic", "underline", "strikethrough"],
  ["textColor"],
  ["bulletList", "numberedList"],
  ["outdent", "indent"],
  ["alignLeft", "alignCenter", "alignRight"],
  ["image", "link"],
  ["undo", "redo"],
];

/**
 * Default right-side tool groups
 * These appear on the right side of the toolbar
 */
export const DEFAULT_RIGHT_TOOL_GROUPS = [
  ["search", "help"],
];

/**
 * Default tooltip titles for all tools (English)
 * Can be overridden via toolTitles prop or translations prop
 */
export const DEFAULT_TOOL_TITLES = getAutoTranslations().toolbar;

/**
 * Toolbar component for the rich text editor
 * Provides configurable formatting controls
 *
 * @param {Object} props
 * @param {Function} props.onFormat - Callback for formatting commands
 * @param {Array} props.toolGroups - Array of tool group arrays defining which tools to show
 * @param {Object} props.toolTitles - Custom tooltip titles for tools (overrides defaults)
 * @param {Array} props.headingOptions - Custom heading dropdown options
 * @param {string} props.currentBlockFormat - Current block format (h1-h6, p)
 * @param {Object} props.currentInlineFormats - Current inline format states
 * @param {Function} props.onImageUpload - Custom image upload handler
 * @param {Object} props.translations - Custom translations for i18n support
 * @param {React.ComponentType} props.TooltipComponent - Custom Tooltip component to use instead of MUI Tooltip
 * @param {Array} props.rightToolGroups - Array of tool group arrays for right side of toolbar
 * @param {Function} props.onSearch - Callback when search button is clicked
 * @param {Function} props.onHelp - Callback when help button is clicked
 * @param {Array} props.textColors - Custom color palette for text color picker
 */
export const Toolbar = ({
  onFormat,
  toolGroups = DEFAULT_TOOL_GROUPS,
  toolTitles = {},
  headingOptions,
  currentBlockFormat = "p",
  currentInlineFormats = {},
  onImageUpload,
  translations = {},
  TooltipComponent,
  rightToolGroups = DEFAULT_RIGHT_TOOL_GROUPS,
  onSearch,
  onHelp,
  textColors = DEFAULT_TEXT_COLORS,
}) => {
  const theme = useTheme();
  const imageInputRef = useRef(null);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [currentTextColor, setCurrentTextColor] = useState("#536886");
  const [colorSelectionRange, setColorSelectionRange] = useState(null);

  // Use custom TooltipComponent or default MUI Tooltip
  const TooltipWrapper = TooltipComponent || Tooltip;

  // Get base translations (auto-detected or from passed translations)
  const baseTranslations = getAutoTranslations();

  // Get merged translations for toolbar and headings
  const mergedToolbarTitles = {
    ...baseTranslations.toolbar,
    ...(translations.toolbar || {}),
    ...toolTitles,
  };

  // Get heading options from translations or use provided headingOptions
  const resolvedHeadingOptions = headingOptions || getHeadingOptions(translations);

  /**
   * Get tooltip title for a tool
   * Uses custom title if provided, otherwise falls back to default
   */
  const getToolTitle = (toolKey) => {
    // First check custom titles/translations, then default titles, then tool definition
    return (
      mergedToolbarTitles[toolKey] ||
      DEFAULT_TOOL_TITLES[toolKey] ||
      TOOLBAR_TOOLS[toolKey]?.title ||
      ""
    );
  };

  /**
   * Handle image file selection
   */
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (onImageUpload) {
        onImageUpload(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          onFormat("insertImage", event.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = "";
  };

  /**
   * Handle button click
   */
  const handleButtonClick = (command, value) => {
    onFormat(command, value);
  };

  /**
   * Check if a tool is active
   */
  const isToolActive = (toolKey) => {
    const tool = TOOLBAR_TOOLS[toolKey];
    if (!tool) return false;

    // Map command to inline format key
    const commandToFormatKey = {
      bold: "bold",
      italic: "italic",
      underline: "underline",
      strikeThrough: "strikeThrough",
      createLink: "link",
      insertUnorderedList: "unorderedList",
      insertOrderedList: "orderedList",
      justifyLeft: "justifyLeft",
      justifyCenter: "justifyCenter",
      justifyRight: "justifyRight",
      justifyFull: "justifyFull",
    };

    const formatKey = commandToFormatKey[tool.command];
    return formatKey ? currentInlineFormats?.[formatKey] || false : false;
  };

  /**
   * Handle color picker open
   * Stores the current selection range before opening the popover
   */
  const handleColorClick = (event) => {
    // Store the current selection before opening the popover
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setColorSelectionRange(selection.getRangeAt(0).cloneRange());
    }
    setColorAnchorEl(event.currentTarget);
  };

  /**
   * Handle color picker close
   */
  const handleColorClose = () => {
    setColorAnchorEl(null);
    setColorSelectionRange(null);
  };

  /**
   * Handle color selection
   * Restores the selection range before applying the color
   */
  const handleColorSelect = (color) => {
    // Restore the selection before applying the color
    if (colorSelectionRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(colorSelectionRange);
    }

    setCurrentTextColor(color);
    onFormat("foreColor", color);
    handleColorClose();
  };

  /**
   * Handle search button click
   */
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    } else {
      onFormat("search");
    }
  };

  /**
   * Handle help button click
   */
  const handleHelpClick = () => {
    if (onHelp) {
      onHelp();
    } else {
      onFormat("help");
    }
  };

  /**
   * Render a single tool button
   */
  const renderToolButton = (toolKey) => {
    const tool = TOOLBAR_TOOLS[toolKey];
    if (!tool) return null;

    const Icon = tool.icon;
    const active = isToolActive(toolKey);
    const tooltipTitle = getToolTitle(toolKey);

    // Special handling for image input
    if (tool.isFileInput) {
      return (
        <React.Fragment key={toolKey}>
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />
          <TooltipWrapper title={tooltipTitle} placement="top">
            <IconButton
              onClick={() => imageInputRef.current?.click()}
              size="small"
              className="notranslate"
              translate="no"
              sx={{
                borderRadius: "4px",
                padding: "4px",
                width: 32,
                height: 32,
                color: theme.palette.text.secondary,
                "&:hover": { bgcolor: theme.palette.action.hover },
                "&:active": { bgcolor: theme.palette.action.selected },
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </IconButton>
          </TooltipWrapper>
        </React.Fragment>
      );
    }

    // Special handling for text color with dropdown
    if (toolKey === "textColor") {
      const colorOpen = Boolean(colorAnchorEl);
      return (
        <React.Fragment key={toolKey}>
          <TooltipWrapper title={tooltipTitle} placement="top">
            <Box
              onClick={handleColorClick}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                cursor: "pointer",
                "&:hover": { bgcolor: theme.palette.action.hover },
              }}
            >
              {/* Icon container with 4px padding */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  p: "4px",
                  borderRadius: "4px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 18,
                      color: theme.palette.text.secondary,
                    }}
                  />
                  {/* Color indicator bar below the A */}
                  <Box
                    sx={{
                      width: 16,
                      height: "3px",
                      bgcolor: currentTextColor,
                      borderRadius: "1px",
                      mt: "1px",
                    }}
                  />
                </Box>
              </Box>
              {/* Expand arrow with 4px padding */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: "4px",
                }}
              >
                <ExpandMoreIcon
                  sx={{
                    fontSize: 24,
                    color: "#A9B1BF",
                  }}
                />
              </Box>
            </Box>
          </TooltipWrapper>
          <ColorPicker
            open={colorOpen}
            anchorEl={colorAnchorEl}
            onClose={handleColorClose}
            onColorSelect={handleColorSelect}
            selectedColor={currentTextColor}
            colors={textColors}
          />
        </React.Fragment>
      );
    }

    // Special handling for search
    if (toolKey === "search") {
      return (
        <TooltipWrapper key={toolKey} title={tooltipTitle} placement="top">
          <IconButton
            onClick={handleSearchClick}
            size="small"
            className="notranslate"
            translate="no"
            sx={{
              borderRadius: "4px",
              padding: "4px",
              width: 32,
              height: 32,
              color: theme.palette.text.secondary,
              "&:hover": { bgcolor: theme.palette.action.hover },
              "&:active": { bgcolor: theme.palette.action.selected },
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </IconButton>
        </TooltipWrapper>
      );
    }

    // Special handling for help
    if (toolKey === "help") {
      return (
        <TooltipWrapper key={toolKey} title={tooltipTitle} placement="top">
          <IconButton
            onClick={handleHelpClick}
            size="small"
            className="notranslate"
            translate="no"
            sx={{
              borderRadius: "4px",
              padding: "4px",
              width: 32,
              height: 32,
              color: theme.palette.text.secondary,
              "&:hover": { bgcolor: theme.palette.action.hover },
              "&:active": { bgcolor: theme.palette.action.selected },
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </IconButton>
        </TooltipWrapper>
      );
    }

    return (
      <TooltipWrapper key={toolKey} title={tooltipTitle} placement="top">
        <IconButton
          onClick={() => handleButtonClick(tool.command)}
          size="small"
          className="notranslate"
          translate="no"
          sx={{
            borderRadius: "4px",
            padding: "4px",
            width: 32,
            height: 32,
            color: active
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            bgcolor: active ? "action.selected" : undefined,
            "&:hover": { bgcolor: theme.palette.action.hover },
            "&:active": { bgcolor: theme.palette.action.selected },
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </IconButton>
      </TooltipWrapper>
    );
  };

  /**
   * Render a tool group
   */
  const renderToolGroup = (tools, groupIndex) => {
    // Special handling for heading dropdown
    if (tools.includes("heading")) {
      return (
        <CustomSelect
          key={`group-${groupIndex}`}
          value={currentBlockFormat}
          options={resolvedHeadingOptions}
          onChange={(event) =>
            handleButtonClick("formatBlock", event.target.value)
          }
          sx={{ minWidth: 120 }}
        />
      );
    }

    // Filter out invalid tools
    const validTools = tools.filter((toolKey) => TOOLBAR_TOOLS[toolKey]);
    if (validTools.length === 0) return null;

    return (
      <Box
        key={`group-${groupIndex}`}
        sx={{ display: "flex", alignItems: "center", gap: "4px" }}
      >
        {validTools.map((toolKey) => renderToolButton(toolKey))}
      </Box>
    );
  };

  // Filter out empty groups
  const validGroups = toolGroups.filter((group) => {
    if (group.includes("heading")) return true;
    return group.some((toolKey) => TOOLBAR_TOOLS[toolKey]);
  });

  // Filter out empty right groups and tools without handlers
  const validRightGroups = rightToolGroups
    .map((group) => {
      return group.filter((toolKey) => {
        // Only show search if onSearch is provided
        if (toolKey === "search" && !onSearch) return false;
        // Only show help if onHelp is provided
        if (toolKey === "help" && !onHelp) return false;
        return TOOLBAR_TOOLS[toolKey];
      });
    })
    .filter((group) => group.length > 0);

  return (
    <Box
      className="notranslate"
      translate="no"
      sx={{
        px: "8px",
        py: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left side tools */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {validGroups.map((group, index) => (
          <React.Fragment key={`fragment-${index}`}>
            {index > 0 && (
              <Divider orientation="vertical" flexItem sx={{ height: 32, borderColor: "#e5e8ec" }} />
            )}
            {renderToolGroup(group, index)}
          </React.Fragment>
        ))}
      </Box>

      {/* Right side tools */}
      {validRightGroups.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {validRightGroups.map((group, index) => (
            <Box
              key={`right-group-${index}`}
              sx={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              {group.map((toolKey) => renderToolButton(toolKey))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// PropTypes for type checking
Toolbar.propTypes = {
  /** Callback function for formatting commands */
  onFormat: PropTypes.func.isRequired,
  /** Array of tool group arrays defining which tools to show */
  toolGroups: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  /** Custom tooltip titles for tools (overrides defaults) */
  toolTitles: PropTypes.objectOf(PropTypes.string),
  /** Custom heading dropdown options */
  headingOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  /** Current block format (h1, h2, h3, h4, h5, h6, p) */
  currentBlockFormat: PropTypes.string,
  /** Object containing current inline format states */
  currentInlineFormats: PropTypes.shape({
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    underline: PropTypes.bool,
    strikeThrough: PropTypes.bool,
    link: PropTypes.bool,
    unorderedList: PropTypes.bool,
    orderedList: PropTypes.bool,
    justifyLeft: PropTypes.bool,
    justifyCenter: PropTypes.bool,
    justifyRight: PropTypes.bool,
    justifyFull: PropTypes.bool,
  }),
  /** Custom image upload handler - receives File object */
  onImageUpload: PropTypes.func,
  /** Custom translations for i18n support */
  translations: PropTypes.object,
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
Toolbar.defaultProps = {
  toolGroups: DEFAULT_TOOL_GROUPS,
  toolTitles: {},
  headingOptions: undefined,
  currentBlockFormat: "p",
  currentInlineFormats: {},
  onImageUpload: undefined,
  translations: {},
  TooltipComponent: undefined,
  rightToolGroups: DEFAULT_RIGHT_TOOL_GROUPS,
  onSearch: undefined,
  onHelp: undefined,
  textColors: DEFAULT_TEXT_COLORS,
};
