'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DialogPortal = ({ children, initialFocusRef, lockScroll = true, restoreFocus = true }) => {
  const [ portalNode, setPortalNode ] = useState(null);
  const previouslyFocusedElementRef = useRef(null);

  if (!previouslyFocusedElementRef.current && typeof document !== 'undefined')
    previouslyFocusedElementRef.current = document.activeElement;

  useEffect(() => {
    const node = document.createElement('div');

    node.dataset.dialogPortal = 'true';
    document.body.append(node);
    setPortalNode(node);

    return () => node.remove();
  }, []);

  useEffect(() => {
    if (!portalNode) return undefined;

    const backgroundElements = Array.from(document.body.children).filter((element) => element !== portalNode);
    const previousStates = backgroundElements.map((element) => ({
      element,
      hadInert: element.hasAttribute('inert'),
      ariaHidden: element.getAttribute('aria-hidden')
    }));
    const previousBodyOverflow = document.body.style.overflow;

    backgroundElements.forEach((element) => {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    });

    if (lockScroll) document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => initialFocusRef?.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);

      previousStates.forEach(({ ariaHidden, element, hadInert }) => {
        if (!hadInert) element.removeAttribute('inert');
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });

      if (lockScroll) document.body.style.overflow = previousBodyOverflow;

      const previouslyFocusedElement = previouslyFocusedElementRef.current;

      if (restoreFocus && previouslyFocusedElement instanceof HTMLElement && previouslyFocusedElement.isConnected)
        previouslyFocusedElement.focus();
    };
  }, [ initialFocusRef, lockScroll, portalNode, restoreFocus ]);

  return portalNode ? createPortal(children, portalNode) : null;
};

export default DialogPortal;
