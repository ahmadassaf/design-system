import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Post/Disclaimer');
const Disclaimer = componentModule.default;

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
  title: 'Post/Disclaimer'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const defaultCopy = canvas.getByText(/opinions and views expressed on this blog are solely my own/u);
    const customCopy = canvas.getByText('Research notes are provided for context and should not be treated as advice.');
    const defaultCallout = defaultCopy.closest('aside');
    const customCallout = customCopy.closest('aside');
    const defaultBody = defaultCallout?.querySelector('div');
    const customBody = customCallout?.querySelector('div');

    await expect(defaultCopy).toBeVisible();
    await expect(customCopy).toBeVisible();
    await expect(defaultCallout).toHaveClass('border-info-border', 'bg-info-subtle');
    await expect(customCallout).toHaveClass('border-info-border', 'bg-info-subtle');
    await expect(defaultBody).toHaveClass('text-info');
    await expect(customBody).toHaveClass('text-info');
  },
  'render': () => renderComponentExample('Post/Disclaimer', componentModule)
};

export const Warning = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const warningCopy = canvas.getByText('This post includes forward-looking implementation notes.');
    const warningCallout = warningCopy.closest('aside');
    const warningBody = warningCallout?.querySelector('div');

    await expect(warningCopy).toBeVisible();
    await expect(warningCallout).toHaveClass('border-warning-border', 'bg-warning-subtle');
    await expect(warningBody).toHaveClass('text-warning');
  },
  render: () => (
    <div className='p-6'>
      <Disclaimer type='warning'>
        This post includes forward-looking implementation notes.
      </Disclaimer>
    </div>
  )
};
