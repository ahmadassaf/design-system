import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
const sourceDir = resolve(rootDir, 'src');
const siteFixturesDir = resolve(rootDir, '.storybook/fixtures/site');
const lodashEsDir = resolve(rootDir, 'node_modules/lodash-es');

export default defineConfig({
  esbuild: {
    include: /src\/.*\.js$/,
    loader: 'jsx'
  },
  plugins: [
    tailwindcss()
  ],
  resolve: {
    alias: [
      {
        find: /^lodash\/(.+)\.js$/,
        replacement: `${lodashEsDir}/$1.js`
      },
      {
        find: /^lodash\/(.+)$/,
        replacement: `${lodashEsDir}/$1.js`
      },
      {
        find: /^recharts$/,
        replacement: resolve(rootDir, 'node_modules/recharts/lib/index.js')
      },
      {
        find: /^recharts\/es6\/(?<path>.+)$/,
        replacement: `${resolve(rootDir, 'node_modules/recharts/lib')}/$<path>`
      },
      {
        find: 'contentlayer/generated',
        replacement: resolve(siteFixturesDir, 'contentlayer-generated.mjs')
      },
      {
        find: '@/app/content/categories',
        replacement: resolve(siteFixturesDir, 'categories.json')
      },
      {
        find: '@/app/content/publications',
        replacement: resolve(siteFixturesDir, 'publications.json')
      },
      {
        find: '@/app/content/tags',
        replacement: resolve(siteFixturesDir, 'tags.json')
      },
      {
        find: /^@\/components\/(?<path>.*)$/,
        replacement: `${resolve(sourceDir, 'components')}/$1`
      },
      {
        find: /^@\/foundations\/(?<path>.*)$/,
        replacement: `${resolve(sourceDir, 'foundations')}/$1`
      },
      {
        find: /^@\/utilities\/(?<path>.*)$/,
        replacement: `${resolve(sourceDir, 'utilities')}/$1`
      },
      {
        find: /^@\/css\/(?<path>.*)$/,
        replacement: `${resolve(sourceDir, 'styles')}/$1`
      },
      {
        find: '@/data/meta/JSON-LD/website',
        replacement: resolve(siteFixturesDir, 'website.js')
      },
      {
        find: '@/data/meta/metadata',
        replacement: resolve(siteFixturesDir, 'metadata.js')
      },
      {
        find: '@/data/meta/navigationMetadata',
        replacement: resolve(siteFixturesDir, 'navigationMetadata.mjs')
      },
      {
        find: '@/lib/utils/contentlayer',
        replacement: resolve(siteFixturesDir, 'contentlayer.js')
      },
      {
        find: '@/lib/utils/formatDate',
        replacement: resolve(siteFixturesDir, 'formatDate.js')
      },
      {
        find: /^@\/(?<path>.*)$/,
        replacement: `${rootDir}/$1`
      }
    ]
  },
  test: {
    projects: [
      {
        plugins: [
          storybookTest({
            configDir: resolve(rootDir, '.storybook'),
            storybookScript: 'pnpm storybook -- --no-open'
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            instances: [
              {
                browser: 'chromium'
              }
            ],
            provider: playwright({})
          },
          setupFiles: [
            './.storybook/vitest.setup.js'
          ]
        }
      }
    ]
  }
});
