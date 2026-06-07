import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

export const runComponentFolderContract = (importMetaUrl, name) => {
  const componentDir = dirname(fileURLToPath(importMetaUrl));

  test(`${name} exposes source, barrel export, story, and interaction coverage`, () => {
    const files = readdirSync(componentDir);
    const sourceFile = [ `${name}.jsx`, `${name}.js` ].find((file) => existsSync(join(componentDir, file)));
    const storyFile = files.find((file) => file.endsWith('.stories.jsx') || file.endsWith('.stories.js') || file.endsWith('.stories.mdx'));

    assert.ok(sourceFile, `${name} must have a same-named component source file`);
    assert.ok(existsSync(join(componentDir, 'index.js')), `${name} must expose an index.js barrel`);
    assert.ok(storyFile, `${name} must have a Storybook story`);

    const source = readFileSync(join(componentDir, sourceFile), 'utf8');
    const index = readFileSync(join(componentDir, 'index.js'), 'utf8');
    const story = readFileSync(join(componentDir, storyFile), 'utf8');

    assert.match(source, /(export default|export const|export \{ default)/, `${name} source must expose a public component export`);
    assert.match(index, new RegExp(`['"]\\./${name}['"]`), `${name} barrel must export from ./${name}`);
    assert.match(story, /from 'storybook\/test'|from "storybook\/test"/, `${name} story must use Storybook test helpers`);
    assert.match(story, /['"]?play['"]?\s*:\s*async/, `${name} story must include an interaction play test`);
  });
};
