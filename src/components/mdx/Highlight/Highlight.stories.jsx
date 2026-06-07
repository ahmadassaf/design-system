import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Highlight');

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
  title: 'MDX/Highlight'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const highlightedText = canvas.getByText('highlight');
    const highlight = highlightedText.closest('strong');

    await expect(highlightedText).toBeVisible();
    await expect(highlight).toHaveClass('font-bold');
    await expect(highlight).toHaveClass('bg-gradient-to-r');
  },
  'render': () => renderComponentExample('MDX/Highlight', componentModule)
};
