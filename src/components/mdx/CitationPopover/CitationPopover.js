'use client';

/**
 * Citation Popover Component
 *
 * @description Displays a popover preview of citations when hovering over citation numbers.
 * Works with data attributes added by the rehype-simple-citations plugin.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import { useEffect, useRef, useState } from 'react';

import LatexText from '../LatexText';

import styles from './CitationPopover.module.css';

const CITATION_TRIGGER_SELECTOR = '[data-citation-popover="true"]';

const readJsonArray = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getBackLink = (citationKey) => {
  const backLinks = document.querySelectorAll('a.citation-back-link[data-citation-key]');

  return Array.from(backLinks).find((backLink) => backLink.dataset.citationKey === citationKey) || null;
};

const setStoredCitation = (citationKey, originCitationId) => {
  try {
    window.localStorage.setItem(`citation-last-${citationKey}`, originCitationId);
  } catch {

    // Storage can be unavailable in private or restricted browser contexts.
  }
};

/**
 * Ensure grouped citations render one marker per citation number, and mark
 * every trigger as bound so consumers can detect the popover is active.
 * Idempotent, so it is safe to re-run from the MutationObserver.
 */
const prepareCitationTriggers = () => {
  const citationGroups = document.querySelectorAll(`a.citation-link.citation-group${CITATION_TRIGGER_SELECTOR}`);

  citationGroups.forEach((citationGroup) => {
    if (citationGroup.querySelector('[data-citation-marker-number]')) return;

    const numbers = readJsonArray(citationGroup.dataset.citationNumbers);

    if (!numbers.length) return;

    citationGroup.textContent = '';
    numbers.forEach((number) => {
      const marker = document.createElement('span');

      marker.dataset.citationMarkerNumber = 'true';
      marker.textContent = String(number);
      citationGroup.appendChild(marker);
    });
  });

  document.querySelectorAll(CITATION_TRIGGER_SELECTOR).forEach((trigger) => {
    trigger.dataset.citationPopoverBound = 'true';
  });
};

/**
 * Parse citation content for popover display
 */
const parseCitationContent = (citationTexts, citationNumbers, citationKeys, citationText) => {
  if (!citationTexts || !citationNumbers || !citationKeys)
    return { 'content': citationText || 'Citation not found', 'type': 'text' };

  try {
    const texts = readJsonArray(citationTexts);
    const numbers = readJsonArray(citationNumbers);
    const keys = readJsonArray(citationKeys);

    if (texts.length === 0)
      return { 'content': citationText || 'Citation not found', 'type': 'text' };

    if (texts.length === 1)
      return { 'content': texts[0], 'type': 'single' };

    return {
      'items': texts.map((text, index) => ({
        'key': keys[index],
        'number': numbers[index],
        text
      })),
      'type': 'multiple'
    };
  } catch {
    return { 'content': citationText || 'Citation parsing error', 'type': 'text' };
  }
};

const calculatePosition = (targetRect, popoverWidth, popoverHeight) => {
  const margin = 12;
  const offset = 8;
  const centerX = targetRect.left + (targetRect.width / 2);
  const below = targetRect.bottom + offset;
  const above = targetRect.top - popoverHeight - offset;

  let left = centerX - (popoverWidth / 2);
  let top = below;

  if (below + popoverHeight > window.innerHeight - margin && above > margin)
    top = above;

  left = Math.max(margin, Math.min(left, window.innerWidth - popoverWidth - margin));
  top = Math.max(margin, Math.min(top, window.innerHeight - popoverHeight - margin));

  return { left, top };
};

/**
 * Update back-link for a citation and make it visible
 */
const updateCitationBackLink = (citationKey, originCitationId) => {
  const backLink = getBackLink(citationKey);

  if (!backLink) return;

  // Point the back-link at the specific clicked instance and reveal it
  backLink.href = `#${originCitationId}`;
  backLink.style.display = 'inline-block';
  backLink.setAttribute('data-recently-clicked', 'true');

  if (typeof window !== 'undefined')
    setStoredCitation(citationKey, originCitationId);
};

/**
 * Hide back-link after it's been used
 */
