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
      storySort: (a, b) => {
        const groupOrder = [ 'Overview', 'Core', 'Blocks', 'MDX', 'Navigation', 'Post', 'Layout' ];
        const nameOrder = {
          'Layout': [
            'Main Page',
            'Blog Main Page',
            'Category Page With Posts And Pagination',
            'Categories Page',
            'Tags Page',
            'Projects Page',
            'Publications Page',
            'About Me Page'
          ],
          'Overview': [
            'Getting Started',
            'Accessibility',
            'Colors & Tokens',
            'Typography',
            'Icons',
            'Indicators'
          ]
        };
        const storyRank = (title) => {
          const rank = groupOrder.indexOf(title.split('/')[0]);

          return rank === -1 ? groupOrder.length - 1 : rank;
        };
        const rankDiff = storyRank(a.title) - storyRank(b.title);

        if (rankDiff !== 0) return rankDiff;

        const group = a.title.split('/')[0];
        const orderedNames = nameOrder[group];

        if (orderedNames) {
          const aName = group === 'Layout' ? a.name : a.title.split('/')[1] || a.name;
          const bName = group === 'Layout' ? b.name : b.title.split('/')[1] || b.name;
          const aIndex = orderedNames.indexOf(aName);
          const bIndex = orderedNames.indexOf(bName);

          if (aIndex !== -1 || bIndex !== -1) {
            return (aIndex === -1 ? orderedNames.length : aIndex) - (bIndex === -1 ? orderedNames.length : bIndex);
          }
        }

        return a.title.localeCompare(b.title, undefined, { numeric: true }) || a.name.localeCompare(b.name, undefined, { numeric: true });
      }
    }
  }
};

export default preview;
