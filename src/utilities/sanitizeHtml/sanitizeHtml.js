const eventHandlerPattern = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const unsafeUrlAttributePattern = /\s+(?:href|src|xlink:href)\s*=\s*(?:"\s*(?:javascript:|data:text\/html)[^"]*"|'\s*(?:javascript:|data:text\/html)[^']*'|(?:javascript:|data:text\/html)[^\s>]*)/gi;

const buildDangerousElementPattern = (allowStyleTags) => {
  const names = allowStyleTags ? 'script|iframe|object|embed|link|meta' : 'script|style|iframe|object|embed|link|meta';

  return new RegExp(`<\\s*(${names})\\b[^>]*>[\\s\\S]*?<\\s*\\/\\s*\\1\\s*>`, 'gi');
};

const buildDangerousStandalonePattern = (allowStyleTags) => {
  const names = allowStyleTags ? 'script|iframe|object|embed|link|meta' : 'script|style|iframe|object|embed|link|meta';

  return new RegExp(`<\\s*(?:${names})\\b[^>]*\\/?>`, 'gi');
};

const sanitizeHtml = (html, options = {}) => {
  if (html === null || typeof html === 'undefined') return '';

  const allowStyleTags = Boolean(options.allowStyleTags);

  return String(html)
    .replace(buildDangerousElementPattern(allowStyleTags), '')
    .replace(buildDangerousStandalonePattern(allowStyleTags), '')
    .replace(eventHandlerPattern, '')
    .replace(unsafeUrlAttributePattern, '');
};

export default sanitizeHtml;
