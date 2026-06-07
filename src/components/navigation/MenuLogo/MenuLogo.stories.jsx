import { expect } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { MenuLogo } from '../../../index';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Navigation/MenuLogo');

export default {
  args: {
    className: 'story-logo-mark'
  },
  component: MenuLogo,
  excludeStories: [ 'Example' ],
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ '!autodocs', '!dev' ],
  title: 'Navigation/MenuLogo'
};

export const Example = {
  'render': () => renderComponentExample('Navigation/MenuLogo', componentModule)
};

export const DecorativeMark = {
  render: (args) => <MenuLogo className={ args.className } />,
  play: async ({ args, canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    const mark = svg.querySelector('g');

    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).toHaveAttribute('focusable', 'false');
    await expect(svg).toHaveAttribute('viewBox', '0 0 688.000000 688.000000');
    await expect(svg).toHaveClass(args.className);
    await expect(mark).toHaveAttribute('fill', 'currentColor');
  }
};
