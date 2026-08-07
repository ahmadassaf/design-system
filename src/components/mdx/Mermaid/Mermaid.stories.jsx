import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, waitFor } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Mermaid');

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
  id: 'mdx-mermaid',
  title: 'MDX/Mermaid'
};

export const Example = {
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('.mermaid-diagram svg')).toBeInTheDocument();
    }, { timeout: 10000 });

    const diagram = canvasElement.querySelector('.mermaid-diagram');

    await expect(canvasElement.querySelector('.mermaid-error')).not.toBeInTheDocument();
    await expect(diagram).toHaveAccessibleName('A publishing workflow moves from draft to review and then publication.');
    await expect(diagram).toHaveTextContent('Draft');
    await expect(diagram).toHaveTextContent('Review');
    await expect(diagram).toHaveTextContent('Publish');
  },
  'render': () => renderComponentExample('MDX/Mermaid', componentModule)
};
