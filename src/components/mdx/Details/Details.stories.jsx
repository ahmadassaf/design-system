import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Details');

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
  id: 'mdx-details',
  title: 'MDX/Details'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Implementation detail' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Details are keyboard accessible and preserve article flow.')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Details are keyboard accessible and preserve article flow.')).toBeVisible();

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Details are keyboard accessible and preserve article flow.')).not.toBeInTheDocument();
  },
  'render': () => renderComponentExample('MDX/Details', componentModule)
};
