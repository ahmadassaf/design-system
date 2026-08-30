import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Post/PostNavigation');
const PostNavigation = componentModule.default;

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
  title: 'Post/PostNavigation'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previousLink = canvas.getByRole('link', { name: 'Previous Article Previous post title' });
    const nextLink = canvas.getByRole('link', { name: 'Next Article Next post title' });

    await expect(canvas.getByRole('heading', { name: 'Previous Article' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Next Article' })).toBeVisible();
    await expect(previousLink).toHaveAttribute('href', '/blog/previous-post');
    await expect(nextLink).toHaveAttribute('href', '/blog/next-post');
    await expect(previousLink).toHaveClass('block');
    await expect(nextLink).toHaveClass('block');
    await expect(nextLink).toHaveClass('text-right');
    await expect(canvasElement.querySelector('nav[aria-label="Article navigation"]')).toBeVisible();
  },
  'render': () => renderComponentExample('Post/PostNavigation', componentModule)
};

export const ThoughtNavigation = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previousLink = canvas.getByRole('link', { name: 'Previous Thought Previous thought title' });

    await expect(canvas.getByRole('heading', { name: 'Previous Thought' })).toBeVisible();
    await expect(previousLink).toHaveAttribute('href', '/thoughts/previous-thought');
    await expect(canvas.queryByRole('heading', { name: 'Next Thought' })).not.toBeInTheDocument();
  },
  render: () => (
    <div className='max-w-3xl p-6'>
      <PostNavigation
        prev={{ slug: 'previous-thought', title: 'Previous thought title' }}
        next={ null }
        type='Thought'
      />
    </div>
  )
};
