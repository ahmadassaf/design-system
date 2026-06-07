import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Post/Breadcrumbs');

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
  title: 'Post/Breadcrumbs'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    const trail = within(navigation);
    const homeLink = trail.getByRole('link', { name: 'Home' });
    const blogLink = trail.getByRole('link', { name: 'Blog' });
    const currentPage = trail.getByText('Design Systems');

    await expect(trail.getByRole('list')).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', '/');
    await expect(blogLink).toHaveAttribute('href', '/blog');
    await expect(currentPage).toHaveAttribute('aria-current', 'page');
    await expect(trail.queryByRole('link', { name: 'Design Systems' })).not.toBeInTheDocument();
  },
  'render': () => renderComponentExample('Post/Breadcrumbs', componentModule)
};
