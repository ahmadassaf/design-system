import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

addons.setConfig({
  theme: themes.light
});

function applyManagerTheme(theme) {
  const isDark = theme === 'dark';

  document.documentElement.classList.toggle('dark', isDark);
  document.body?.classList.toggle('dark', isDark);

  addons.setConfig({
    theme: isDark ? themes.dark : themes.light
  });
}

addons.register('gaudi/storybook-theme-and-layout', (api) => {
  const syncInitialLayout = () => {
    applyManagerTheme(api.getGlobals?.().theme);
    api.setSizes({ bottomPanelHeight: 0, rightPanelWidth: 0 });
    api.togglePanel(false);
  };

  window.setTimeout(syncInitialLayout, 0);
  window.setTimeout(syncInitialLayout, 250);
  window.setTimeout(syncInitialLayout, 750);

  api.on(GLOBALS_UPDATED, ({ globals, userGlobals }) => {
    applyManagerTheme(globals?.theme ?? userGlobals?.theme);
  });
});
