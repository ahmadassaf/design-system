import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lucideIconOptimizeDeps } from './.storybook/viteOptimizeDeps.js';

const rootDir = dirname(fileURLToPath(import.meta.url));
const lodashEsDir = resolve(rootDir, 'node_modules/lodash-es');

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  optimizeDeps: {
    include: lucideIconOptimizeDeps
  },
  resolve: {
    alias: [
      {
        find: /^lodash\/(.+)\.js$/,
        replacement: `${lodashEsDir}/$1.js`
      },
      {
        find: /^lodash\/(.+)$/,
        replacement: `${lodashEsDir}/$1.js`
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
