import { createComponentDocsPage, getComponentDocs } from '../../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/PipelineDiagram');

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
  id: 'mdx-pipelinediagram',
  title: 'MDX/PipelineDiagram'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Continuous deployment with Travis CI')).toBeVisible();
    await expect(canvas.getAllByText('Local changes').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('GitHub').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('Deploy').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('Server').length).toBeGreaterThanOrEqual(1);
  },
  'render': () => renderComponentExample('MDX/PipelineDiagram', componentModule)
};
