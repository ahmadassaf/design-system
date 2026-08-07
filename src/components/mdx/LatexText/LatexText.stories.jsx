import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/LatexText');

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
  id: 'mdx-latextext',
  title: 'MDX/LatexText'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const paragraph = canvas.getByText(/Ordinal text stays readable:/i);

    await expect(paragraph).toBeVisible();
    await expect(paragraph).toHaveTextContent('International Conference');
    await expect(paragraph).not.toHaveTextContent('$^{th}$');
    await expect(canvasElement.querySelector('.katex')).toBeInTheDocument();
  },
  'render': () => renderComponentExample('MDX/LatexText', componentModule)
};
