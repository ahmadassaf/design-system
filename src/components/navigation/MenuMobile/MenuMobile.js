'use client';

/**
 * MenuMobile Component
 *
 * @description Mobile responsive navigation menu component that provides a full-screen overlay
 * navigation experience for mobile devices. Features categories, navigation links, search functionality,
 * and newsletter signup. Includes proper accessibility attributes and smooth animations.
 * The parent menu closes it when the layout crosses the desktop breakpoint.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import React from 'react';

import Button from '../../core/Button';
import DialogPortal from '../../core/DialogPortal';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import NewsletterForm from '../../layout/NewsletterForm';
import MenuSearch from '../MenuSearch';

const formatCategoryTitle = (title) => title
  .split('-')
  .map((word) => word.toLowerCase() === 'ai' ? 'AI' : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
  .join(' ');

/**
 * Renders a full-screen mobile navigation menu
 *
 * @description Comprehensive mobile menu that overlays the entire screen when opened.
 * Features a search bar (on small screens), close button, blog categories with descriptions,
 * main navigation links, and a newsletter signup form. The menu uses proper semantic HTML
 * with ARIA attributes for accessibility and includes dark mode support.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.categories - Array of blog category objects
 * @param {string} props.categories[].id - Unique identifier for the category
 * @param {string} props.categories[].title - Display title of the category
 * @param {string} props.categories[].description - Brief description of the category
 * @param {Object} [props.blogLink] - Explicit primary blog destination
 * @param {Array<Object>} props.links - Array of additional navigation link objects
 * @param {string} props.links[].href - URL for the navigation link
 * @param {string} props.links[].title - Display text for the navigation link
 * @param {Function} props.setMobileMenuOpen - Function to close the mobile menu
 * @param {Function} props.setLauncherOpen - Function to open the search/command launcher
 *
 * @returns {JSX.Element} Full-screen mobile navigation menu overlay
 *
 * @example
 * // Basic usage in mobile navigation
 * const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 * const [isLauncherOpen, setIsLauncherOpen] = useState(false);
 *
 * <MenuMobile
 *   categories={blogCategories}
 *   links={navigationLinks}
 *   setMobileMenuOpen={setIsMobileMenuOpen}
 *   setLauncherOpen={setIsLauncherOpen}
 * />
 *
 * @example
 * // The parent menu closes this dialog when the desktop breakpoint is reached.
 */
const MenuMobile = ({ blogLink = { href: '/blog', title: 'Blog' }, categories = [], links = [], setMobileMenuOpen, setLauncherOpen }) => {
  const dialogRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const categoriesId = React.useId();

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);

        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (!firstFocusableElement || !lastFocusableElement) {
        event.preventDefault();

        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ setMobileMenuOpen ]);

  const handleSearchOpen = (open) => {
    if (open) setMobileMenuOpen(false);
    setLauncherOpen(open);
  };

  return (
    <DialogPortal initialFocusRef={ closeButtonRef }>
    <div ref={ dialogRef } role='dialog' aria-modal='true' aria-label='Mobile navigation'>

      <div className='fixed inset-y-0 right-0 z-[var(--ds-z-overlay)] w-full overflow-y-auto bg-white px-6 py-8 shadow-sm dark:bg-gray-900 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='mb-10 flex items-start justify-between gap-4'>
          <div className='w-full'>
            <MenuSearch className='w-full sm:w-full' setOpen={ handleSearchOpen }></MenuSearch>
          </div>
          <Button ref={ closeButtonRef } variant='ghost' tone='neutral' size='sm' className='h-11 w-11 shrink-0 p-0' onClick={ () => setMobileMenuOpen(false) }>
            <span className='sr-only'>Close menu</span>
            <Icon name='X' decorative size='md' />
          </Button>
        </div>
        <nav aria-label='Mobile navigation links' className='flow-root'>
          <div className='-my-6 divide-y divide-gray-500/10'>
            <ul className='space-y-2 pb-6'>
              <li>
                <Link href={ blogLink.href } onClick={ () => setMobileMenuOpen(false) } className='-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-blue-950 hover:bg-blue-50 hover:text-blue-900 dark:text-white dark:hover:bg-blue-950/40 dark:hover:text-blue-200'>{blogLink.title}</Link>
                {categories.length ? <>
                  <span className='sr-only' id={ categoriesId }>Blog categories</span>
                  <ul aria-labelledby={ categoriesId } className='-mx-3 mt-2 space-y-2'>
                  {categories.map((category) => (
                    <li key={ category.id }>
                      <Link href={ `/blog/categories/${category.id}` } onClick={ () => setMobileMenuOpen(false) } className='group block rounded-lg py-2 pl-6 pr-3 text-sm font-medium leading-7 text-blue-950 hover:bg-blue-50 hover:text-blue-900 dark:text-white dark:hover:bg-blue-950/40 dark:hover:text-blue-200'>{formatCategoryTitle(category.title)}
                        <span className='mt-1 block text-sm font-light text-gray-600 group-hover:text-blue-800 dark:text-gray-100 dark:group-hover:text-blue-200'>{category.description}</span>
                      </Link>
                    </li>
                  ))}
                  </ul>
                </> : null}
              </li>

              {links.map((link) => (
                <li key={ link.href }>
                  <Link href={ link.href } onClick={ () => setMobileMenuOpen(false) } className='-mx-3 block whitespace-nowrap rounded-lg px-3 py-2 text-base font-medium leading-7 text-blue-950 hover:bg-blue-50 hover:text-blue-900 dark:text-white dark:hover:bg-blue-950/40 dark:hover:text-blue-200'>{link.title}</Link>
                </li>
              ))}

            </ul>

            <div>
              <NewsletterForm />
            </div>

          </div>
        </nav>
      </div>
    </div>
    </DialogPortal>
  );
};

export default MenuMobile;
