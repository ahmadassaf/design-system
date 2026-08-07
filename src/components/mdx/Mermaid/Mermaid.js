'use client';

/**
 * Mermaid Diagram Component
 *
 * @description Renders Mermaid diagrams in MDX content with proper styling and error handling.
 * Supports client-side rendering with proper hydration handling.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useId, useRef, useState } from 'react';

import sanitizeHtml from '../../../utilities/sanitizeHtml';

// Lazy load mermaid only when component is used
const loadMermaid = async() => {
  const { 'default': mermaid } = await import('mermaid/dist/mermaid.core.mjs');

  return mermaid;
};

const getThemeColor = (name) => {
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  return value || 'currentColor';
};

/**
 * Renders a Mermaid diagram from provided chart definition
 *
 * @param {Object} props - Component props
 * @param {string} props.chart - The mermaid chart definition
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.description] - Accessible text alternative
 * @param {string} [props.id] - Custom ID for the diagram
 * @returns {JSX.Element} Rendered Mermaid diagram
 *
 * @example
 * <Mermaid chart="graph TD; A-->B; B-->C;" description="A flows to B, then B flows to C." />
 */
const Mermaid = ({ chart, className = '', description = 'Diagram', id }) => {
  const elementRef = useRef(null);
  const generatedDescriptionId = useId();
  const descriptionId = id ? `${id}-description` : generatedDescriptionId;
  const [ svg, setSvg ] = useState('');
  const [ error, setError ] = useState('');
  const [ isClient, setIsClient ] = useState(false);

  // Only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chart) return undefined;

    // Cancellation flag so a stale render never wins over a newer chart
    // and no setState happens after unmount.
    let cancelled = false;

    const renderDiagram = async() => {
      try {

        // Lazy load mermaid
        const mermaid = await loadMermaid();

        if (cancelled) return;

        // Initialize mermaid with configuration
        mermaid.initialize({
          'flowchart': {
            'curve': 'basis',
            'defaultRenderer': 'elk',
            'htmlLabels': true
          },
          'layout': 'elk',
          'securityLevel': 'loose',
          'suppressErrorRendering': true,
          'startOnLoad': false,
          'theme': 'default',
          'themeVariables': {
            'altSectionBkgColor': getThemeColor('--ds-color-mermaid-alt-section-bg'),
            'gridColor': getThemeColor('--ds-color-mermaid-grid'),
            'lineColor': getThemeColor('--ds-color-mermaid-line'),
            'primaryBorderColor': getThemeColor('--ds-color-mermaid-primary-border'),
            'primaryColor': getThemeColor('--ds-color-mermaid-primary'),
            'primaryTextColor': getThemeColor('--ds-color-mermaid-primary-text'),
            'secondaryColor': getThemeColor('--ds-color-mermaid-secondary'),
            'sectionBkgColor': getThemeColor('--ds-color-mermaid-section-bg'),
            'tertiaryColor': getThemeColor('--ds-color-mermaid-tertiary')
          }
        });

        const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const renderContainer = document.createElement('div');
        renderContainer.setAttribute('aria-hidden', 'true');
        renderContainer.style.left = '-9999px';
        renderContainer.style.position = 'absolute';
        renderContainer.style.top = '0';
        document.body.append(renderContainer);

        try {
          // Validate and render the diagram without letting Mermaid append fallback UI to <body>.
          const { 'svg': renderedSvg } = await mermaid.render(diagramId, chart, renderContainer);

          if (cancelled) return;

          setSvg(sanitizeHtml(renderedSvg, { 'allowStyleTags': true }));
          setError('');
        } finally {
          renderContainer.remove();
        }
      } catch {
        if (cancelled) return;

        setError('Failed to render diagram');
        setSvg('');
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [ chart, id, isClient ]);

  if (!isClient)
    return (
      <div className={ `mermaid-placeholder bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-4 ${className}` }>
        <div className='animate-pulse flex space-x-4'>
          <div className='flex-1 space-y-2 py-1'>
            <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded'></div>
              <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6'></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className={ `mermaid-error bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4 ${className}` }>
        <div className='flex items-center'>
          <svg className='h-5 w-5 text-red-500 mr-2' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
          </svg>
          <span className='text-red-700 dark:text-red-300 text-sm font-medium'>
            Mermaid Diagram Error: {error}
          </span>
        </div>
        <pre className='mt-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-x-auto'>
          {chart}
        </pre>
      </div>
    );

  if (!svg)
    return (
      <div className={ `mermaid-loading bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-4 ${className}` }>
        <div className='animate-pulse flex space-x-4'>
          <div className='flex-1 space-y-2 py-1'>
            <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded'></div>
              <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6'></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <figure
      ref={ elementRef }
      aria-labelledby={ descriptionId }
      className={ `mermaid-diagram bg-white dark:bg-gray-900 rounded-lg p-4 my-6 border border-gray-200 dark:border-gray-700 overflow-x-auto ${className}` }
      role='img'
    >
      <div aria-hidden='true' dangerouslySetInnerHTML={{ '__html': svg }} />
      <figcaption id={ descriptionId } className='sr-only'>{description}</figcaption>
    </figure>
  );
};

export default Mermaid;
