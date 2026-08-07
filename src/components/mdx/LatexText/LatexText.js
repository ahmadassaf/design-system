/**
 * LaTeX Text Component
 *
 * @description A component that renders inline LaTeX text using KaTeX.
 * Handles mathematical expressions, special characters, and BibTeX formatting.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import katex from 'katex';
import 'katex/dist/katex.min.css';

import sanitizeHtml from '../../../utilities/sanitizeHtml';

const accentMarks = {
  '"': '\u0308',
  '\'': '\u0301',
  '.': '\u0307',
  '=': '\u0304',
  '^': '\u0302',
  '`': '\u0300',
  '~': '\u0303'
};

const applyAccent = (accent, character) => `${character}${accentMarks[accent] || ''}`.normalize('NFC');

const decodeLatexText = (value) => {
  return value
    .replace(/---/g, '\u2014')
    .replace(/--/g, '\u2013')
    .replace(/\{\\(["'`.=^~])\\?([A-Za-z])\}/g, (_match, accent, character) => applyAccent(accent, character))
    .replace(/\\(["'`.=^~])\{\\?([A-Za-z])\}/g, (_match, accent, character) => applyAccent(accent, character))
    .replace(/\\(["'`.=^~])\\?([A-Za-z])/g, (_match, accent, character) => applyAccent(accent, character))
    .replace(/\\([&%_$#{}])/g, '$1')
    .replace(/\{([^{}]+)\}/g, '$1');
};

const renderInlineMath = (children) => {
  const parts = [];
  const mathPattern = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = mathPattern.exec(children)) !== null) {
    if (match.index > lastIndex) parts.push(decodeLatexText(children.slice(lastIndex, match.index)));

    const expression = match[1];

    try {
      parts.push(
        <span
          key={ `math-${match.index}` }
          dangerouslySetInnerHTML={{
            '__html': katex.renderToString(expression, {
              'strict': 'ignore',
              'throwOnError': false,
              'trust': false
            })
          }}
        />
      );
    } catch {
      parts.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < children.length) parts.push(decodeLatexText(children.slice(lastIndex)));

  return parts.length ? parts : [ decodeLatexText(children) ];
};

/**
 * Renders LaTeX text with proper mathematical and special character formatting
 *
 * @param {Object} props - Component props
 * @param {string} props.children - LaTeX text content to render
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Inline styles
 *
 * @returns {JSX.Element} Rendered LaTeX content
 *
 * @example
 * // Basic usage with mathematical notation
 * <LatexText>11$^{th}$ International Conference</LatexText>
 *
 * @example
 * // Usage with special characters
 * <LatexText>Eero Hyv\"{o}nen and Michael F\"{a}rber</LatexText>
 */
const LatexText = ({ children, className, style, ...props }) => {

  // Return plain text if no content
  if (!children || typeof children !== 'string')
    return <span className={ className } style={ style } { ...props }>{children}</span>;

  /*
   * Check if the text contains HTML tags or LaTeX patterns
   * More comprehensive regex to catch patterns like Andr{\'e}s, Garc\'{\i}a-Silva, etc.
   */
  const hasHTML = /<[^>]+>/g.test(children);
  const hasLatex = /(?:\$[^$]*\$|\\[a-zA-Z]+\{[^}]*\}|\{\\[^}]*\}|---?|\\\w+|\{\\['`"^~=.]\w+\})/g.test(children);

  // If it contains HTML tags, render them directly
  if (hasHTML)
    return (
      <span
        className={ className }
        style={ style }
        { ...props }
        dangerouslySetInnerHTML={{ '__html': sanitizeHtml(children) }}
      />
    );

  // If no LaTeX, return as plain text
  if (!hasLatex)
    return <span className={ className } style={ style } { ...props }>{children}</span>;

  return <span className={ className } style={ style } { ...props }>{renderInlineMath(children)}</span>;
};

export default LatexText;
