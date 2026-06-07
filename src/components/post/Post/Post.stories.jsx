import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Post/Post');
const Post = componentModule.default;

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
  title: 'Post/Post'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const article = canvas.getByRole('article');
    const titleLink = canvas.getByRole('link', { name: 'Design systems keep editorial rhythm predictable' });
    const categoryLink = canvas.getByRole('link', { name: 'engineering' });
    const date = article.querySelector('time');

    await expect(titleLink).toHaveAttribute('href', '/blog/design-systems');
    await expect(categoryLink).toHaveAttribute('href', '/blog/categories/engineering');
    await expect(date).toHaveAttribute('dateTime', '2026-05-20');
    await expect(canvas.getByText('How component ownership keeps a blog interface consistent.')).toBeVisible();
    await expect(canvas.queryByText('Draft')).not.toBeInTheDocument();
  },
  'render': () => renderComponentExample('Post/Post', componentModule)
};

export const DraftThought = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const titleLink = canvas.getByRole('link', { name: 'A short thought about contracts' });

    await expect(titleLink).toHaveAttribute('href', '/thoughts/component-contracts');
    await expect(canvas.getByText('Draft')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'process' })).toHaveAttribute('href', '/blog/categories/process');
  },
  render: () => (
    <div className='dark max-w-3xl bg-gray-950 p-6 text-gray-100'>
      <ul>
        <Post
          frontMatter={{
            category: 'process',
            date: '2026-06-01',
            draft: true,
            slug: 'component-contracts',
            subtitle: 'Contract tests should protect behavior consumers can observe.',
            title: 'A short thought about contracts',
            type: 'Thought'
          }}
        />
      </ul>
    </div>
  )
};
