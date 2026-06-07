/**
 * Tooltip Component
 *
 * @description Simple tooltip component that displays additional information on hover.
 * Features a small icon indicator with text appearing above it on hover.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

'use client';

import { useId, useState } from 'react';

import Icon from '@/components/core/Icon';

/**
 * Renders an interactive tooltip with hover effects
 *
 * @param {Object} props - Component props
 * @param {string} props.message - The tooltip text to display on hover (alias for text)
 * @param {string} props.text - The tooltip text to display on hover
 * @param {React.ReactNode} props.children - The content that triggers the tooltip
 * @returns {JSX.Element} A span element with tooltip functionality
 *
 * @example
 * // In MDX content:
 * <Tooltip message="This provides additional context">
 *   Hover over this text
 * </Tooltip>
 */
export default function Tooltip({ message, text, children }) {
  const [ tooltipOpen, setTooltipOpen ] = useState(false);
  const tooltipId = useId();

  // Support both message and text props for flexibility
  const tooltipText = message || text || '';

  return (
    <span className='inline-flex items-center align-middle'>
      {children}
      <span
        className='group relative ml-1 inline-flex items-center align-middle rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        aria-describedby={ tooltipText ? tooltipId : undefined }
        onBlur={ () => setTooltipOpen(false) }
        onFocus={ () => setTooltipOpen(true) }
        onMouseEnter={ () => setTooltipOpen(true) }
        onMouseLeave={ () => setTooltipOpen(false) }
        tabIndex={ 0 }
      >
        <Icon
          name='Info'
          decorative
          className='h-3.5 w-3.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-help transition-colors'
        />
        {/* Simple tooltip above icon */}
        <span
          id={ tooltipId }
          role='tooltip'
          className={ `absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded ${tooltipOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] max-w-[500px] whitespace-normal text-center pointer-events-none` }
        >
          {tooltipText}
        </span>
      </span>
    </span>
  );
}
