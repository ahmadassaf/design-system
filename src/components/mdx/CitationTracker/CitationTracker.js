'use client';

/**
 * Citation Tracker Component
 *
 * @description Tracks the last clicked citation and updates back-links dynamically.
 * Ensures that the bibliography back-link (↩) always returns to the most recently
 * visited citation instance.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect } from 'react';

import { findBackLink, getStoredCitation, isPopoverClickHandlerActive, readCitationKeys, setStoredCitation } from '../citations';

/**
 * Component that tracks citation clicks and updates back-link targets
 */
const CitationTracker = () => {
  useEffect(() => {
    const handleCitationClick = (event) => {

      // CitationPopover's richer handler owns clicks while it is mounted
      if (isPopoverClickHandlerActive()) return;

      // Direct citation clicks only; navigation to the bibliography needs no tracking
      const citationLink = event.target.closest('a[data-citation-popover="true"]');

      if (citationLink) {

        // Direct citation click - update back-links to remember this instance
        const { citationKeys } = citationLink.dataset;
        const citationId = citationLink.id;

        if (!citationKeys || !citationId) return;

        const keys = readCitationKeys(citationKeys);

        // Update back-links for all citations that were clicked
        keys.forEach((key) => {
          const backLink = findBackLink(key);

          if (backLink) {

            // Update the href to point to this specific citation instance
            backLink.href = `#${citationId}`;

            // Store the last visited instance in localStorage for persistence
            if (typeof window !== 'undefined')
              setStoredCitation(key, citationId);
          }
        });
      }
    };

    const handlePopoverClick = (event) => {
      if (isPopoverClickHandlerActive()) return;
      const citationItem = event.target.closest('[data-citation-popover-item="multiple"]');

      if (!citationItem) return;

      const { citationKey } = citationItem.dataset;

      if (!citationKey) return;

      // Find the most recent citation instance for this key from localStorage
      const lastInstanceId = typeof window === 'undefined' ? null : getStoredCitation(citationKey);

      if (lastInstanceId) {
        const backLink = findBackLink(citationKey);

        if (backLink)
          backLink.href = `#${lastInstanceId}`;
      }
    };

    // Initialize back-links from localStorage on page load
    const initializeBackLinks = () => {
      const backLinks = document.querySelectorAll('a.citation-back-link[data-citation-key]');

      backLinks.forEach((backLink) => {
        const { citationKey } = backLink.dataset;
        const lastInstanceId = typeof window === 'undefined' ? null : getStoredCitation(citationKey);

        if (lastInstanceId && document.getElementById(lastInstanceId))
          backLink.href = `#${lastInstanceId}`;
      });
    };

    // Add event listeners
    document.addEventListener('click', handleCitationClick, true);
    document.addEventListener('click', handlePopoverClick, true);

    // Initialize on load
    initializeBackLinks();

    return () => {
      document.removeEventListener('click', handleCitationClick, true);
      document.removeEventListener('click', handlePopoverClick, true);
    };
  }, []);

  return null; // This component renders nothing
};

export default CitationTracker;