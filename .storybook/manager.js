import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

import './manager.css';

const GAUDI_LOGO_PATH = 'M24 10H88L79 28H24V10ZM8 28H24V62C24 66.4 27.6 70 32 70H72V88H28C16.95 88 8 79.05 8 68V28ZM32 42H88V66H42L32 42Z';

function buildBrandSvg(fill) {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 40" width="340" height="40" role="img" aria-label="Gaudi Design System"><g transform="translate(2,0) scale(0.42)"><path d="${GAUDI_LOGO_PATH}" fill="${fill}"/></g><text x="52" y="28" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" fill="${fill}">Gaudi Design System</text></svg>`)}`;
}

const gaudiLightTheme = create({
  base: 'light',
  brandTitle: 'Gaudi Design System',
  brandUrl: '/',
  brandTarget: '_self',
  brandImage: buildBrandSvg('#0f1419'),
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  colorPrimary: '#2563a8',
  colorSecondary: '#2563a8',
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,
  textColor: '#0f1419',
  textMutedColor: '#5f6b7a',
  barBg: '#ffffff',
  barSelectedColor: '#2563a8',
  inputBorderRadius: 6
});

const gaudiDarkTheme = create({
  base: 'dark',
  brandTitle: 'Gaudi Design System',
  brandUrl: '/',
  brandTarget: '_self',
  brandImage: buildBrandSvg('#e4e6ea'),
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  colorPrimary: '#5b9bd5',
  colorSecondary: '#5b9bd5',
  appBg: '#111215',
  appContentBg: '#1a1b1e',
  appBorderColor: '#2d2f34',
  appBorderRadius: 8,
  textColor: '#e4e6ea',
  textMutedColor: '#8b929e',
  barBg: '#1a1b1e',
  barSelectedColor: '#5b9bd5',
  inputBorderRadius: 6
});

addons.setConfig({
  theme: gaudiLightTheme
});

function applyManagerTheme(theme) {
  const isDark = theme === 'dark';

  document.documentElement.classList.toggle('dark', isDark);
  document.body?.classList.toggle('dark', isDark);

  addons.setConfig({
    theme: isDark ? gaudiDarkTheme : gaudiLightTheme
  });
}

addons.register('gaudi/storybook-theme-and-layout', (api) => {
  const syncInitialLayout = () => {
    applyManagerTheme(api.getGlobals?.().theme);
    api.setSizes({ bottomPanelHeight: 0, rightPanelWidth: 0 });
  };

  window.setTimeout(syncInitialLayout, 0);
  window.setTimeout(syncInitialLayout, 250);
  window.setTimeout(syncInitialLayout, 750);

  api.on(GLOBALS_UPDATED, ({ globals, userGlobals }) => {
    applyManagerTheme(globals?.theme ?? userGlobals?.theme);
  });
});
