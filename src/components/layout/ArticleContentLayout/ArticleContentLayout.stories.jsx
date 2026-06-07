import { expect, userEvent, within } from 'storybook/test';

import ArticleContentLayout from './ArticleContentLayout';

const ArticleBody = () => (
  <>
    <h1>Design systems keep editorial rhythm predictable</h1>
    <p>
      Layout primitives should make the common reading path feel calm while keeping
      surrounding navigation available when it helps the reader.
    </p>
    <h2 id='composition'>Composition</h2>
    <p>
      The article column owns the prose width and the aside column owns secondary
      navigation, citations, and related content.
    </p>
  </>
);

const ArticleAside = () => (
  <nav aria-label='Article sections' className='mt-4 space-y-2 text-sm'>
    <a className='block text-gray-600 hover:text-blue-600 dark:text-gray-300' href='#composition'>Composition</a>
    <a className='block text-gray-600 hover:text-blue-600 dark:text-gray-300' href='#references'>References</a>
  </nav>
);

export default {
  argTypes: {
    asideOpen: {
      control: 'boolean'
    },
    collapsibleAside: {
      control: 'boolean'
    },
    padding: {
      control: 'select',
      options: [ 'md', 'lg' ]
    },
    showAsideToggleControl: {
      control: 'boolean'
    }
  },
  component: ArticleContentLayout,
  tags: [ 'autodocs' ],
  title: 'Layout/ArticleContentLayout'
};

export const CollapsibleAside = {
  args: {
    aside: <ArticleAside />,
    asideToggleLabel: 'Table of contents',
    collapsibleAside: true,
    defaultAsideOpen: true,
    padding: 'md'
  },
  render: (args) => (
    <ArticleContentLayout { ...args }>
      <ArticleBody />
    </ArticleContentLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const articleHeading = canvas.getByRole('heading', {
      name: 'Design systems keep editorial rhythm predictable'
    });
    const toggle = canvas.getByRole('button', { name: 'Hide Table of contents' });

    await expect(articleHeading).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('navigation', { name: 'Article sections' })).toBeVisible();

    await userEvent.click(toggle);

    await expect(canvas.getByRole('button', { name: 'Show Table of contents' })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('navigation', { name: 'Article sections' })).not.toBeInTheDocument();
  }
};

export const FixedAside = {
  args: {
    aside: <ArticleAside />,
    collapsibleAside: false,
    padding: 'lg'
  },
  render: (args) => (
    <ArticleContentLayout { ...args }>
      <ArticleBody />
    </ArticleContentLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('navigation', { name: 'Article sections' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: /Table of contents/u })).not.toBeInTheDocument();
  }
};
