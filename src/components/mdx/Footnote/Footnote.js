'use client';

/**
 * Footnote Component
 *
 * @description Displays a popover preview of footnotes when hovering over footnote numbers.
 * Works with data attributes added by the rehype-footnote-popover plugin.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useRef, useState } from 'react';

import sanitizeHtml from '../../../utilities/sanitizeHtml';

import styles from './Footnote.module.css';

const calculatePosition = (rect) => {
  const margin = 12;
  const offset = 10;
  const popoverWidth = 300;
  const viewportWidth = Math.max(window.innerWidth || 0, margin * 2);
  const viewportHeight = Math.max(window.innerHeight || 0, margin * 2);
  const safeWidth = Math.min(popoverWidth, Math.max(viewportWidth - (margin * 2), 0)) || popoverWidth;
  let xPos = rect.right + offset;
  let yPos = rect.top + (rect.height / 2);

  if (xPos + safeWidth > viewportWidth - margin) xPos = rect.left - safeWidth - offset;

  xPos = Math.max(margin, Math.min(xPos, Math.max(margin, viewportWidth - safeWidth - margin)));
  yPos = Math.max(margin, Math.min(yPos, viewportHeight - margin));

  return { 'x': xPos, 'y': yPos };
};

/**
 * Component that adds popover functionality to footnote references
 */
const Footnote = () => {
  const [ popover, setPopover ] = useState(null);
  const [ isReady, setIsReady ] = useState(false);
  const popoverRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleFootnoteHover = (event) => {
      const target = event.target.closest?.('[data-footnote-popover="true"]');

      // Check if hovering over a footnote link with popover data
      if (target) {
        event.preventDefault();

        // Clear any existing timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (event.type === 'mouseenter' || event.type === 'focusin') {

          // Get footnote data from data attributes
          const { footnoteContent } = target.dataset;
          const footnoteNumber = target.dataset.footnoteNumber || target.textContent;

          if (footnoteContent) {

            // Get position of the footnote link
            const rect = target.getBoundingClientRect();

            // Show popover with a slight delay
            timeoutRef.current = setTimeout(() => {
              setIsReady(false);

              const position = calculatePosition(rect);

              setPopover({
                'content': sanitizeHtml(footnoteContent),
                'footnoteNumber': footnoteNumber,
                'x': position.x,
                'y': position.y
              });

              // Small delay to ensure positioning is applied before showing
              window.requestAnimationFrame(() => {
                setIsReady(true);
              });
            }, 300);
          }
        } else if (event.type === 'mouseleave' || event.type === 'focusout') {

          // Hide popover with a slight delay to allow moving to popover
          timeoutRef.current = setTimeout(() => {
            setIsReady(false);
            setPopover(null);
          }, 200);
        }
      }
    };

    // Add listeners to the document body for all footnote links
    document.body.addEventListener('mouseenter', handleFootnoteHover, true);
    document.body.addEventListener('mouseleave', handleFootnoteHover, true);
    document.body.addEventListener('focusin', handleFootnoteHover, true);
    document.body.addEventListener('focusout', handleFootnoteHover, true);

    return () => {
      document.body.removeEventListener('mouseenter', handleFootnoteHover, true);
      document.body.removeEventListener('mouseleave', handleFootnoteHover, true);
      document.body.removeEventListener('focusin', handleFootnoteHover, true);
      document.body.removeEventListener('focusout', handleFootnoteHover, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle popover hover to keep it visible
  const handlePopoverEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handlePopoverLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsReady(false);
      setPopover(null);
    }, 200);
  };

  if (!popover) return null;

  return (
    <div
      ref={ popoverRef }
      className={ `${styles.popover} ${isReady ? styles.ready : ''}` }
      style={{
        'left': `${popover.x}px`,
        'position': 'fixed',
        'top': `${popover.y}px`,
        'transform': 'translateY(-50%)',
        'zIndex': 9999
      }}
      onMouseEnter={ handlePopoverEnter }
      onMouseLeave={ handlePopoverLeave }
    >
      <div className={ styles.content }>
        <div className={ styles.body } dangerouslySetInnerHTML={{ '__html': popover.content }} />
      </div>
    </div>
  );
};

export default Footnote;
