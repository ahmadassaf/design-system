const designSystemPreset = require('./tailwind-preset.cjs');
const addVariablesColors = require('./src/tailwind/addVariablesColors.cjs');
const tailwindGrid = require('./src/tailwind/tailwindGrid.cjs');

module.exports = {
  content: [
    './.storybook/**/*.{js,jsx,mdx}',
    './src/**/*.{js,jsx,mdx}'
  ],
  darkMode: 'class',
  plugins: [
    addVariablesColors,
    tailwindGrid
  ],
  presets: [ designSystemPreset ]
};
