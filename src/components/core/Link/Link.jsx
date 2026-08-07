import { forwardRef } from 'react';
import NextLink from 'next/link';

import { createVariants } from '../../../utilities/variants';

const safeExternalProtocols = new Set([ 'http:', 'https:', 'mailto:', 'tel:' ]);

const normalizeHref = (href) => {
  if (typeof href !== 'string') return href;

  const normalizedHref = href.trim();

  if (!normalizedHref) return null;
  if (normalizedHref.startsWith('/') || normalizedHref.startsWith('#')) return normalizedHref;

  try {
    const parsed = normalizedHref.startsWith('//') ? new URL(normalizedHref, 'https:') : new URL(normalizedHref);

    return safeExternalProtocols.has(parsed.protocol) ? normalizedHref : null;
  } catch {
    return null;
  }
};

const isExternalHref = (href) => typeof href === 'string' && (/^https?:\/\//i.test(href) || href.startsWith('//'));

export const linkVariants = createVariants({
  'base': 'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950',
  'compoundVariants': [
    { 'className': 'text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200', 'tone': 'amber', 'variant': 'inline' },
    { 'className': 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300', 'tone': 'blue', 'variant': 'inline' },
    { 'className': 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100', 'tone': 'gray', 'variant': 'inline' },
    { 'className': 'text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300', 'tone': 'green', 'variant': 'inline' },
    { 'className': 'text-indigo-700 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300', 'tone': 'indigo', 'variant': 'inline' },
    { 'className': 'text-gray-950 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400', 'tone': 'neutral', 'variant': 'inline' },
    { 'className': 'text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300', 'tone': 'red', 'variant': 'inline' },
    { 'className': 'text-rose-700 hover:text-rose-900 dark:text-rose-300 dark:hover:text-rose-200', 'tone': 'rose', 'variant': 'inline' },
    { 'className': 'text-teal-700 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200', 'tone': 'teal', 'variant': 'inline' },
    { 'className': 'text-yellow-800 hover:text-yellow-950 dark:text-yellow-400 dark:hover:text-yellow-300', 'tone': 'yellow', 'variant': 'inline' },
    { 'className': 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200', 'tone': 'gray', 'variant': 'muted' },
    { 'className': 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200', 'tone': 'neutral', 'variant': 'muted' },
    { 'className': 'text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400', 'tone': 'blue', 'variant': 'nav' },
    { 'className': 'text-current', 'tone': 'blue', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'gray', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'green', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'indigo', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'neutral', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'red', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'amber', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'rose', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'teal', 'variant': 'bare' },
    { 'className': 'text-current', 'tone': 'yellow', 'variant': 'bare' }
  ],
  'defaultVariants': {
    'tone': 'neutral',
    'variant': 'inline'
  },
  'variants': {
    'tone': {
      'amber': '',
      'blue': '',
      'gray': '',
      'green': '',
      'indigo': '',
      'neutral': '',
      'red': '',
      'rose': '',
      'teal': '',
      'yellow': ''
    },
    'variant': {
      'bare': '',
      'inline': 'font-medium no-underline hover:no-underline',
      'muted': 'font-medium',
      'nav': 'font-semibold'
    }
  }
});

const CustomLink = forwardRef(function CustomLink({ children, className, href, prefetch = true, tone, variant, ...rest }, ref) {
  const safeHref = normalizeHref(href);
  const isAnchorLink = typeof safeHref === 'string' && safeHref.startsWith('#');
  const isInternalLink = typeof safeHref === 'string' && safeHref.startsWith('/');
  const classes = linkVariants({ className, tone, variant });

  if (!safeHref) return <span ref={ ref } className={ classes } { ...rest }>{children}</span>;

  if (typeof safeHref !== 'string') return <NextLink ref={ ref } href={ safeHref } prefetch={ prefetch } className={ classes } { ...rest }>{children}</NextLink>;

  if (isInternalLink) return <NextLink ref={ ref } href={ safeHref } prefetch={ prefetch } className={ classes } { ...rest }>{children}</NextLink>;

  if (isAnchorLink) return <a ref={ ref } href={ safeHref } className={ classes } { ...rest }>{children}</a>;

  return <a ref={ ref } className={ classes } target={ isExternalHref(safeHref) ? '_blank' : undefined } rel={ isExternalHref(safeHref) ? 'noopener noreferrer' : undefined } href={ safeHref } { ...rest }>{children}</a>;
});

export default CustomLink;
