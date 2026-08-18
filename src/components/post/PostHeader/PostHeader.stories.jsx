import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Post/PostHeader');
const PostHeader = componentModule.default;

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
    const postDate = canvas.getByText('20 May 2026');
    const seriesTrigger = canvas.getByRole('button', { name: /Design Systems/u });
    const progress = canvas.getByRole('progressbar', { name: 'Series progress' });

    await expect(title).toBeVisible();
    await expect(canvas.getByText('How component ownership keeps a blog interface consistent.')).toBeVisible();
    await expect(category).toHaveAttribute('href', '/blog/categories/engineering');
    await expect(postDate).toBeVisible();
    await expect(canvas.queryByText('8 min read')).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'design systems' })).toHaveAttribute('href', '/blog/tags/design-systems');
    await expect(await canvas.findByRole('link', { name: /^storybook$/i })).toHaveAttribute('href', '/blog/tags/storybook');
    await expect(seriesTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(progress).toHaveAttribute('aria-valuenow', '0');
  },
  'render': () => renderComponentExample('Post/PostHeader', componentModule)
};

export const WithContentsControl = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const contentsControl = canvas.getByRole('button', { name: 'Show contents' });
    const readingTime = canvas.getByText('8 min read');

    await expect(contentsControl).toBeVisible();
    await expect(readingTime).toBeVisible();
    await expect(contentsControl.parentElement.contains(readingTime)).toBe(true);
    await expect(contentsControl.compareDocumentPosition(readingTime) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  },
  'render': () => (
    <div className='max-w-5xl'>
      <PostHeader
        frontMatter={{
          'category': 'engineering',
          'date': '2026-05-20',
          'readingTime': { 'text': '8 min read' },
          'subtitle': 'How component ownership keeps a blog interface consistent.',
          'title': 'Design systems keep editorial rhythm predictable'
        }}
        siteMetadata={{ 'locale': 'en-GB' }}
        tocControl={ <button type='button'>Show contents</button> }
      />
    </div>
  )
};
