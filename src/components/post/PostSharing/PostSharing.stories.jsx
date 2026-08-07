import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import PostSharing from './index';

const componentDocs = getComponentDocs('Post/PostSharing');

const siteMetadata = {
  github: 'https://github.com/ahmadassaf/blog',
  postsRepo: 'https://github.com/ahmadassaf/blog-posts',
  siteUrl: 'https://ahmadassaf.com'
};

export default {
  args: {
    externalLink: 'engineering/design-systems',
    siteMetadata,
    slug: 'design-systems',
    tags: [ 'design systems', 'react' ],
    title: 'Design systems keep editorial rhythm predictable'
  },
  component: PostSharing,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Post/PostSharing'
};

export const Example = {
  render: (args) => (
    <div className='max-w-2xl p-6'>
      <PostSharing { ...args } />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const shareLink = canvas.getByRole('link', { name: 'Share post on X' });
    const githubProfileLink = canvas.getByRole('link', { name: 'GitHub profile' });
    const sourceLink = canvas.getByRole('link', { name: 'View on GitHub' });
    const shareUrl = new URL(shareLink.href);

    await expect(shareUrl.origin).toBe('https://x.com');
    await expect(shareUrl.pathname).toBe('/share');
    await expect(shareUrl.searchParams.get('text')).toBe(args.title);
    await expect(shareUrl.searchParams.get('url')).toBe(`${args.siteMetadata.siteUrl}/blog/${args.slug}`);
    await expect(shareUrl.searchParams.get('hashtags')).toBe('designsystems,react');
    await expect(githubProfileLink).toHaveAttribute('href', args.siteMetadata.github);
    await expect(sourceLink).toHaveAttribute('href', `${args.siteMetadata.postsRepo}/blob/master/${args.externalLink}.mdx`);
  }
};

export const WithoutTags = {
  args: {
    tags: undefined
  },
  render: (args) => (
    <div className='max-w-2xl p-6'>
      <PostSharing { ...args } />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shareUrl = new URL(canvas.getByRole('link', { name: 'Share post on X' }).href);

    await expect(shareUrl.searchParams.get('hashtags')).toBe('');
    await expect(canvas.getByRole('link', { name: 'View on GitHub' })).toBeInTheDocument();
  }
};
