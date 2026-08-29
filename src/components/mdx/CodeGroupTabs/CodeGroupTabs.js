'use client';

/**
 * Code Group Tabs Component
 *
 * @description Client-side React component to handle code group tab functionality.
 * Replaces the static JavaScript approach with proper React lifecycle management
 * for Next.js client-side routing compatibility.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect } from 'react';

import styles from './CodeGroupTabs.module.css';

/**
 * Initializes code group tab functionality for all code groups on the page
 *
 * @description This component runs on every page load and navigation to ensure
 * code group tabs work correctly with Next.js client-side routing. It finds all
 * rehype-code-group elements and attaches click handlers for tab switching.
 *
 * @returns {null} This component doesn't render anything
 *
 * @example
 * // Include in layout or page components
 * <CodeGroupTabs />
 */
const CodeGroupTabs = () => {
  useEffect(() => {
    const initializeCodeGroups = () => {
      const codeGroups = document.querySelectorAll('.rehype-code-group');

      codeGroups.forEach((group) => {

        // Skip if already initialized
        if (group.hasAttribute('data-tabs-initialized')) return;

        group.classList.add(styles.root);

        const tabs = Array.from(group.querySelectorAll('.rcg-tab'));
        const blocks = group.querySelectorAll('.rcg-block');
        const codeBlocks = Array.from(group.querySelectorAll('.rcg-block pre'));
        let activeTab = group.querySelector('.rcg-tab.active');
        let activeBlock = group.querySelector('.rcg-block.active');

        codeBlocks.forEach((codeBlock) => {
          if (codeBlock.hasAttribute('tabindex')) return;

          codeBlock.setAttribute('data-code-group-tabindex', 'true');
          codeBlock.setAttribute('tabindex', '0');
        });

        // Roving tabindex: only the active tab is in the tab order (APG tabs pattern)
        const syncTabIndexes = () => {
          const current = activeTab || tabs[0];

          tabs.forEach((tab) => tab.setAttribute('tabindex', tab === current ? '0' : '-1'));
        };

        const revealTab = (tab) => {
          const container = tab?.parentElement;

          if (!container) return;

          const tabStart = tab.offsetLeft;
          const tabEnd = tabStart + tab.offsetWidth;
          const visibleStart = container.scrollLeft;
          const visibleEnd = visibleStart + container.clientWidth;

          if (tabStart < visibleStart)
            container.scrollTo({ 'behavior': 'auto', 'left': tabStart });
          else if (tabEnd > visibleEnd)
            container.scrollTo({ 'behavior': 'auto', 'left': tabEnd - container.clientWidth });
        };

        // Activate the tab at the given index (selection + roving tabindex)
        const activateTab = (index) => {
          const tab = tabs[index];

          if (!tab || !blocks[index]) return;

          // Remove active states
          if (activeTab) {
            activeTab.classList.remove('active');
            activeTab.setAttribute('aria-selected', 'false');
          }
          if (activeBlock) {
            activeBlock.classList.remove('active');
            activeBlock.setAttribute('hidden', 'true');
          }

          // Add active states
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          blocks[index].classList.add('active');
          blocks[index].removeAttribute('hidden');

          // Update references
          activeTab = tab;
          activeBlock = blocks[index];
          syncTabIndexes();
          revealTab(tab);
        };

        // Create click handler for this group
        const handleTabClick = (event) => {
          const tab = event.target.closest('.rcg-tab');

          if (!tab) return;

          const index = tabs.indexOf(tab);

          if (index === -1) return;

          activateTab(index);
        };

        // APG tabs keyboard pattern: arrows move focus and selection, Home/End jump
        const handleTabKeyDown = (event) => {
          const tab = event.target.closest('.rcg-tab');

          if (!tab) return;

          const currentIndex = tabs.indexOf(tab);

          if (currentIndex === -1) return;

          let nextIndex = null;

          if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
          if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          if (event.key === 'Home') nextIndex = 0;
          if (event.key === 'End') nextIndex = tabs.length - 1;

          if (nextIndex === null) return;

          event.preventDefault();
          activateTab(nextIndex);
          tabs[nextIndex].focus();
        };

        // Attach event listeners and set the initial roving tabindex
        group.addEventListener('click', handleTabClick);
        group.addEventListener('keydown', handleTabKeyDown);
        syncTabIndexes();

        // Mark as initialized
        group.setAttribute('data-tabs-initialized', 'true');

        // Store cleanup function for later use
        group._tabsCleanup = () => {
          group.removeEventListener('click', handleTabClick);
          group.removeEventListener('keydown', handleTabKeyDown);
          group.removeAttribute('data-tabs-initialized');
          group.classList.remove(styles.root);
          codeBlocks.forEach((codeBlock) => {
            if (codeBlock.getAttribute('data-code-group-tabindex') !== 'true') return;

            codeBlock.removeAttribute('data-code-group-tabindex');
            codeBlock.removeAttribute('tabindex');
          });
          delete group._tabsCleanup;
        };
      });
    };

    /*
     * Initialization is idempotent (each group is marked data-tabs-initialized),
     * so one immediate pass plus a MutationObserver for content that streams in
     * later covers every load path.
     */
    initializeCodeGroups();

    const observer = new MutationObserver((mutations) => {
      const hasCodeGroups = mutations.some((mutation) => mutation.type === 'childList' && Array.from(mutation.addedNodes).some((node) => node.nodeType === 1 && (
        node.classList?.contains('rehype-code-group') ||
          node.querySelector?.('.rehype-code-group')
      )));

      if (hasCodeGroups) initializeCodeGroups();
    });

    observer.observe(document.body, {
      'childList': true,
      'subtree': true
    });

    // Cleanup function
    return () => {
      observer.disconnect();

      // Clean up all initialized code groups
      const codeGroups = document.querySelectorAll('.rehype-code-group[data-tabs-initialized]');

      codeGroups.forEach((group) => {
        if (group._tabsCleanup) group._tabsCleanup();
      });
    };
  }, []);

  return null; // This component only attaches behavior and scoped classes to generated code groups
};

export default CodeGroupTabs;
