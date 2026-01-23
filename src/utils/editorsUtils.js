/**
 * Utility functions for rich text editor operations
 * Provides formatting, selection, and content manipulation functions
 */

/**
 * Apply formatting to the selected text
 * @param {string} command - The formatting command
 * @param {string} value - Optional value for the command
 */
export const applyFormatting = (command, value = null) => {
  // Special handling for formatBlock inside lists
  if (command === "formatBlock") {
    const handled = applyBlockFormatInList(value);
    if (handled) {
      cleanupInlineFontStyles();
      return;
    }
  }

  document.execCommand(command, false, value);

  // When changing block format, clean up inline font-size styles
  if (command === "formatBlock") {
    cleanupInlineFontStyles();
  }
};

/**
 * Apply block format (heading/paragraph) to content inside a list
 * Returns true if handled, false if not inside a list
 * @param {string} format - The format to apply (h1, h2, h3, p)
 * @returns {boolean} Whether the format was applied
 */
const applyBlockFormatInList = (format) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  // Find if we're inside a list item
  let node = selection.anchorNode;
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }

  let listItem = null;
  let current = node;
  while (current) {
    if (current.tagName === "LI") {
      listItem = current;
      break;
    }
    if (current.contentEditable === "true") {
      break;
    }
    current = current.parentElement;
  }

  if (!listItem) return false; // Not inside a list, let normal formatBlock handle it

  // Get the format tag (remove < > if present)
  const tag = format.replace(/[<>]/g, "").toLowerCase();

  if (tag === "p") {
    // Converting to paragraph - remove any heading wrappers inside the list item
    const headings = listItem.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading) => {
      // Replace heading with its content
      while (heading.firstChild) {
        heading.parentNode.insertBefore(heading.firstChild, heading);
      }
      heading.remove();
    });
  } else if (["h1", "h2", "h3"].includes(tag)) {
    // Applying heading - wrap the list item content
    // First, remove any existing headings
    const existingHeadings = listItem.querySelectorAll("h1, h2, h3, h4, h5, h6");
    existingHeadings.forEach((heading) => {
      while (heading.firstChild) {
        heading.parentNode.insertBefore(heading.firstChild, heading);
      }
      heading.remove();
    });

    // Create new heading and move all content into it
    const heading = document.createElement(tag);
    while (listItem.firstChild) {
      heading.appendChild(listItem.firstChild);
    }
    listItem.appendChild(heading);
  }

  return true;
};

/**
 * Remove inline font-size styles from selected content
 * This is needed when changing from heading to paragraph to reset the text size
 */
const cleanupInlineFontStyles = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  // Get the common ancestor of the selection
  const range = selection.getRangeAt(0);
  let container = range.commonAncestorContainer;

  // If it's a text node, get the parent element
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }

  // Find the block element that was just formatted
  let blockElement = container;
  while (blockElement && !["H1", "H2", "H3", "P", "BLOCKQUOTE", "LI"].includes(blockElement.tagName)) {
    blockElement = blockElement.parentElement;
  }

  if (!blockElement) return;

  // Remove font-size from all elements within the block
  const elementsWithFontSize = blockElement.querySelectorAll("[style]");
  elementsWithFontSize.forEach((el) => {
    el.style.removeProperty("font-size");
    // If style attribute is now empty, remove it entirely
    if (!el.getAttribute("style")?.trim()) {
      el.removeAttribute("style");
    }
  });

  // Also check the block element itself
  if (blockElement.style) {
    blockElement.style.removeProperty("font-size");
    if (!blockElement.getAttribute("style")?.trim()) {
      blockElement.removeAttribute("style");
    }
  }
};

/**
 * Clean up malformed HTML in the editor
 * Removes empty heading/paragraph tags and fixes common nesting issues
 * @param {HTMLElement} editorElement - The contenteditable editor element
 */
export const cleanupEditorHTML = (editorElement) => {
  if (!editorElement) return;

  // Remove empty heading and paragraph tags (but keep <p><br></p> as they're line breaks)
  const emptyTags = editorElement.querySelectorAll("h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty");
  emptyTags.forEach((el) => el.remove());

  // Remove headings that only contain empty paragraphs
  const headings = editorElement.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((heading) => {
    // Check if heading only contains empty elements or whitespace
    const hasContent = Array.from(heading.childNodes).some((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        return child.textContent.trim().length > 0;
      }
      if (child.nodeType === Node.ELEMENT_NODE) {
        // Check if it's a list or has actual content
        if (["OL", "UL", "LI"].includes(child.tagName)) return true;
        return child.textContent.trim().length > 0;
      }
      return false;
    });

    if (!hasContent) {
      heading.remove();
    }
  });

  // Fix lists that are wrapped in headings - unwrap them
  const listsInHeadings = editorElement.querySelectorAll("h1 > ol, h1 > ul, h2 > ol, h2 > ul, h3 > ol, h3 > ul");
  listsInHeadings.forEach((list) => {
    const heading = list.parentElement;
    if (heading && ["H1", "H2", "H3", "H4", "H5", "H6"].includes(heading.tagName)) {
      // Move the list outside of the heading
      heading.parentNode.insertBefore(list, heading.nextSibling);
      // Remove the heading if it's now empty
      if (!heading.textContent.trim()) {
        heading.remove();
      }
    }
  });
};

