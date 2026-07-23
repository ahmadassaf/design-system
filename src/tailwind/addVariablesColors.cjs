const { dsVariables } = require('../tokens/tokens.cjs');

/**
 * Emits the palette as `:root` custom properties for consumers that read
 * colors from CSS variables (charts, third-party embeds, ...).
 *
 * `--dark`, `--gray-700` and `--gray-900` intentionally do NOT follow
 * `theme('colors.gray.*')` (Tailwind's blue-tinted gray): the design system's
 * text scale is neutral-based, so they mirror the `--ds-*` tokens instead.
 * Emitted names and values are unchanged for backwards compatibility.
 */
module.exports = function addVariablesForColors({ addBase, theme }) {
  addBase({
    ':root': {
      '--blue-100': theme('colors.blue.100'),
      '--blue-200': theme('colors.blue.200'),
      '--blue-300': theme('colors.blue.300'),
      '--blue-500': theme('colors.blue.500'),
      '--blue-600': theme('colors.blue.600'),
      '--blue-700': theme('colors.blue.700'),
      '--dark': dsVariables.root['--ds-color-dark'],
      '--gray-100': theme('colors.gray.100'),
      '--gray-200': theme('colors.gray.200'),
      '--gray-300': theme('colors.gray.300'),
      '--gray-500': theme('colors.gray.500'),
      '--gray-600': theme('colors.gray.600'),
      '--gray-700': dsVariables.root['--ds-color-text-muted'],
      '--gray-900': dsVariables.root['--ds-color-text'],
      '--indigo-300': theme('colors.indigo.300'),
      '--neutral-100': theme('colors.neutral.100'),
      '--neutral-200': theme('colors.neutral.200'),
      '--neutral-300': theme('colors.neutral.300'),
      '--neutral-500': theme('colors.neutral.500'),
      '--neutral-600': theme('colors.neutral.600'),
      '--neutral-700': theme('colors.neutral.700'),
      '--transparent': 'rgba(0,0,0,0)',
      '--white': theme('colors.white')
    }
  });
};
