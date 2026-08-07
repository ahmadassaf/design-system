import { expect, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import PostSeriesBox from './index';

const componentDocs = getComponentDocs('Post/PostSeriesBox');

const series = [
  { order: 1, series: 'Design Systems', slug: 'foundations', title: 'Foundations' },
  { order: 2, series: 'Design Systems', slug: 'components', title: 'Components' },
  { order: 3, series: 'Design Systems', slug: 'documentation', title: 'Documentation' }
];

export default {
  args: {
    series,
    slug: 'components'
  },
  component: PostSeriesBox,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Post/PostSeriesBox'
};

export const Example = {
  render: (args) => (
    <div className='max-w-3xl p-6'>
      <PostSeriesBox { ...args } />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /Design Systems/i });
    const progress = canvas.getByRole('progressbar', { name: 'Series progress' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(progress).toHaveAttribute('aria-valuenow', '2');
    await expect(progress).toHaveAttribute('aria-valuemax', '3');

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Components')).toBeInTheDocument();
    await expect(canvas.queryByRole('link', { name: 'Components' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Foundations' })).toHaveAttribute('href', '/blog/foundations');
    await expect(canvas.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/blog/documentation');

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};

export const NoSeries = {
  args: {
    series: []
  },
  render: (args) => (
    <div className='max-w-3xl space-y-3 p-6'>
      <PostSeriesBox { ...args } />
      <p className='text-sm text-gray-600 dark:text-gray-300'>No series navigation is rendered when a post does not belong to a series.</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvas.getByText('No series navigation is rendered when a post does not belong to a series.')).toBeVisible();
  }
};
