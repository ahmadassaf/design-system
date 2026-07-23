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

  React.useLayoutEffect(() => {
    if (!menuBlogOpen) return;

    const updateAlignment = () => {
      if (!containerRef.current || !dropdownRef.current) return;

      const triggerRect = containerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const gutter = 16;
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

  return (<li ref={ containerRef } className='relative'>

    <MenuDropDown name='Categories' menuDropDownOpen={ menuBlogOpen } setMenuDropDownOpen={ setMenuBlogOpen }></MenuDropDown>

    {menuBlogOpen ? (
      <div
        ref={ dropdownRef }
        className={ cn(
          'absolute top-full z-50 mt-3 flex w-screen max-w-max px-3 py-2',
          alignment === 'left' && 'left-0',
          alignment === 'center' && 'left-1/2 -translate-x-1/2',
          alignment === 'right' && 'right-0'
        ) }
      >
        <div className='w-screen max-w-md flex-auto overflow-hidden rounded-2xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/10 dark:bg-gray-900 dark:ring-gray-700/60'>
          <div className='p-4'>

            {categories.map((category) => (
              <div key={ category.id } className='group relative flex rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800'>
                <div>
                  <Link href={ `/blog/categories/${category.id}` } className='font-medium capitalize text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'>
                    {category.title.replace('-', ' ')}
                    <span className='absolute inset-0'></span>
                    <p className='mt-1 text-sm font-light text-gray-600 dark:text-gray-300'>{category.description}</p>
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