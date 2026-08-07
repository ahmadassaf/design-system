# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Gaudi serves Ahmad Assaf and maintainers building Ahmad Assaf's blog and related editorial interfaces. Its consuming users are developers and coding agents composing React, Next.js, Tailwind, MDX, navigation, post chrome, and reusable interface patterns without copying implementation details into the blog app.

## Product Purpose

Gaudi exists to keep reusable editorial UI, shared styling, icons, tokens, MDX rendering components, post components, navigation, layout primitives, and blocks in one package. Success means the blog can import a coherent system from `@gaudi/design-system` while route data, content files, Contentlayer output, API routes, bibliography files, and one-off app wiring stay in the consuming app.

## Positioning

Gaudi is not a generic component kit. It is the blog's product-specific design system: editorial reading patterns, MDX article affordances, citation and preview UI, navigation, post metadata chrome, and shared tokens are packaged together so the consuming app stays content-focused and thin.

## Operating Context

The package is installed from `github:ahmadassaf/design-system` and imported as `@gaudi/design-system`. Consumers import `@gaudi/design-system/global.css`, use the Tailwind preset and plugins, and pass site metadata and navigation through `SiteConfigProvider` or `LayoutContainer`. Storybook documents components and runs interaction plus axe accessibility tests.

## Capabilities and Constraints

Reusable UI belongs here: core components, layout, blocks, navigation, post chrome, MDX UI, tokens, icons, and shared utilities. App-owned data and content do not belong here. Package-internal imports are relative. MDX components stay in the `./mdx` entrypoint, and the compiled-MDX runtime stays in `./mdx/runtime` so heavy article dependencies do not enter the root import path.

## Brand Commitments

The system name is Gaudi. The package name is `@gaudi/design-system`. The source repository is `ahmadassaf/design-system`. The voice is precise, editorial, and implementation-aware; it should not fabricate external proof, customers, benchmarks, or content that belongs to the consuming app.

## Evidence on Hand

Repository evidence: `README.md`, `AGENTS.md`, `package.json`, `src/tokens/tokens.json`, `src/styles.css`, Storybook stories, and the component source under `src/components/`. The repository does not contain the blog's route data, content library, bibliography source files, or generated Contentlayer output; future work must not invent those inside this package.

## Product Principles

- Keep the package reusable and app-data-free.
- Prefer Gaudi tokens, variants, icons, and components over duplicated blog UI.
- Keep heavy MDX/article dependencies out of the root export path.
- Make public components documented, accessible, and practical in Storybook.
- Preserve editorial reading quality across light mode, dark mode, responsive layouts, and keyboard interaction.

## Accessibility & Inclusion

Gaudi targets accessible web UI. Storybook's axe suite runs WCAG 2.0/2.1 A and AA checks, and components should preserve keyboard operation, visible focus, semantic roles, useful alt text, and reduced-motion behavior.
