import React from 'react';
import 'storybook/internal/components';

import './preview.css';

import { SiteConfigProvider } from '../src/utilities/SiteConfig';
import ThemeProvider from '../src/utilities/ThemeProvider';
import tokenData from '../src/tokens/tokens.json';
import siteMetadata from './fixtures/site/metadata';
import navigationMetadata from './fixtures/site/navigationMetadata.mjs';

/*
 * Workaround for a Storybook bug (storybook/test's enhanceContext loader):
 * it replaces HTMLElement.prototype.focus with an accessor whose getter calls
 * `this.ownerDocument`. Reading `HTMLElement.prototype.focus` off the
 * prototype itself (react-aria's focus-visible polyfill, bundled into the
 * preview via storybook/internal/components, does exactly that) then throws
 * "TypeError: Illegal invocation" and the story fails to render.
 *
 * The loader below runs after Storybook's (project annotations compose
 * addons first, this file last) and re-wraps the accessor with a getter that
 * returns the captured native focus for prototype receivers while delegating
 * element reads to Storybook's instrumentation unchanged.
 */
const nativeFocus = typeof HTMLElement !== 'undefined' ? HTMLElement.prototype.focus : undefined;

function makeFocusAccessorPrototypeSafe() {
  if (typeof HTMLElement === 'undefined') return;

  const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'focus');

  if (!descriptor?.get || descriptor.get.__prototypeSafe) return;

  const { get, set } = descriptor;
  const safeGet = function () {
    if (this === HTMLElement.prototype) return nativeFocus;

    return get.call(this);
  };

  safeGet.__prototypeSafe = true;
  Object.defineProperty(HTMLElement.prototype, 'focus', { configurable: true, get: safeGet, set });
}

const STORYBOOK_THEME_CLASSES = [ 'dark' ];
const STORYBOOK_BACKGROUNDS = {
  'dark': tokenData.dsVariables.root['--ds-color-surface-dark'],
  'light': tokenData.dsVariables.root['--ds-color-surface']
};

function applyStorybookTheme(theme) {
  const isDark = theme === 'dark';
  const roots = [
    document.documentElement,
    document.body,
    document.getElementById('storybook-root'),
    document.getElementById('storybook-docs')
  ].filter(Boolean);

  roots.forEach((root) => {
    STORYBOOK_THEME_CLASSES.forEach((themeClass) => root.classList.remove(themeClass));
    if (isDark) root.classList.add('dark');
  });

  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  document.body.style.backgroundColor = isDark ? STORYBOOK_BACKGROUNDS.dark : STORYBOOK_BACKGROUNDS.light;
}

function syncStorybookTheme(theme) {
  applyStorybookTheme(theme);
  window.requestAnimationFrame(() => applyStorybookTheme(theme));
  window.setTimeout(() => applyStorybookTheme(theme), 0);
}

const preview = {
  decorators: [
    (Story, context) => {
      syncStorybookTheme(context.globals.theme);
      return React.createElement(
        ThemeProvider,
        { attribute: 'class', defaultTheme: context.globals.theme, enableSystem: false },
        React.createElement(
          SiteConfigProvider,
          { metadata: siteMetadata, navigation: navigationMetadata },
          Story()
        )
      );
    }
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Switch the preview between light and dark themes.',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    theme: 'light'
  },
  loaders: [ makeFocusAccessorPrototypeSafe ],
  parameters: {
    a11y: {
      options: {
        runOnly: {
          type: 'tag',
          values: [ 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa' ]
        }
      },
      test: 'error'
    },
    actions: {
      argTypesRegex: '^on.*'
    },
    backgrounds: {
      default: 'light',
      options: {
        dark: { name: 'Dark', value: STORYBOOK_BACKGROUNDS.dark },
        light: { name: 'Light', value: STORYBOOK_BACKGROUNDS.light }
      }
    },
    controls: {
      matchers: {
        color: /(?:background|color)$/i,
        date: /Date$/i
      }
    },
    nextjs: {
      appDirectory: true
    },
    options: {
      storySort: {
        includeNames: true,
        method: 'alphabetical',
        order: [
          'Overview', [
            'Getting Started',
            'Accessibility',
            'Colors & Tokens',
            'Icons',
            'Indicators',
            'States & Recovery',
            'Typography',
            '*'
          ],
          'Core', [ 'Overview', '*' ],
          'Blocks', [ 'Overview', '*' ],
          'Navigation', [ 'Overview', '*' ],
          'MDX', [ 'Overview', '*' ],
          'Post', [ 'Overview', '*' ],
          'Layout', [ 'Overview', '*' ],
          '*'
        ]
      }
    }
  }
};

export default preview;
