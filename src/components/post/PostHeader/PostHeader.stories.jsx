import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Post/PostHeader');

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
  title: 'Post/PostHeader'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('heading', { level: 1, name: 'Design systems keep editorial rhythm predictable' });
    const category = canvas.getByRole('link', { name: 'Engineering' });
    const seriesTrigger = canvas.getByRole('button', { name: /Design Systems/u });
    const progress = canvas.getByRole('progressbar', { name: 'Series progress' });

    await expect(title).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 3, name: 'How component ownership keeps a blog interface consistent.' })).toBeVisible();
    await expect(category).toHaveAttribute('href', '/blog/categories/engineering');
    await expect(canvas.getByText('20 May 2026')).toBeVisible();
    await expect(canvas.getByText('8 min read')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'design systems' })).toHaveAttribute('href', '/blog/tags/design-systems');
    await expect(canvas.getByRole('link', { name: 'storybook' })).toHaveAttribute('href', '/blog/tags/storybook');
    await expect(seriesTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(progress).toHaveAttribute('aria-valuenow', '0');
  },
  'render': () => renderComponentExample('Post/PostHeader', componentModule)
};