/**
 * Get information about the current selection
 * @returns {object|null} Selection information or null if no selection
 */
export const getSelectionInfo = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  return {
    selection,
    range: range.cloneRange(),
    text: selection.toString(),
    isCollapsed: selection.isCollapsed,
  };
};

/**
 * Insert a link at the specified range or current selection
 * @param {string} url - The URL to insert
 * @param {Range} range - Optional range to insert at
 */
export const insertLink = (url, range = null) => {
  const selection = window.getSelection();

  if (range) {
    // Restore the stored range
    selection.removeAllRanges();
    selection.addRange(range);
  }

  if (selection.isCollapsed) {
    // No text selected, insert the URL as both text and link
    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.textContent = url;
    linkElement.target = "_blank";
    linkElement.rel = "noopener noreferrer";

    range.insertNode(linkElement);
    range.setStartAfter(linkElement);
    range.setEndAfter(linkElement);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    // Text is selected, convert it to a link
    document.execCommand("createLink", false, url);

    // Set target and rel attributes for the created link
    const links = document.querySelectorAll('a[href="' + url + '"]');
    links.forEach((link) => {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }
};

/**
 * Remove link formatting from the current selection
 */
export const removeLink = () => {
  document.execCommand("unlink");
};

/**
 * Check if the current selection has specific formatting
 * @param {string} command - The formatting command to check
 * @returns {boolean} Whether the formatting is active
 */
export const isFormatActive = (command) => {
  return document.queryCommandState(command);
};

/**
 * Get the current format block type
 * @returns {string} The current block format (h1, h2, h3, p, blockquote)
 */
export const getCurrentBlockFormat = () => {
  const sel = window.getSelection();
  if (!sel?.anchorNode) return "p";

  // Start from the anchor node and walk up to find block-level elements
  let node =
    sel.anchorNode.nodeType === Node.ELEMENT_NODE
      ? sel.anchorNode
      : sel.anchorNode.parentElement;

  while (node) {
    const tag = node.tagName?.toUpperCase();

    // Check for heading or paragraph tags - return immediately when found
    // This works for content inside list items too (headings may wrap lists)
    if (["H1", "H2", "H3", "P", "BLOCKQUOTE"].includes(tag)) {
      return tag.toLowerCase();
    }

    // Stop at contenteditable boundary
    if (node.contentEditable === "true") {
      break;
    }

    node = node.parentElement;
  }

  return "p";
};

/**
 * Insert an image at the current cursor position
 * @param {string} src - The image source (URL or base64 data)
 * @param {object} options - Optional image attributes
 */
export const insertImage = (src, options = {}) => {
  const { alt = "", width = "auto", maxWidth = "100%" } = options;

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.style.maxWidth = maxWidth;
  img.style.height = "auto";
  if (width !== "auto") {
    img.style.width = width;
  }

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);

    // Move cursor after the image
    range.setStartAfter(img);
    range.setEndAfter(img);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

/**
 * Insert HTML at the current cursor position
 * @param {string} html - The HTML to insert
 */
export const insertHTML = (html) => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const div = document.createElement("div");
    div.innerHTML = html;
    const fragment = document.createDocumentFragment();

    while (div.firstChild) {
      fragment.appendChild(div.firstChild);
    }

    range.insertNode(fragment);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

/**
 * Get the plain text content from HTML and count characters
 * @param {string} rawText - The HTML content
 * @returns {number} Character count of plain text content
 */
export const countContentRealLength = (rawText) => {
  if (!rawText) return 0;

  // Remove HTML tags using a regular expression
  const textContent = rawText.replace(/<\/?[^>]+(>|$)/g, "");

  // Count the length of the cleaned content
  const characterCount = textContent.length;

  return characterCount;
};

/**
 * Clean up HTML content by removing unnecessary tags and attributes
 * @param {string} html - The HTML to clean
 * @returns {string} Cleaned HTML
 */
export const cleanHTML = (html) => {
  if (!html) return "";

  // Create a temporary div to parse the HTML
  const div = document.createElement("div");
  div.innerHTML = html;

  // Remove empty paragraphs and divs
  const emptyElements = div.querySelectorAll("p:empty, div:empty");
  emptyElements.forEach((el) => el.remove());

  // Remove style attributes (keep only semantic formatting)
  const elementsWithStyle = div.querySelectorAll("[style]");
  elementsWithStyle.forEach((el) => el.removeAttribute("style"));

  return div.innerHTML;
};
