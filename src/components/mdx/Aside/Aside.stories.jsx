import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Aside');

export default {
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'MDX/Aside'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const asideText = canvas.getByText('Additional context that supports the article without interrupting the main argument.');
    const aside = asideText.closest('.text-sm');

    await expect(asideText).toBeVisible();
    await expect(aside).toHaveClass('text-sm', 'leading-6', 'border-l-4', 'bg-gray-50');
    await expect(aside).toHaveTextContent('Additional context that supports the article without interrupting the main argument.');
  },
  'render': () => renderComponentExample('MDX/Aside', componentModule)
};
