/**
 * Aside Component
 *
 * @description A styled aside component for supplementary content.
 * Handles both inline and block content gracefully, ensuring consistent
 * rendering regardless of how MDX processes the children.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */


/**
 * Renders a styled aside element with consistent formatting
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to display within the aside
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} A styled aside element
 *
 * @example
 * // In MDX content - inline:
 * <Aside>This is supplementary information about the topic.</Aside>
 *
 * @example
 * // In MDX content - block:
 * <Aside>
 * This is supplementary information.
 *
 * It can have multiple paragraphs.
 * </Aside>
 */
import { cn } from '../../../utilities/cn';

const Aside = ({ children, className = '' }) => (
  <aside
    className={ cn(
      'my-4 rounded-md border border-border bg-surface-muted px-4 py-3 text-sm leading-6 text-text-muted dark:border-border-dark dark:bg-surface-muted dark:text-text',
      '2xl:absolute 2xl:left-[-20%] 2xl:w-[250px] 2xl:border-0 2xl:bg-transparent 2xl:py-2 2xl:dark:bg-transparent',
      className
    ) }
  >
    {children}
  </aside>
);

export default Aside;
