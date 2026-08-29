'use client';

/**
 * MenuBlog Component
 *
 * @description Blog-specific navigation dropdown component that displays a categorized menu of blog categories.
 * Features a dropdown interface that shows all available blog categories with descriptions and hover effects.
 * This component is used specifically for blog navigation and category browsing.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

import MenuDropdownPanel from '../MenuDropdownPanel';

/**
 * Renders a dropdown menu for blog categories navigation
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
 * <MenuBlog categories={blogCategories} />
 */
const MenuBlog = ({ categories }) => <MenuDropdownPanel name='Categories' categories={ categories } />;

export default MenuBlog;
