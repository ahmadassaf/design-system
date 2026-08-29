/**
 * Taxonomy Utilities
 *
 * @description Shared category/tag helpers: slug-based hrefs and display-title
 * formatting. Post rows, post headers, and the navigation menus all render the
 * same taxonomy links, so the slug and title transforms live in one place.
 */

const taxonomySlug = (value = '') => String(value).replaceAll(' ', '-').toLowerCase();

/**
 * Route for a category's listing page
 *
 * @param {string} category - Category name or slug
 * @returns {string} Site-relative category href
 */
export const categoryHref = (category) => `/blog/categories/${taxonomySlug(category)}`;

/**
 * Route for a tag's listing page
 *
 * @param {string} tag - Tag name or slug
 * @returns {string} Site-relative tag href
 */
export const tagHref = (tag) => `/blog/tags/${taxonomySlug(tag)}`;

/**
 * Human-readable title for a category slug: every hyphen-separated word is
 * capitalized, with known acronyms (AI) uppercased
 *
 * @param {string} title - Category title or slug
 * @returns {string} Display title
 */
export const formatCategoryTitle = (title = '') => String(title)
  .split('-')
  .map((word) => (word.toLowerCase() === 'ai' ? 'AI' : `${word.charAt(0).toUpperCase()}${word.slice(1)}`))
  .join(' ');
