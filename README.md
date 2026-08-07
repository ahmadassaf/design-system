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

For route-level app code that imports one or two components, prefer leaf entrypoints
so bundlers do not traverse the full convenience barrel:

```js
import Button from '@gaudi/design-system/core/Button';
import PostHeader from '@gaudi/design-system/post/PostHeader';
```

MDX article components are exported from the MDX entrypoint (they are intentionally
not re-exported from the root entry, so their heavy peer dependencies — recharts,
framer-motion, mermaid, katex — stay out of apps that don't render articles):

```js
import { Callout, CitationPopover, CodeGroupTabs, Preview, Table } from '@gaudi/design-system/mdx';
```

The compiled-MDX runtime (`MDXLayoutRenderer`, `useMDXComponent`) has its own entry:

```js
import { MDXLayoutRenderer } from '@gaudi/design-system/mdx/runtime';
```

### Site configuration

Gaudi never imports data from the consuming app. Site-aware components (navigation,
footer, command launcher, theme switcher) read metadata and navigation links from the
`SiteConfigProvider` context; `LayoutContainer` wires it up for you:

```jsx
import LayoutContainer from '@gaudi/design-system/layout/LayoutContainer';

<LayoutContainer
  metadata={ siteMetadata }        // { author, title, locale, theme, github, linkedin, twitter, email, … }
  navigation={ navigationMetadata } // { links: [...], categoriesMetadata: {...} }
  jsonLd={ websiteJsonLd }          // object or () => object, rendered as application/ld+json
  menuProps={{ posts, projects, thoughts, categories, publications, tags }}
  footerProps={ footerProps }
>
  {children}
</LayoutContainer>
```

Standalone usage without `LayoutContainer` wraps the tree directly:

```jsx
import { SiteConfigProvider } from '@gaudi/design-system';

<SiteConfigProvider metadata={ siteMetadata } navigation={ navigationMetadata }>
  <App />
</SiteConfigProvider>
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
pnpm lint
pnpm test:contracts
pnpm test-storybook
pnpm build-storybook
```

CI (`.github/workflows/ci.yml`) runs lint, contract tests, the Storybook interaction +
axe accessibility suite (in Playwright browser mode), and the Storybook build on every
pull request and push to `main`.

Storybook uses local fixtures under `.storybook/fixtures/site/` and static assets under `.storybook/public/` to document site-aware components such as navigation and footer without depending on the blog repository. Those fixtures are not part of the design-system runtime API.

When a local Storybook server is already running, prefer lightweight verification:

```sh
git diff --check
pnpm test:contracts
```