const hideBackLink = (citationKey) => {
  const backLink = getBackLink(citationKey);

  if (backLink) {
    backLink.style.display = 'none';
    backLink.removeAttribute('data-recently-clicked');
  }
};

/**
 * Component that adds popover functionality to citation references.
 *
 * All interaction is handled through document-level delegated listeners
 * registered once on mount; mutable interaction state lives in refs so the
 * effect never needs to re-run.
 */
const CitationPopover = () => {
  const [ popover, setPopover ] = useState(null);
  const popoverRef = useRef(null);
  const popoverStateRef = useRef(null);
  const activeTriggerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Mirror state into a ref so the once-bound handlers always see fresh data
  useEffect(() => {
    popoverStateRef.current = popover;
  }, [ popover ]);

  useEffect(() => {
    const clearCloseTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const closePopover = () => {
      clearCloseTimeout();
      activeTriggerRef.current?.setAttribute('aria-expanded', 'false');
      activeTriggerRef.current = null;
      setPopover(null);
    };

    const scheduleClose = (delay) => {
      clearCloseTimeout();
      timeoutRef.current = setTimeout(closePopover, delay);
    };

    const openPopoverFor = (target) => {
      clearCloseTimeout();

      const { citationText, citationTexts, citationNumbers, citationKeys } = target.dataset;
      const parsedContent = parseCitationContent(citationTexts, citationNumbers, citationKeys, citationText);

      if (!parsedContent) return;

      const rect = target.getBoundingClientRect();
      const itemCount = readJsonArray(citationNumbers).length || 1;
      const popoverWidth = itemCount > 1 ? 420 : 360;
      const popoverHeight = itemCount > 1 ? Math.min(320, 96 + (itemCount * 86)) : 150;
      const position = calculatePosition(rect, popoverWidth, popoverHeight);

      if (activeTriggerRef.current && activeTriggerRef.current !== target)
        activeTriggerRef.current.setAttribute('aria-expanded', 'false');

      target.setAttribute('aria-expanded', 'true');
      activeTriggerRef.current = target;

      setPopover({
        'content': parsedContent,
        'left': Math.round(position.left),
        'number': target.textContent,
        'originCitationId': target.id,
        'top': Math.round(position.top)
      });
    };

    const isInsidePopover = (node) => Boolean(node && popoverRef.current?.contains(node));

    const handlePointerOver = (event) => {
      const trigger = event.target.closest?.(CITATION_TRIGGER_SELECTOR);

      if (trigger) {
        openPopoverFor(trigger);

        return;
      }

      // Moving onto the popover itself cancels any pending close
      if (isInsidePopover(event.target)) clearCloseTimeout();
    };

    const handlePointerOut = (event) => {
      const trigger = event.target.closest?.(CITATION_TRIGGER_SELECTOR);

      if (!trigger && !isInsidePopover(event.target)) return;

      const related = event.relatedTarget;

      // Ignore moves within the trigger, into the popover, or onto another trigger
      if (related && (trigger?.contains(related) || isInsidePopover(related) || related.closest?.(CITATION_TRIGGER_SELECTOR))) return;

      scheduleClose(trigger ? 300 : 150);
    };

    const handleFocusIn = (event) => {
      const trigger = event.target.closest?.(CITATION_TRIGGER_SELECTOR);

      if (trigger) openPopoverFor(trigger);
    };

    const handleFocusOut = (event) => {
      const trigger = event.target.closest?.(CITATION_TRIGGER_SELECTOR);

      if (trigger || isInsidePopover(event.target)) scheduleClose(300);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && popoverStateRef.current) closePopover();
    };

    const handleScroll = () => {
      clearCloseTimeout();
      if (popoverStateRef.current) closePopover();
    };

    const handleClick = (event) => {

      // 1. Clicks on a row inside a multi-citation popover
      const citationItem = event.target.closest?.('[data-citation-popover-item="multiple"]');

      if (citationItem) {
        const { citationKey } = citationItem.dataset;

        if (!citationKey) return;

        event.preventDefault();

        // Update the back-link ONLY for the specific citation that was clicked
        const originCitationId = popoverStateRef.current?.originCitationId;

        if (originCitationId) updateCitationBackLink(citationKey, originCitationId);

        const targetElement = document.getElementById(`citation-${citationKey}`);

        if (targetElement) {
          targetElement.scrollIntoView({ 'block': 'center' });
          closePopover();
        }

        return;
      }

      // 2. Clicks on citation numbers in the text
      const citationLink = event.target.closest?.('a.citation-link');

      if (citationLink) {
        const href = citationLink.getAttribute('href');
        const citationKeys = citationLink.getAttribute('data-citation-keys');

        if (citationKeys) {
          const keys = readJsonArray(citationKeys);
          const originId = citationLink.id || citationLink.getAttribute('id');

          if (keys.length > 0 && originId) {
            keys.forEach((key) => updateCitationBackLink(key, originId));

            if (href?.startsWith('#citation-group-')) {
              event.preventDefault();
              document.getElementById(`citation-${keys[0]}`)?.scrollIntoView({ 'block': 'center' });
            }
          }
        } else if (href && href.startsWith('#citation-')) {
          const citationKey = href.replace('#citation-', '').replace(/^group-\d+-/, '');
          const originId = citationLink.id || citationLink.getAttribute('id');

          if (citationKey && originId) updateCitationBackLink(citationKey, originId);
        }

        return;
      }

      // 3. Clicks on bibliography back-links hide them after navigation
      const backLink = event.target.closest?.('a.citation-back-link');

      if (backLink) {
        const citationKey = backLink.getAttribute('data-citation-key');

        if (citationKey) setTimeout(() => hideBackLink(citationKey), 100);
      }
    };

    prepareCitationTriggers();

    const bindTimer = window.setTimeout(prepareCitationTriggers, 0);

    // Catch late-hydrated citation markup; prepareCitationTriggers is idempotent
    const observer = new MutationObserver(prepareCitationTriggers);

    if (document.body)
      observer.observe(document.body, { 'childList': true, 'subtree': true });

    document.addEventListener('pointerover', handlePointerOver, true);
    document.addEventListener('pointerout', handlePointerOut, true);
    document.addEventListener('focusin', handleFocusIn, true);
    document.addEventListener('focusout', handleFocusOut, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.clearTimeout(bindTimer);
      observer.disconnect();

      document.removeEventListener('pointerover', handlePointerOver, true);
      document.removeEventListener('pointerout', handlePointerOut, true);
      document.removeEventListener('focusin', handleFocusIn, true);
      document.removeEventListener('focusout', handleFocusOut, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('scroll', handleScroll, true);

      clearCloseTimeout();

      document.querySelectorAll(CITATION_TRIGGER_SELECTOR).forEach((trigger) => {
        delete trigger.dataset.citationPopoverBound;
        trigger.removeAttribute('aria-expanded');
      });
    };
  }, []);

  return (
    <div data-gaudi-citation-popover-root='true'>
      {popover ? (
        <div
          ref={ popoverRef }
          role='tooltip'
          className={ `${styles.popover} ${styles.ready}` }
          style={{
            'left': `${popover.left}px`,
            'top': `${popover.top}px`
          }}
        >
          <div className={ styles.content }>
            <div className={ styles.body }>
              {popover.content.type === 'single' && (
                <div className={ styles.item }>
                  <LatexText>{popover.content.content}</LatexText>
                </div>
              )}

              {popover.content.type === 'multiple' && (
                popover.content.items.map((item, index) => (
                  <div
                    key={ index }
                    className={ `${styles.item} ${styles.multiple}` }
                    data-citation-key={ item.key }
                    data-citation-popover-item='multiple'
                    role='link'
                    tabIndex={ 0 }
                    onKeyDown={ (event) => {
                      if (event.key === 'Enter' || event.key === ' ') event.currentTarget.click();
                    } }
                  >
                    <div className={ styles.number }>{item.number}</div>
                    <div className={ styles.citationContent }>
                      <LatexText>{item.text}</LatexText>
                    </div>
                  </div>
                ))
              )}

              {popover.content.type === 'text' && (
                <LatexText>{popover.content.content}</LatexText>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CitationPopover;
