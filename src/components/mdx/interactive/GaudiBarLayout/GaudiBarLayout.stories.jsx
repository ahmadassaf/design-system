import { createComponentDocsPage, getComponentDocs } from '../../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/GaudiBarLayout');

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
  id: 'mdx-gaudibarlayout',
  title: 'MDX/GaudiBarLayout'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('How gaudiBar composes the desktop')).toBeVisible();
    await expect(canvas.getByText('Main')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { 'name': 'top bar, Right region. 3 widgets.' }));
    await expect(canvas.getByText('Wi-Fi')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { 'name': 'bottom bar, Right region. 5 widgets.' }));
    await expect(canvas.getByText('CPU')).toBeVisible();
    await expect(canvas.getByText('129GB')).toBeVisible();
    await expect(canvas.getByText('3ms')).toBeVisible();
  },
  'render': () => renderComponentExample('MDX/GaudiBarLayout', componentModule)
};
