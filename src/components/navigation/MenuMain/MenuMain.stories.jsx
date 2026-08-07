import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import MenuMain from './MenuMain';

const componentDocs = getComponentDocs('Navigation/MenuMain');

const categories = [
  { 'description': 'Posts about applied AI systems and product engineering.', 'id': 'ai-engineering', 'title': 'ai-engineering' },
  { 'description': 'Notes on RDF, linked data, and graph-backed applications.', 'id': 'knowledge-graphs', 'title': 'knowledge-graphs' }
];

const allPosts = [
  { 'date': '2026-05-20', 'slug': 'design-systems', 'title': 'Design systems keep editorial rhythm predictable' },
  { 'date': '2026-04-18', 'slug': 'knowledge-graphs', 'title': 'Knowledge graphs for product teams' },
  { 'date': '2026-03-16', 'slug': 'component-contracts', 'title': 'Component contracts for navigation' },
  { 'date': '2026-02-10', 'slug': 'older-post', 'title': 'Older post outside the recent list' }
];

export default {
  args: {
    allPosts,
    categories
  },
  component: MenuMain,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ '!autodocs' ],
  title: 'Navigation/MenuMain'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blogButton = canvas.getByRole('button', { name: /Blog/i });

    await waitFor(async () => {
      await expect(blogButton).toHaveAttribute('aria-expanded', 'false');
    });

    await userEvent.click(blogButton);

    const knowledgeCategoryLink = canvas
      .getAllByRole('link', { name: /knowledge graphs/i })
      .find((link) => link.getAttribute('href') === '/blog/categories/knowledge-graphs');

    await expect(blogButton).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('href', '/blog/categories/ai-engineering');
    await expect(knowledgeCategoryLink).toBeDefined();
    await expect(canvas.getByRole('heading', { name: 'Recent posts' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: /See all/i })).toHaveAttribute('href', '/blog');
    await expect(canvas.getByRole('link', { name: 'Design systems keep editorial rhythm predictable' })).toHaveAttribute('href', '/blog/design-systems');
    await expect(canvas.getByText('Component contracts for navigation')).toBeVisible();
    await expect(canvas.queryByText('Older post outside the recent list')).toBeNull();

    await userEvent.click(canvas.getByRole('heading', { name: 'Recent posts' }));
    await expect(blogButton).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('heading', { name: 'Recent posts' })).toBeVisible();

    await userEvent.click(blogButton);

    await expect(blogButton).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Recent posts')).toBeNull();
  },
  render: (args) => (
    <div className='max-w-md p-6'>
      <ul>
        <MenuMain { ...args } />
      </ul>
    </div>
  )
};
