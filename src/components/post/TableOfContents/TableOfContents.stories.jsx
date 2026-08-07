import { expect, waitFor } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import TableOfContents from './index';

const componentDocs = getComponentDocs('Post/TableOfContents');

const toc = [
  {
    children: [
      { children: [], depth: 2, id: 'design-tokens', url: '#design-tokens', value: 'Design tokens' },
      { children: [], depth: 2, id: 'semantic-scales', url: '#semantic-scales', value: 'Semantic scales' }
    ],
    depth: 1,
    id: 'foundations',
    url: '#foundations',
    value: 'Foundations'
  },
  {
    children: [
      { children: [], depth: 2, id: 'component-contracts', url: '#component-contracts', value: 'Component contracts' },
      { children: [], depth: 2, id: 'composition-rules', url: '#composition-rules', value: 'Composition rules' }
    ],
    depth: 1,
    id: 'components',
    url: '#components',
    value: 'Components'
  },
  {
    children: [],
    depth: 1,
    id: 'accessibility',
    url: '#accessibility',
    value: 'Accessibility'
  },
  {
    children: [],
    depth: 1,
    id: 'documentation',
    url: '#documentation',
    value: 'Documentation'
  },
  {
    children: [
      { children: [], depth: 2, id: 'release-checks', url: '#release-checks', value: 'Release checks' }
    ],
    depth: 1,
    id: 'release',
    url: '#release',
    value: 'Release'
  }
];

const articleSections = toc.flatMap((section) => [ section, ...section.children ]);

const TableOfContentsFixture = (args) => (
  <div className='grid max-w-full gap-8 p-4 sm:p-6 xl:grid-cols-12'>
    <article className='min-w-0 space-y-12 xl:col-span-8'>
      {articleSections.map((section) => {
        const Heading = section.depth === 1 ? 'h2' : 'h3';

        return (
          <section key={ section.id } className={ section.depth === 1 ? 'scroll-mt-28' : 'scroll-mt-28 pl-8' }>
            <Heading id={ section.id }>{section.value}</Heading>
            <p className='mt-3 text-sm text-gray-600 dark:text-gray-300'>
              Story fixture copy gives the table of contents real headings to observe and target.
            </p>
          </section>
        );
      })}
    </article>
    <aside className='min-w-0 xl:col-span-4'>
      <TableOfContents { ...args } className='top-6 max-h-[32rem]' />
    </aside>
  </div>
);

export default {
  args: {
    toc
  },
  component: TableOfContents,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Post/TableOfContents'
};

export const Example = {
  render: (args) => <TableOfContentsFixture { ...args } />,
  play: async ({ canvasElement }) => {
    const foundationsLink = canvasElement.querySelector('aside a[href="#foundations"]');

    await expect(foundationsLink).toHaveAttribute('href', '#foundations');
    await expect(canvasElement.querySelector('aside a[href="#design-tokens"]')).not.toBeInTheDocument();

    foundationsLink.addEventListener('click', (event) => event.preventDefault(), { once: true });
    foundationsLink.click();

    await waitFor(() => expect(canvasElement.querySelector('aside a[href="#design-tokens"]')).toBeInTheDocument());
    await expect(canvasElement.querySelector('aside a[href="#semantic-scales"]')).toHaveAttribute('href', '#semantic-scales');
    await waitFor(() => expect(foundationsLink.closest('li')).toHaveClass('text-blue-600!'));
  }
};

export const CompactToc = {
  args: {
    toc: toc.slice(0, 4)
  },
  render: (args) => <TableOfContentsFixture { ...args } />,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('aside a[href="#design-tokens"]')).toBeInTheDocument();
    await expect(canvasElement.querySelector('aside a[href="#component-contracts"]')).toHaveAttribute('href', '#component-contracts');
    await expect(canvasElement.querySelector('aside a[href="#documentation"]')).toHaveAttribute('href', '#documentation');
  }
};
