import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Quote');

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
  id: 'mdx-quote',
  title: 'MDX/Quote'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const figure = canvasElement.querySelector('figure');
    const quoteText = canvas.getByText(/Good component systems make product code calmer\./i);
    const author = canvas.getByText('Design System');
    const title = canvas.getByText('Internal principle');

    await expect(figure).toBeInTheDocument();
    await expect(figure?.querySelector('blockquote')).toContainElement(quoteText);
    await expect(author.tagName.toLowerCase()).toBe('cite');
    await expect(title.tagName.toLowerCase()).toBe('span');
  },
  'render': () => renderComponentExample('MDX/Quote', componentModule)
};
