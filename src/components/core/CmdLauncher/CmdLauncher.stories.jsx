import { useState } from 'react';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Button from '../../core/Button';
import MenuLogo from '../../navigation/MenuLogo';
import MenuSearch from '../../navigation/MenuSearch';
import CmdLauncherShortcut from '../CmdLauncherShortcut';

import CmdLauncher from './CmdLauncher';

const componentDocs = getComponentDocs('Core/CmdLauncher');

const sampleData = {
  posts: [
    {
      category: 'data',
      slug: 'knowledge-graphs',
      title: 'An Introduction to Knowledge Graphs'
    },
    {
      category: 'engineering',
      slug: 'design-systems-editorial-rhythm',
      title: 'Design systems keep editorial rhythm predictable'
    },
    {
      category: 'productivity',
      slug: 'project-notes-for-engineering-work',
      title: 'Project notes for engineering work'
    }
  ],
  projects: [
    {
      description: 'Design-system notes, tokens, and reusable interface work.',
      slug: 'gaudi',
      subtitle: 'Automate and simplify new machine setups.',
      title: 'Gaudi'
    },
    {
      description: 'A compact reading and annotation surface.',
      slug: 'booklight',
      title: 'Booklight'
    }
  ],
  publications: [
    {
      href: '',
      id: 'semantic-search-notes',
      title: 'Semantic Search Notes',
      venue: 'Gaudi Papers',
      year: 2024
    }
  ],
  tags: [
    { count: 12, id: 'semantic-web', name: 'Semantic Web', slug: 'semantic-web' },
    { count: 8, id: 'design-systems', name: 'Design Systems', slug: 'design-systems' },
    { count: 5, id: 'knowledge-graphs', name: 'Knowledge Graphs', slug: 'knowledge-graphs' }
  ],
  thoughts: [
    {
      slug: 'small-ui-contracts',
      summary: 'Short notes on reusable interface contracts.',
      title: 'Small UI contracts'
    },
    {
      slug: 'keeping-search-fast',
      summary: 'How command search stays useful as content grows.',
      title: 'Keeping search fast'
    }
  ]
};

const BlogCommandShell = () => {
  const [ open, setOpen ] = useState(false);

  return (
    <div className='min-h-[560px] rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950'>
        <div className='flex items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            <MenuLogo className='h-10 w-10' />
            <nav aria-label='Demo navigation' className='hidden items-center gap-5 text-sm text-gray-900 md:flex dark:text-gray-100'>
              <span>Blog</span>
              <span>Publications</span>
              <span>Projects</span>
              <span>Thoughts</span>
              <span>About</span>
            </nav>
          </div>
          <div className='flex items-center gap-3'>
            <MenuSearch setOpen={ setOpen } className='hidden sm:block' />
            <Button type='button' variant='outline' tone='neutral' size='sm' className='sm:hidden' onClick={ () => setOpen(true) }>
              Search
            </Button>
          </div>
        </div>

        <div className='mt-16 max-w-2xl space-y-3'>
          <p className='text-xs font-semibold uppercase text-blue-600 dark:text-blue-400'>Command launcher demo</p>
          <h3 className='text-3xl font-bold text-gray-950 dark:text-white'>Search the blog without leaving the keyboard.</h3>
          <p className='text-sm leading-7 text-gray-600 dark:text-gray-300'>
            This mirrors the production header: the search control owns the trigger and the command launcher receives blog posts,
            projects, publications, tags, and thoughts as searchable collections.
          </p>
        </div>

        <CmdLauncher
          open={ open }
          setOpen={ setOpen }
          posts={ sampleData.posts }
          projects={ sampleData.projects }
          publications={ sampleData.publications }
          tags={ sampleData.tags }
          thoughts={ sampleData.thoughts }
        />
    </div>
  );
};

export default {
  component: CmdLauncher,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    },
    layout: 'fullscreen'
  },
  tags: [ 'autodocs' ],
  id: 'core-cmdlauncher',
  title: 'Core/CmdLauncher'
};

