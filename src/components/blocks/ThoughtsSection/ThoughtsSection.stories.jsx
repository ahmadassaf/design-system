import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, userEvent, within } from 'storybook/test';

import ThoughtsSection from './ThoughtsSection';

const componentDocs = getComponentDocs('Blocks/Thoughts');
const thoughts = [
  {
    'featured': true,
    'slug': 'explicit-contracts',
    'summary': 'Small interfaces stay easier to change when their public contract is tested.',
    'title': 'Explicit contracts make components durable'
  },
  {
    'featured': false,
    'slug': 'docs-are-product',
    'summary': 'A component story should show the states that teams actually ship.',
    'title': 'Docs are part of the product surface'
  },
  {
    'featured': true,
    'slug': 'interfaces-over-folders',
    'summary': 'A useful test follows the rendered UI instead of stopping at the filesystem.',
    'title': 'Interfaces matter more than folders'
  }
];

export default {
  argTypes: {
    'thoughts': {
      'control': 'object'
    }
  },
  args: {
    thoughts
  },
  component: ThoughtsSection,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Blocks/Thoughts'
};

export const RecentThoughts = {
  'name': 'Overview',
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstThoughtLink = canvas.getByRole('link', { 'name': /Explicit contracts make components durable/ });
    const secondThoughtLink = canvas.getByRole('link', { 'name': /Docs are part of the product surface/ });
    const lastThoughtLink = canvas.getByRole('link', { 'name': /Interfaces matter more than folders/ });
    const viewAllLink = canvas.getByRole('link', { 'name': 'View all thoughts' });

    await expect(canvas.getByRole('heading', { 'level': 2, 'name': 'Recent Thoughts' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('article')).toHaveLength(3);
    await expect(firstThoughtLink).toHaveAttribute('href', '/thoughts/explicit-contracts');
    await expect(secondThoughtLink).toHaveAttribute('href', '/thoughts/docs-are-product');
    await expect(lastThoughtLink).toHaveAttribute('href', '/thoughts/interfaces-over-folders');
    await expect(canvas.getAllByText('Featured')).toHaveLength(2);
    await expect(viewAllLink).toHaveAttribute('href', '/thoughts');

    await userEvent.tab();
    await expect(firstThoughtLink).toHaveFocus();
    await userEvent.tab();
    await expect(secondThoughtLink).toHaveFocus();
    await userEvent.tab();
    await expect(lastThoughtLink).toHaveFocus();
    await userEvent.tab();
    await expect(viewAllLink).toHaveFocus();
  }
};

export const SingleThought = {
  'args': {
    'thoughts': [
      {
        'featured': false,
        'slug': 'one-clear-note',
        'title': 'One clear note can still link to the archive'
      }
    ]
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thoughtLink = canvas.getByRole('link', { 'name': 'One clear note can still link to the archive' });
    const viewAllLink = canvas.getByRole('link', { 'name': 'View all thoughts' });

    await expect(canvas.getAllByRole('article')).toHaveLength(1);
    await expect(thoughtLink).toHaveAttribute('href', '/thoughts/one-clear-note');
    await expect(canvas.queryByText('Featured')).toBeNull();
    await expect(viewAllLink).toHaveAttribute('href', '/thoughts');
  }
};

export const Empty = {
  'args': {
    'thoughts': []
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { 'level': 2, 'name': 'Recent Thoughts' })).toBeInTheDocument();
    await expect(canvas.queryAllByRole('article')).toHaveLength(0);
    await expect(canvas.queryByRole('link', { 'name': 'View all thoughts' })).toBeNull();
  }
};
