/**
 * Layout Container Component
 *
 * @description The main layout wrapper component that provides the overall structure and visual design for all pages.
 * It includes the Aurora background animation, theme provider, navigation components, analytics, and structured data.
 * This component serves as the root layout for the entire application.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { Analytics } from '@vercel/analytics/react';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';

import Aurora from '../Aurora';
import Footer from '../Footer';
import FloatingMenu from '../../navigation/FloatingMenu';
import Menu from '../../navigation/Menu';
import { SiteConfigProvider } from '../../../utilities/SiteConfig';

const ThemeProvider = dynamic(() => import('../../../utilities/ThemeProvider'));

/**
 * Main layout container component that wraps all page content
 *
 * @description Provides the foundational layout structure including theme management, background animations,
 * navigation components, analytics integration, and structured data. The component handles both light and dark
 * mode themes with appropriate background animations and overlays.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The page content to be rendered within the layout
 * @param {Object} [props.footerProps] - Footer navigation, social, and copyright data
 * @param {Object|Function} [props.jsonLd] - JSON-LD structured data (object, or function returning one)
 * @param {Object} [props.menuProps] - Navigation and command launcher content data
 * @param {Object} [props.metadata] - Site metadata (author, title, locale, theme, …)
 * @param {Object} [props.navigation] - Navigation data (links, categoriesMetadata)
 *
 * @returns {Promise<JSX.Element>} The rendered layout container component
 *
 * @example
 * <LayoutContainer>
 *   <HomePage />
 * </LayoutContainer>
 */
export default async function LayoutContainer({ children, footerProps, jsonLd, menuProps, metadata = {}, navigation }) {
  const themeCookie = await cookies();
  const theme = themeCookie.get('__theme__')?.value || metadata.theme || 'system';
  const jsonLdData = typeof jsonLd === 'function' ? jsonLd() : jsonLd;

  return (
    <div className='bg-white text-black antialiased dark:bg-neutral-950 dark:text-white'>

      {/* Aurora wraps all content and provides the shared light/dark background treatment. */}
      <Aurora>

        <ThemeProvider attribute='class' defaultTheme={ theme } enableSystem/>
        <Analytics />

        <SiteConfigProvider metadata={ metadata } navigation={ navigation }>
          <div className='relative w-full sm:w-[95%] xl:w-[90%] isolate xl:max-w-6xl px-4 sm:px-8 dark:z-10'>
            <div className='flex min-h-screen flex-col justify-between'>
              <FloatingMenu/>
              <Menu { ...menuProps } />
              {jsonLdData ? <script type='application/ld+json' dangerouslySetInnerHTML={{ '__html': JSON.stringify(jsonLdData) }} key='jsonld'/> : null}
              <main className='mb-4'>{children}</main>
              <Footer { ...footerProps } />
            </div>
          </div>
        </SiteConfigProvider>

      </Aurora>

    </div>
  );
}
