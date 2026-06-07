/* eslint-disable quote-props */
import './preview.css';

const STORYBOOK_THEME_CLASSES = [ 'dark' ];

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
  document.body.style.backgroundColor = isDark ? '#171717' : '#ffffff';
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
      return Story();
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
        dark: { name: 'Dark', value: '#171717' },
        light: { name: 'Light', value: '#ffffff' }
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
        method: 'alphabetical',
        order: [
          'Overview',
          [
            'Getting Started',
            'Accessibility',
            'Colors & Tokens',
            'Typography',
            'Icons',
            'Indicators'
          ],
          'Core',
          [ 'Overview', '*' ],
          'Blocks',
          'MDX',
          [ 'Overview', '*' ],
          'Navigation',
          [ 'Overview', '*' ],
          'Post',
          [ 'Overview', '*' ],
          'Layout',
          [ 'Overview', '*' ]
        ]
      }
    }
  }
};

export default preview;
