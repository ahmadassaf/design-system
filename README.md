# Gaudi Design System

Gaudi is the design system package for Ahmad Assaf's blog and related editorial interfaces. It contains the shared React components, MDX rendering components, design tokens, Tailwind preset, and Storybook documentation used by the site.

## Install

```sh
pnpm add github:ahmadassaf/design-system
```

## Usage

```js
import { Button, PostHeader } from '@gaudi/design-system';
import '@gaudi/design-system/global.css';
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

Storybook uses local fixtures under `app/`, `data/`, `lib/`, `.contentlayer/`, and `public/` to document site-aware components such as navigation and footer without depending on the blog repository.
