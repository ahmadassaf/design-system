'use client';

/**
 * SiteConfig Context
 *
 * @description Provides consumer-owned site data (metadata, navigation) to design
 * system components without the package importing files from the consuming app.
 * Components read this via useSiteConfig() and fall back to safe defaults, so they
 * render (empty but intact) when no provider is present, e.g. in isolated stories.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { createContext, useContext, useMemo } from 'react';

export const defaultSiteConfig = {
  'metadata': {
    'author': { 'name': '' },
    'description': '',
    'email': '',
    'locale': 'en-US',
    'theme': 'system',
    'title': ''
  },
  'navigation': {
    'categoriesMetadata': {},
    'links': []
  }
};

const SiteConfigContext = createContext(defaultSiteConfig);

/**
 * Provides site metadata and navigation data to all descendant components
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Descendant tree that reads the config
 * @param {Object} [props.metadata] - Site metadata (author, title, locale, theme, …)
 * @param {Object} [props.navigation] - Navigation data (links, categoriesMetadata)
 *
 * @returns {JSX.Element} Context provider wrapping children
 *
 * @example
 * <SiteConfigProvider metadata={ siteMetadata } navigation={ navigationMetadata }>
 *   <App />
 * </SiteConfigProvider>
 */
export function SiteConfigProvider({ children, metadata, navigation }) {
  const value = useMemo(() => ({
    'metadata': { ...defaultSiteConfig.metadata, ...metadata },
    'navigation': { ...defaultSiteConfig.navigation, ...navigation }
  }), [ metadata, navigation ]);

  return <SiteConfigContext.Provider value={ value }>{children}</SiteConfigContext.Provider>;
}

/**
 * Reads the current site configuration
 *
 * @returns {{ metadata: Object, navigation: Object }} The active site config, or defaults
 */
export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
