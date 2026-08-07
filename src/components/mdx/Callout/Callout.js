/**
 * Callout Component
 *
 * @description Simple callout boxes for highlighting different types of content.
 * Supports three types: info (blue), warning (yellow), and error (red).
 * Clean design without icons. Used within MDX content to draw attention to important information.
 *
 * @author Ahmad Assaf
 * @version 2.0.0
 */

/**
 * Renders a styled callout box with type-specific styling
 *
 * @param {Object} props - Component props
 * @param {('info'|'warning'|'error')} props.type - The callout type that determines styling (default: 'info')
 * @param {React.ReactNode} props.children - The content to display within the callout
 * @returns {JSX.Element} A div containing the styled callout
 *
 * @example
 * // In MDX content - Info callout:
 * <Callout type="info">
 *   This is important information for readers to note.
 * </Callout>
 *
 * @example
 * // In MDX content - Warning callout:
 * <Callout type="warning">
 *   Be careful when following these steps!
 * </Callout>
 *
 * @example
 * // In MDX content - Error callout:
 * <Callout type="error">
 *   This action cannot be undone!
 * </Callout>
 */
import { cn } from '../../../utilities/cn';

const calloutStyles = {
  'error': {
    'background': 'bg-danger-subtle',
    'border': 'border-danger-border',
    'text': 'text-danger'
  },
  'info': {
    'background': 'bg-info-subtle',
    'border': 'border-info-border',
    'text': 'text-info'
  },
  'warning': {
    'background': 'bg-warning-subtle',
    'border': 'border-warning-border',
    'text': 'text-warning'
  }
};

const Callout = ({ children, className, classNames = {}, type = 'info' }) => {
  const resolvedStyles = calloutStyles[type] || calloutStyles.info;

  return (
    <aside className={ cn('mb-6 rounded-md border px-6 py-4 text-base', resolvedStyles.background, resolvedStyles.border, className, classNames.root) }>
      <div className={ cn(resolvedStyles.text, '[&>p]:m-0 [&>p:not(:last-child)]:mb-2', classNames.body) }>
        {children}
      </div>
    </aside>
  );
};

export default Callout;
