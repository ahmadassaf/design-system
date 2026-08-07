import assert from 'node:assert/strict';
import test from 'node:test';

import sanitizeHtml from './sanitizeHtml.js';

test('sanitizeHtml removes script-capable markup and inline event handlers', () => {
  assert.equal(
    sanitizeHtml('<strong onclick="alert(1)">Safe</strong><script>alert(1)</script>'),
    '<strong>Safe</strong>'
  );
});

test('sanitizeHtml removes unsafe URL attributes but keeps safe links', () => {
  assert.equal(
    sanitizeHtml('<a href="javascript:alert(1)">Bad</a><a href="https://example.com">Good</a>'),
    '<a>Bad</a><a href="https://example.com">Good</a>'
  );
});

test('sanitizeHtml can preserve style tags for trusted generated SVG output', () => {
  assert.equal(
    sanitizeHtml('<style>.node{fill:red}</style><svg onload="alert(1)"></svg>', { 'allowStyleTags': true }),
    '<style>.node{fill:red}</style><svg></svg>'
  );
});
