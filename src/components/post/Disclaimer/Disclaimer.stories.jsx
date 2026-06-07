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
    const defaultBody = defaultCopy.closest('.text-blue-800');
    const customBody = customCopy.closest('.text-blue-800');

    await expect(defaultCopy).toBeVisible();
    await expect(customCopy).toBeVisible();
    await expect(defaultBody?.parentElement).toHaveClass('border-blue-200');
    await expect(customBody?.parentElement).toHaveClass('bg-gradient-to-br');
  },
  'render': () => renderComponentExample('Post/Disclaimer', componentModule)
};

export const Warning = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const warningCopy = canvas.getByText('This post includes forward-looking implementation notes.');
    const warningBody = warningCopy.closest('.text-yellow-800');

    await expect(warningCopy).toBeVisible();
    await expect(warningBody?.parentElement).toHaveClass('border-yellow-200');
  },
  render: () => (
    <div className='p-6'>
      <Disclaimer type='warning'>
        This post includes forward-looking implementation notes.
      </Disclaimer>
    </div>
  )
};
