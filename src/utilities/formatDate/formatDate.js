/**
 * Date Formatting Utility
 *
 * @description Formats a date with full month name, day, and year for the given locale.
 * Owned by the design system so components do not depend on consumer-side utilities.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

/**
 * Formats a date according to the given locale
 *
 * @param {string|Date} date - The date to format
 * @param {string} [locale='en-US'] - BCP 47 locale tag
 * @returns {string} The formatted date string, or an empty string for invalid input
 *
 * @example
 * formatDate('2023-12-25') // "December 25, 2023"
 * formatDate('2023-12-25', 'de-DE') // "25. Dezember 2023"
 */
const formatDate = (date, locale = 'en-US') => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '';

  return parsed.toLocaleDateString(locale, {
    'day': 'numeric',
    'month': 'long',
    'year': 'numeric'
  });
};

export default formatDate;
