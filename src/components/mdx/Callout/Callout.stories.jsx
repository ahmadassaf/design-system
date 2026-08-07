import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Callout');

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
  id: 'mdx-callout',
  title: 'MDX/Callout'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const calloutText = canvas.getByText('Use callouts for important editorial context, warnings, and implementation notes.');
    const callout = calloutText.closest('aside');
    const body = callout?.querySelector('div');

    await expect(calloutText).toBeVisible();
    await expect(callout).toHaveClass('rounded-md', 'border', 'border-info-border', 'bg-info-subtle');
    await expect(body).toHaveClass('text-info');
    await expect(callout).toHaveTextContent('Use callouts for important editorial context, warnings, and implementation notes.');
  },
  'render': () => renderComponentExample('MDX/Callout', componentModule)
};
