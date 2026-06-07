import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/FileTree');

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
  title: 'MDX/FileTree'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('design-system')).toBeVisible();
    await expect(canvas.getByText('Callout.jsx')).toBeVisible();
    await expect(canvas.getByText('Table.jsx')).toBeVisible();
    await expect(canvas.getByText('tokens.js')).toBeVisible();
    await expect(canvas.getByText('package.json')).toBeVisible();
  },
  'render': () => renderComponentExample('MDX/FileTree', componentModule)
};
