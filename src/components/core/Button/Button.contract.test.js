import assert from 'node:assert/strict';
import test from 'node:test';

import { buttonToneAliases, buttonToneClasses, buttonTones, canonicalButtonToneClasses } from './Button.tones.js';

test('Button recommends only semantic tones', () => {
  assert.deepEqual(buttonTones, [ 'accent', 'attention', 'danger', 'discovery', 'info', 'neutral', 'success', 'warning' ]);
});

test('Button legacy hue names remain exact aliases of semantic tones', () => {
  for (const [ alias, tone ] of Object.entries(buttonToneAliases)) {
    assert.equal(buttonToneClasses[alias], canonicalButtonToneClasses[tone]);
  }
});
