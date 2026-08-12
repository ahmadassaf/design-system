'use client';

import { useId, useState } from 'react';

import Icon from '../../core/Icon';

/**
 * Search Component
 *
 * @description Input field component for filtering/searching articles with
 * integrated search icon and dark mode support. Provides real-time search
 * functionality through callback function.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

/**
 * Subtle search input component for article filtering
 *
 * @param {Object} props - Component props
 * @param {string} [props.clearLabel='Clear article filter'] - Accessible label for the clear button
 * @param {string} [props.label='Filter articles'] - Accessible input label
 * @param {string} [props.resultsId] - ID of the filtered results region
 * @param {Function} props.setSearchValue - Callback function to handle search value changes
 * @param {string} [props.value] - Controlled search value
 * @returns {JSX.Element} Minimal search input that morphs into the page
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * <Search setSearchValue={setSearchTerm} />
 */
const Search = ({ clearLabel = 'Clear article filter', label = 'Filter articles', resultsId, setSearchValue, value }) => {
  const generatedId = useId();
  const inputId = `article-filter-${generatedId}`;
  const [ internalValue, setInternalValue ] = useState('');
  const currentValue = value ?? internalValue;
  const handleChange = (nextValue) => {
    if (value === undefined) setInternalValue(nextValue);
    setSearchValue(nextValue);
  };

  return (
    <div role='search' className='relative'>
      <label htmlFor={ inputId } className='sr-only'>{label}</label>
      <Icon
        name='Search'
        decorative
        size='sm'
        className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400'
      />
      <input
        id={ inputId }
        aria-controls={ resultsId }
        type='search'
        value={ currentValue }
        onChange={ (event) => handleChange(event.target.value) }
        placeholder={ label }
        className='block min-h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white/75 py-2.5 pl-10 pr-12 text-base text-gray-900 shadow-sm placeholder:text-gray-500 focus:placeholder:opacity-70 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-950/70 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950'
      />
      {currentValue ? (
        <button
          type='button'
          aria-label={ clearLabel }
          className='absolute right-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition-colors hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400'
          onClick={ () => handleChange('') }
        >
          <Icon name='X' decorative size='sm' />
        </button>
      ) : null}
    </div>
  );
};

export default Search;
