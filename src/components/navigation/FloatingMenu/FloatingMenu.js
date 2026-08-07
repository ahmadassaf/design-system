'use client';

/**
 * FloatingMenu Component
 *
 * @description Floating/sticky navigation component that appears and disappears based on scroll behavior.
 * This component provides quick access to main navigation links and a "scroll to top" button.
 * Features smooth animations, responsive design, and intelligent scroll-based visibility logic.
 * The menu appears when scrolling up and hides when scrolling down, with a minimum scroll threshold.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useRef, useState } from 'react';

import Button from '../../core/Button';
import Icon from '../../core/Icon';
import Link from '../../core/Link';
import { cn } from '../../../utilities/cn';
import { useSiteConfig } from '../../../utilities/SiteConfig';

/**
 * Renders a floating navigation menu with scroll-based visibility
 *
 * @description Simple floating menu that tracks scroll position and direction to show/hide intelligently.
 * Displays main navigation links and a scroll-to-top button. Adapts its styling for both light and dark themes.
 * Mobile responsive with adjusted sizing and spacing.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes to apply to the menu container
 *
 * @returns {JSX.Element} Floating navigation menu with scroll-based visibility
 *
 * @example
 * // Basic usage
 * <FloatingMenu />
 *
 * @example
 * // With custom styling
 * <FloatingMenu className="custom-floating-menu" />
 *
 * @example
 * // The menu automatically shows/hides based on scroll:
 * // - Hidden when at top of page
 * // - Shows when scrolling up
 * // - Hides when scrolling down
 */
const FloatingMenu = ({ className, links }) => {
  const { navigation } = useSiteConfig();
  const navLinks = links ?? navigation.links;
  const [ visible, setVisible ] = useState(false);
  const [ mounted, setMounted ] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY < 50)
        setVisible(false);
      else if (currentScrollY < lastScrollY)
        setVisible(true);
      else if (currentScrollY > lastScrollY)
        setVisible(false);

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { 'passive': true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ mounted ]);

  /**
   * Scrolls the page to the top smoothly
   *
   * @description Handler function that smoothly scrolls the page to the top when the
   * "Back Top" button is clicked. Uses the native window.scrollTo method.
   *
   * @returns {void}
   */
  const handleScrollTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ 'behavior': reduceMotion ? 'auto' : 'smooth', 'top': 0 });
  };

  return (
    <div
      aria-hidden={ !mounted || !visible }
      inert={ !mounted || !visible }
      className={ cn(
        'fixed left-1/2 top-4 z-[var(--ds-z-nav)] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-center gap-3 overflow-x-auto rounded-full border border-transparent bg-black py-2 pl-4 pr-2 text-white shadow-[var(--ds-shadow-floating)] transition-all duration-200 motion-reduce:transition-none dark:border-white/[0.2] dark:bg-white dark:text-black sm:pl-8', mounted && visible ? 'opacity-100 translate-y-0' : 'pointer-events-none -translate-y-full opacity-0', className
      ) }
    >
      {navLinks.map((navItem, idx) => (
        <Link key={ `link=${idx}` } href={ navItem.href } tabIndex={ mounted && visible ? undefined : -1 } className={ cn('relative flex shrink-0 items-center space-x-1 text-white hover:text-blue-600 dark:text-black dark:hover:text-blue-600') }>
          <span className='block text-sm'>{navItem.title}</span>
        </Link>
      ))}
      <Button variant='outline' tone='neutral' size='sm' tabIndex={ mounted && visible ? undefined : -1 } onClick={ () => handleScrollTop() } className='relative min-h-11 shrink-0 rounded-full border-neutral-200 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 hover:text-white dark:border-black/[0.2] dark:text-black max-sm:border-none max-sm:px-2' aria-label='Back to top'>
        <Icon name='ArrowUpCircle' size='md' decorative className='inline mx-2 align-middle max-sm:m-0!'/>
        <span className='max-sm:hidden'>Back Top</span>
        <span className='absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-blue-500 to-transparent h-px' />
      </Button>
    </div>
  );
};

export default FloatingMenu;
