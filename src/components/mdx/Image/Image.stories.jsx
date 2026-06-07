import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Image');

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
  title: 'MDX/Image'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open image: Gaudi diagram' });

    await expect(canvas.getByRole('img', { name: 'Gaudi diagram' })).toBeVisible();
    await expect(canvas.getByText('Project architecture diagram rendered as a post image.')).toBeVisible();

    await userEvent.click(trigger);

    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Project architecture diagram rendered as a post image.' });

    await expect(within(dialog).getByRole('img', { name: 'Gaudi diagram' })).toBeVisible();
    await expect(within(dialog).getByRole('button', { name: 'Close modal' })).toBeVisible();
  },
  'render': () => renderComponentExample('MDX/Image', componentModule)
};