export const Default = {
  name: 'Example',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchTrigger = canvas.queryByRole('button', { 'name': 'Open search' }) || canvas.getByRole('button', { 'name': 'Search' });

    await userEvent.click(searchTrigger);

    const documentBody = within(document.body);
    const dialog = await documentBody.findByRole('dialog');
    const palette = within(dialog);
    const search = palette.getByRole('textbox');

    await expect(palette.getByText('Explore content')).toBeInTheDocument();
    await expect(palette.getAllByText('Posts').length).toBeGreaterThan(0);
    await expect(palette.getByText('Select')).toBeInTheDocument();
    await expect(palette.getByText('Navigate')).toBeInTheDocument();

    const visibleItems = () => Array.from(dialog.querySelectorAll('.command-palette-list-item'))
      .filter((item) => item.offsetParent !== null);

    await userEvent.keyboard('{End}');
    await expect(visibleItems().at(-1)).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{Home}');
    await expect(visibleItems()[0]).toHaveAttribute('aria-selected', 'true');

    await userEvent.type(search, 'semantic');

    await expect(await palette.findByText('Semantic Web')).toBeInTheDocument();
    await expect(palette.getByText('12 posts')).toBeInTheDocument();

    await userEvent.clear(search);
    await userEvent.type(search, 'no matching command');

    await expect(await palette.findByText('No results for “no matching command”.')).toBeVisible();

    await userEvent.clear(search);
    const postsCommand = palette
      .getAllByText('Posts')
      .find((node) => node.closest('.command-palette-list-item'))
      ?.closest('.command-palette-list-item');

    await expect(postsCommand).toBeInTheDocument();
    await userEvent.click(postsCommand);

    const knowledgeGraphsCommand = (await palette.findByText('An Introduction to Knowledge Graphs')).closest('.command-palette-list-item');
    const knowledgeGraphsCategory = palette.getByText('data');

    await expect(knowledgeGraphsCommand?.querySelector('[data-cmdk-item-meta]')).toBeInTheDocument();
    await expect(knowledgeGraphsCategory).toHaveAttribute('data-cmdk-item-meta');
    await expect(knowledgeGraphsCategory).toHaveClass('ml-auto', 'text-right');

    await userEvent.keyboard('{Escape}');

    await expect(await palette.findByText('Explore content')).toBeInTheDocument();

    const projectsCommand = palette
      .getAllByText('Projects')
      .find((node) => node.closest('.command-palette-list-item'))
      ?.closest('.command-palette-list-item');

    await expect(projectsCommand).toBeInTheDocument();
    await userEvent.click(projectsCommand);

    await expect(await palette.findByText('Gaudi')).toBeInTheDocument();
    const gaudiSubtitle = palette.getByText('Automate and simplify new machine setups.');
    await expect(gaudiSubtitle).toBeInTheDocument();
    await expect(palette.queryByText('Design-system notes, tokens, and reusable interface work.')).not.toBeInTheDocument();

    const projectsHeading = palette.getByRole('heading', { 'name': 'Projects' });
    const gaudiCommand = palette.getByText('Gaudi').closest('.command-palette-list-item');
    const commandList = dialog.querySelector('[data-cmdk-list]');

    await expect(projectsHeading).toBeVisible();
    await expect(commandList).toHaveProperty('scrollTop', 0);
    await expect(gaudiCommand?.querySelector('svg[aria-hidden="true"]')).not.toBeInTheDocument();
    await expect(gaudiCommand?.querySelector('[data-cmdk-item-meta]')).not.toBeInTheDocument();
    await expect(gaudiSubtitle).toHaveClass('mt-0.5');
    await expect(gaudiSubtitle).not.toHaveClass('capitalize');

    await userEvent.keyboard('{Escape}');

    await expect(await palette.findByText('Explore content')).toBeInTheDocument();

    const publicationsCommand = palette
      .getAllByText('Publications')
      .find((node) => node.closest('.command-palette-list-item'))
      ?.closest('.command-palette-list-item');

    await expect(publicationsCommand).toBeInTheDocument();
    await userEvent.click(publicationsCommand);

    const publicationYear = await palette.findByText('2024');

    await expect(publicationYear).toHaveAttribute('data-cmdk-item-meta');
    await expect(publicationYear).toHaveClass('ml-auto', 'text-right');
    await expect(palette.queryByText('Gaudi Papers')).not.toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    await expect(await palette.findByText('Explore content')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(documentBody.queryByRole('dialog')).not.toBeInTheDocument());

    await userEvent.keyboard('{Control>}k{/Control}');

    await expect(await documentBody.findByRole('dialog')).toBeVisible();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(documentBody.queryByRole('dialog')).not.toBeInTheDocument());
  },
  render: () => <BlogCommandShell />
};

export const Shortcut = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Press')).toBeInTheDocument();
    await expect(canvas.getByText('⌘')).toBeVisible();
    await expect(canvas.getByText('+')).toBeVisible();
    await expect(canvas.getByText('K')).toBeVisible();
    await expect(canvas.getByText('to start')).toBeInTheDocument();
  },
  render: () => (
    <div className='flex min-h-[180px] items-center justify-center bg-white p-8 dark:bg-gray-950'>
      <CmdLauncherShortcut />
    </div>
  )
};
