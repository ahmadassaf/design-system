import { expect, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import MenuBlog from './MenuBlog';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Navigation/MenuBlog');

const categories = [
  {
    'description': 'Patterns for building accessible interfaces.',
    'id': 'web-development',
    'title': 'web-development'
  },
  {
    'description': 'Applied AI notes and production data work.',
    'id': 'data',
    'title': 'data'
  }
];

export default {
  args: {
    categories
  },
  component: MenuBlog,
  excludeStories: [ 'Example' ],
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ '!autodocs' ],
  title: 'Navigation/MenuBlog'
};

export const Example = {
  'render': () => renderComponentExample('Navigation/MenuBlog', componentModule)
};

export const CategoryDisclosure = {
  render: (args) => (
    <ul className='flex p-8'>
      <MenuBlog categories={ args.categories } />
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Categories' });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: /web development/i })).toHaveAttribute('href', '/blog/categories/web-development');
    await expect(canvas.getByText('Patterns for building accessible interfaces.')).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /data/i })).toHaveAttribute('href', '/blog/categories/data');

    await userEvent.click(document.body);

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};
