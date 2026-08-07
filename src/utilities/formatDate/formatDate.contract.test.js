import assert from 'node:assert/strict';
import test from 'node:test';

import formatDate from './formatDate.js';

test('formatDate returns an empty string for missing or invalid input', () => {
  assert.equal(formatDate(), '');
  assert.equal(formatDate('not-a-date'), '');
});

test('formatDate falls back to the default locale when locale input is invalid', () => {
  assert.equal(formatDate(new Date(2024, 0, 15), 'not_a_locale'), 'January 15, 2024');
});
