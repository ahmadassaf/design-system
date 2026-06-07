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
  title: 'MDX/Callout'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const calloutText = canvas.getByText('Use callouts for important editorial context, warnings, and implementation notes.');
    const body = calloutText.closest('.text-blue-800');
    const callout = body?.parentElement;

    await expect(calloutText).toBeVisible();
    await expect(callout).toHaveClass('rounded-lg', 'border', 'border-blue-200', 'bg-gradient-to-br');
    await expect(body).toHaveClass('text-blue-800');
    await expect(callout).toHaveTextContent('Use callouts for important editorial context, warnings, and implementation notes.');
  },
  'render': () => renderComponentExample('MDX/Callout', componentModule)
};
