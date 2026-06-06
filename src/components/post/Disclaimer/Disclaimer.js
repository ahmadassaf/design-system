/**
 * Disclaimer Component
 *
 * @description Legal disclaimer component that displays a default disclaimer notice
 * about the content and opinions expressed on the blog. Consumers can pass custom copy
 * while keeping the same Callout presentation.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Callout from '@/components/mdx/Callout';

/**
 * Renders a legal disclaimer notice
 *
 * @description Standard disclaimer component that clarifies that blog content represents
 * personal opinions and views, not those of employer or affiliated organizations.
 * Displayed as an informational callout for clear visibility.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Custom disclaimer copy. Defaults to the blog disclaimer.
 * @param {string} [props.type='info'] - Callout tone passed through to the underlying Callout.
 * @param {...Object} props.rest - Additional props passed to Callout
 * @returns {JSX.Element} Disclaimer notice in callout format
 *
 * @example
 * // Basic usage at the bottom of blog posts
 * <Disclaimer />
 *
 * @example
 * // Custom disclaimer copy
 * <Disclaimer>
 *   Research notes are provided for context and should not be treated as advice.
 * </Disclaimer>
 *
 * @example
 * // Typically used in post layouts
 * <article>
 *   {// Post content}
 *   <Disclaimer />
 * </article>
 */
const defaultDisclaimer = 'The opinions and views expressed on this blog are solely my own and do not reflect the opinions, views, or positions of my employer or any affiliated organizations. All content provided on this blog is for informational purposes only.';

const Disclaimer = ({ children = defaultDisclaimer, type = 'info', ...props }) => (
  <Callout type={ type } { ...props }>
    {children}
  </Callout>
);

export default Disclaimer;
