import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Footnote');

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
  id: 'mdx-footnote',
  title: 'MDX/Footnote'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footnote = canvas.getByRole('link', { name: 'Footnote 1' });

    await expect(footnote).toHaveAttribute('href', '#user-content-fn-1');
    await expect(footnote).toHaveAttribute('data-footnote-popover', 'true');
    await expect(canvas.getByText('A short explanatory footnote with an external source.')).toBeVisible();

    await userEvent.hover(footnote);

    await waitFor(async () => {
      await expect(canvasElement.ownerDocument.body).toHaveTextContent('A short explanatory footnote with an external source.');
      await expect(within(canvasElement.ownerDocument.body).getByRole('link', { name: 'external source' })).toBeVisible();
    });
  },
  'render': () => renderComponentExample('MDX/Footnote', componentModule)
};
