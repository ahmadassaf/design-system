'use client';

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
 * @param {Function} props.setSearchValue - Callback function to handle search value changes
 * @returns {JSX.Element} Minimal search input that morphs into the page
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * <Search setSearchValue={setSearchTerm} />
 */
const Search = ({ setSearchValue }) => (
  <div className='relative mt-8 border-none'>
    <input
      aria-label='Filter articles'
      type='search'
      onChange={ (event) => setSearchValue(event.target.value) }
      placeholder='Filter articles'
      className='block w-full rounded-sm border-0 border-b border-transparent bg-transparent px-1 py-3 text-gray-900 placeholder:text-gray-500 focus:placeholder:opacity-70 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-transparent dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950'
    />
    <svg aria-hidden='true' className='absolute right-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-300 ' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={ 2 } d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
    </svg>
  </div>
);

export default Search;
