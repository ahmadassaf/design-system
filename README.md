# Gaudi Design System

Gaudi is the design system for Ahmad Assaf's blog and related editorial interfaces. It contains the shared React components, MDX rendering components, design tokens, Tailwind preset, and Storybook documentation used by the site.

The system is called **Gaudi**. The source repository is hosted at [`ahmadassaf/design-system`](https://github.com/ahmadassaf/design-system), and the package import name is `@gaudi/design-system`.

## For Agents

Coding agents should read [`AGENTS.md`](./AGENTS.md) before changing the package or consuming it from the blog. The short version:

- reusable UI, MDX components, post chrome, navigation, blocks, tokens, icons, and shared styling live in Gaudi;
- route data, content files, bibliography files, Contentlayer output, API routes, and one-off app wiring stay in the consuming app;
- the blog should import Gaudi instead of copying components or hand-rolling colors, typography, icons, or shared UI patterns.

## Install

```sh
pnpm add github:ahmadassaf/design-system
```

The repository name and package name are intentionally different: install from GitHub, then import from `@gaudi/design-system`.

## Usage

```js
import { Button, PostHeader } from '@gaudi/design-system';
import '@gaudi/design-system/global.css';
```

MDX article components are exported from the MDX entrypoint:

```js
import { Callout, CitationPopover, CodeGroupTabs, Preview, Table } from '@gaudi/design-system/mdx';
```

Use the Tailwind preset and plugins from the package:

```js
const designSystemPreset = require('@gaudi/design-system/tailwind-preset');
const addVariablesColors = require('@gaudi/design-system/tailwind/addVariablesColors');
const tailwindGrid = require('@gaudi/design-system/tailwind/tailwindGrid');

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './node_modules/@gaudi/design-system/src/**/*.{js,jsx,mdx}'
  ],
  plugins: [ addVariablesColors, tailwindGrid ],
  presets: [ designSystemPreset ]
};
```

## Development

```sh
pnpm install
pnpm storybook
pnpm test:contracts
pnpm build-storybook
```

Storybook uses local fixtures under `.storybook/fixtures/site/` and static assets under `.storybook/public/` to document site-aware components such as navigation and footer without depending on the blog repository. Those fixtures are not part of the design-system runtime API.

When a local Storybook server is already running, prefer lightweight verification:

```sh
git diff --check
pnpm test:contracts
```
