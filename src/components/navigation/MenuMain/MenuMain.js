'use client';

/**
 * MenuMain Component
 *
 * @description Main navigation dropdown component that displays both blog categories and recent posts.
 * This comprehensive navigation menu combines category browsing with recent post discovery,
 * providing users with multiple pathways to explore blog content. Features a two-section layout
 * with categories at the top and recent posts at the bottom.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import React from 'react';

import MenuDropDown from '../DropDown';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import formatDate from '../../../utilities/formatDate';
import { useSiteConfig } from '../../../utilities/SiteConfig';
import { cn } from '../../../utilities/cn';

/**
 * Renders the main navigation dropdown with categories and recent posts
 *
 * @description Comprehensive dropdown menu that displays blog categories in the upper section
 * and the three most recent blog posts in a highlighted lower section. Each category shows
 * its title and description, while recent posts display publication date and title with
 * proper formatting and hover effects.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.categories - Array of blog category objects
 * @param {string} props.categories[].id - Unique identifier for the category
 * @param {string} props.categories[].title - Display title of the category
 * @param {string} props.categories[].description - Brief description of the category
 * @param {Array<Object>} props.allPosts - Array of all blog post objects (recent 3 will be shown)
 * @param {string} props.allPosts[].slug - URL slug for the post
 * @param {string} props.allPosts[].title - Title of the blog post
 * @param {string} props.allPosts[].date - Publication date of the post (ISO format)
 *
 * @returns {JSX.Element} Main navigation dropdown with categories and recent posts
 *
 * @example
 * // Basic usage with categories and posts
 * const categories = [{ id: 'tech', title: 'Technology', description: 'Tech posts' }];
 * const posts = [{ slug: 'post-1', title: 'My Post', date: '2024-01-01' }];
 * <MenuMain categories={categories} allPosts={posts} />
 *
 * @example
 * // Used in main navigation header
 * <MenuMain categories={blogCategories} allPosts={recentPosts} />
 */
const MenuMain = ({ categories, allPosts }) => {
  const { metadata } = useSiteConfig();
  const [ menuBlogOpen, setMenuBlogOpen ] = React.useState(false);
  const [ alignment, setAlignment ] = React.useState('center');
  const containerRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  const dropdownId = React.useId();
  const triggerId = `${dropdownId}-trigger`;

  const closeMenu = React.useCallback((returnFocus = false) => {
    setMenuBlogOpen(false);
    if (returnFocus) requestAnimationFrame(() => document.getElementById(triggerId)?.focus());
  }, [ triggerId ]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && menuBlogOpen) {
      event.preventDefault();
      closeMenu(true);

      return;
    }

    if (event.key === 'ArrowDown' && event.target?.id === triggerId && menuBlogOpen) {
      event.preventDefault();
      dropdownRef.current?.querySelector('a[href]')?.focus();
    }
  };

  React.useLayoutEffect(() => {
    if (!menuBlogOpen) return;

    const updateAlignment = () => {
      if (!containerRef.current || !dropdownRef.current) return;

      const triggerRect = containerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.firstElementChild?.getBoundingClientRect() || dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const gutter = 12;
      const centeredLeft = triggerRect.left + (triggerRect.width / 2) - (dropdownRect.width / 2);
      const centeredRight = centeredLeft + dropdownRect.width;

      if (centeredLeft < gutter) {
        setAlignment('left');
      } else if (centeredRight > viewportWidth - gutter) {
        setAlignment('right');
      } else {
        setAlignment('center');
      }
    };

    updateAlignment();
    window.addEventListener('resize', updateAlignment);

    return () => {
      window.removeEventListener('resize', updateAlignment);
    };
  }, [ menuBlogOpen ]);

  return (<li ref={ containerRef } className='relative' onKeyDown={ handleKeyDown }>

    <MenuDropDown controlsId={ dropdownId } id={ triggerId } name='Blog' menuDropDownOpen={ menuBlogOpen } outsideClickRef={ containerRef } setMenuDropDownOpen={ setMenuBlogOpen }></MenuDropDown>

    {menuBlogOpen ? (
      <div
        id={ dropdownId }
        aria-labelledby={ triggerId }
        ref={ dropdownRef }
        className={ cn(
          'absolute top-full z-50 mt-2 flex w-screen max-w-max px-2',
          alignment === 'left' && 'left-0',
          alignment === 'center' && 'left-1/2 -translate-x-1/2',
          alignment === 'right' && 'right-0'
        ) }
      >
        <div className='grid w-screen max-w-3xl flex-auto grid-cols-2 overflow-hidden rounded-xl bg-white text-sm leading-5 shadow-2xl shadow-gray-950/15 dark:bg-gray-900 dark:shadow-black/50'>
          <div className='p-2'>

            {categories.map((category) => (
              <div key={ category.id } className='group relative flex rounded-lg px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800'>
                <div>
                  <Link href={ `/blog/categories/${category.id}` } className='text-sm font-semibold capitalize text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300'>
                    {category.title.replace('-', ' ')}
                    <span className='absolute inset-0'></span>
                    <p className='mt-0.5 text-xs font-normal leading-5 text-gray-600 dark:text-gray-300'>{category.description}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-gray-50/80 p-2 dark:bg-gray-800/60'>
            <div className='flex items-center justify-between px-3 py-2.5'>
              <h3 className='text-sm font-semibold leading-5 text-gray-500 dark:text-gray-400'>Recent posts</h3>
              <Link href={ `/blog` } className='inline-flex items-center gap-1 text-xs font-medium leading-5 text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-300'>
                See all
                <Icon name='ArrowRight' decorative size='xs' />
              </Link>
            </div>
            <ul role='list' className='space-y-0.5 pb-1'>
              {allPosts.slice(0, 3).map((post) => (
                <li key={ post.slug } className='group relative rounded-lg px-3 py-2 hover:bg-white dark:hover:bg-gray-800'>
                  <time dateTime={ post.date } className='block text-xs font-normal leading-5 text-gray-600 dark:text-gray-300'>{formatDate(post.date, metadata.locale)}</time>
                  <Link href={ `/blog/${post.slug}` } className='block truncate text-sm font-medium leading-5 text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'>
                    {post.title}
                    <span className='absolute inset-0'></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    ) : null}

  </li>);
};

export default MenuMain;
