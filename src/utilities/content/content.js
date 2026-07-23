/**
 * Content Utilities
 *
 * @description Generic helpers for working with content collections (e.g. Contentlayer
 * documents) inside design system components. Owned by the package so components do
 * not import utilities from the consuming app.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

/**
 * Sorts content by date in descending order (newest first) without mutating the input
 *
 * @param {Array<Object>} posts - Items with `date` and optional `updated` fields
 * @returns {Array<Object>} A new sorted array
 */
export function sortPosts(posts = []) {
  return [ ...posts ].sort((a, b) => {
    const dateA = a.updated || a.date;
    const dateB = b.updated || b.date;

    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;

    return 0;
  });
}

/**
 * Creates a new object with only the specified keys
 *
 * @param {Object} obj - Source object
 * @param {Array<string>} keys - Keys to pick
 * @returns {Object} New object with only the picked keys
 */
export const pick = (obj, keys) => keys.reduce((acc, key) => {
  acc[key] = obj[key] ?? null;

  return acc;
}, {});

/**
 * Creates a new object excluding the specified keys
 *
 * @param {Object} obj - Source object
 * @param {Array<string>} keys - Keys to omit
 * @returns {Object} New object without the omitted keys
 */
export const omit = (obj, keys) => {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
};

/**
 * Extracts core content fields, removing heavy generated fields
 *
 * @param {Object|Array<Object>} content - Content object(s)
 * @returns {Object|Array<Object>} Content stripped of body/_raw/_id/toc/structuredData
 */
export function coreContent(content) {
  const _core = (item) => omit(item, [ 'body', '_raw', '_id', 'toc', 'structuredData' ]);

  return Array.isArray(content) ? content.map((item) => _core(item)) : _core(content);
}
