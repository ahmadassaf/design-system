'use client';

/**
 * MenuBlog Component
 *
 * @description Blog-specific navigation dropdown component that displays a categorized menu of blog categories.
 * Features a dropdown interface that shows all available blog categories with descriptions and hover effects.
 * This component is used specifically for blog navigation and category browsing.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import React from 'react';

import MenuDropDown from '../DropDown';
import Link from '../../core/Link';
import { cn } from '../../../utilities/cn';

/**
 * Renders a dropdown menu for blog categories navigation
 *
 * @description Interactive dropdown component that displays all blog categories in a structured menu.
 * Each category shows its title (with proper formatting) and description. The menu uses hover effects
 * and proper accessibility features. The dropdown is positioned absolutely and centers itself.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.categories - Array of blog category objects
 * @param {string} props.categories[].id - Unique identifier for the category
 * @param {string} props.categories[].title - Display title of the category (may contain hyphens)
 * @param {string} props.categories[].description - Brief description of the category
 *
 * @returns {JSX.Element} Blog categories dropdown menu
 *
 * @example
 * // Basic usage with categories data
 * const categories = [
 *   {
 *     id: 'web-development',
 *     title: 'web-development',
 *     description: 'Posts about web development'
 *   }
 * ];
 * <MenuBlog categories={categories} />
 *
 * @example
 * // Categories with proper formatting
 * <MenuBlog categories={blogCategories} />
 */
const MenuBlog = ({ categories }) => {
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

    <MenuDropDown controlsId={ dropdownId } id={ triggerId } name='Categories' menuDropDownOpen={ menuBlogOpen } outsideClickRef={ containerRef } setMenuDropDownOpen={ setMenuBlogOpen }></MenuDropDown>

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
        <div className='w-screen max-w-sm flex-auto overflow-hidden rounded-xl bg-white text-sm leading-5 shadow-2xl shadow-gray-950/15 dark:bg-gray-900 dark:shadow-black/50'>
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

        </div>
      </div>
    ) : null}

  </li>);
};

export default MenuBlog;
