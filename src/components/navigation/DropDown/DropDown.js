'use client';

/**
 * Menu Dropdown Component
 *
 * @description A reusable dropdown menu component that provides toggle functionality with outside click detection.
 * Features proper accessibility attributes and visual indicators for the dropdown state. Includes a custom hook
 * for handling clicks outside the component boundary.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import React from 'react';

import Button from '../../core/Button';
import Icon from '../../core/Icon';
import { cn } from '../../../utilities/cn';

/**
 * Dropdown menu component with outside click detection
 *
 * @description Renders a dropdown button with toggle functionality and automatic closing when clicking outside.
 * Uses a custom hook to detect outside clicks and manage the dropdown state.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - The text to display on the dropdown button
 * @param {boolean} props.menuDropDownOpen - Whether the dropdown is currently open
 * @param {Function} props.setMenuDropDownOpen - Function to toggle the dropdown state
 *
 * @returns {JSX.Element} The rendered dropdown menu component
 *
 * @example
 * <MenuDropDown
 *   name="Menu Options"
 *   menuDropDownOpen={isOpen}
 *   setMenuDropDownOpen={setIsOpen}
 * />
 */
const MenuDropDown = ({ className, controlsId, id, name, menuDropDownOpen, outsideClickRef, setMenuDropDownOpen }) => {
  const [ mounted, setMounted ] = React.useState(false);
  const triggerRef = React.useRef(null);

  // Only show dynamic classes after mount to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Handles toggling the dropdown open/closed state
   */
  const handlemenuDropDownOpen = () => {
    setMenuDropDownOpen(!menuDropDownOpen);
  };

  /**
   * Handles closing the dropdown when clicking outside
   */
  const handleClickOutside = () => {
    setMenuDropDownOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape' || !menuDropDownOpen) return;
    event.preventDefault();
    setMenuDropDownOpen(false);
  };

  /**
   * Custom hook for detecting clicks outside a component
   *
   * @param {Function} callback - Function to call when outside click is detected
   * @returns {React.RefObject} Ref to attach to the component
   */
  const useOutsideClick = (callback, boundaryRef) => {
    React.useEffect(() => {
      const handleClick = (event) => {
        if (boundaryRef.current && !boundaryRef.current.contains(event.target)) callback();
      };

      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, [ boundaryRef, callback ]);
  };

  useOutsideClick(handleClickOutside, outsideClickRef || triggerRef);

  return (
    <Button
      ref={ triggerRef }
      variant='ghost'
      tone='neutral'
      size='sm'
      className={ cn(
        'h-11 min-h-11 cursor-pointer gap-1 rounded-md px-1.5 py-2 text-sm font-medium leading-5 text-gray-950 hover:bg-transparent hover:text-blue-600 dark:text-gray-100 dark:hover:bg-transparent dark:hover:text-blue-300', mounted && menuDropDownOpen && 'text-blue-600 dark:text-blue-300', className
      ) }
      aria-controls={ controlsId }
      aria-expanded={ mounted ? menuDropDownOpen : false }
      aria-haspopup='true'
      id={ id }
      onClick={ handlemenuDropDownOpen }
      onKeyDown={ handleKeyDown }
    >
      { name }
      <Icon
        name='ChevronDown'
        decorative
        size='xs'
        className={ cn(
          'flex-none text-gray-400 transition-transform duration-200 motion-reduce:transition-none',
          mounted && menuDropDownOpen && 'rotate-180 text-blue-500 dark:text-blue-300'
        ) }
      />
    </Button>
  );
};

export default MenuDropDown;
