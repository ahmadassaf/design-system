/**
 * Citation Helpers
 *
 * @description Shared citation plumbing for CitationTracker and CitationPopover:
 * parsing citation-key payloads, locating bibliography back-links, and persisting
 * the last-visited citation instance. Also coordinates the two components so the
 * global tracker stands down while the richer popover handler is mounted.
 */

/**
 * Parses a JSON array attribute value, returning [] for anything invalid
 *
 * @param {string} value - Raw attribute value
 * @returns {Array} Parsed array or []
 */
export const readCitationKeys = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Finds the bibliography back-link element for a citation key
 *
 * @param {string} citationKey - Citation key
 * @returns {HTMLAnchorElement|null} The back-link, or null
 */
export const findBackLink = (citationKey) => {
  const backLinks = document.querySelectorAll('a.citation-back-link[data-citation-key]');

  return Array.from(backLinks).find((backLink) => backLink.dataset.citationKey === citationKey) || null;
};

/**
 * Reads the last-visited citation instance id from localStorage
 *
 * @param {string} citationKey - Citation key
 * @returns {string|null} Stored citation instance id, or null
 */
export const getStoredCitation = (citationKey) => {
  try {
    return window.localStorage.getItem(`citation-last-${citationKey}`);
  } catch {
    return null;
  }
};

/**
 * Persists the last-visited citation instance id
 *
 * @param {string} citationKey - Citation key
 * @param {string} citationId - Citation instance element id
 */
export const setStoredCitation = (citationKey, citationId) => {
  try {
    window.localStorage.setItem(`citation-last-${citationKey}`, citationId);
  } catch {

    // Storage can be unavailable in private or restricted browser contexts.
  }
};

/*
 * CitationPopover registers a document-level click handler that supersedes
 * CitationTracker's. The blog mounts the tracker globally and the popover on
 * post pages, so without this coordination every citation click would be
 * processed twice.
 */
let popoverHandlerCount = 0;

export const registerPopoverClickHandler = () => {
  popoverHandlerCount += 1;

  return () => {
    popoverHandlerCount -= 1;
  };
};

export const isPopoverClickHandlerActive = () => popoverHandlerCount > 0;
