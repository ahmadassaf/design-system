import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
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
