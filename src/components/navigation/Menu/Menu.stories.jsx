import { expect, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import Menu from './Menu';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Navigation/Menu');

const categories = [
  {
    'description': 'Patterns for building accessible interfaces.',
    'id': 'web-development',
    'title': 'web-development'
  },
  {
    'description': 'Notes on product and engineering leadership.',
    'id': 'management',
    'title': 'management'
  }
];

const posts = [
  {
    'date': '2026-05-20',
    'slug': 'design-systems-keep-editorial-rhythm-predictable',
    'title': 'Design systems keep editorial rhythm predictable'
  },
  {
    'date': '2026-04-02',
    'slug': 'accessible-navigation-patterns',
    'title': 'Accessible navigation patterns'
  }
];

const projects = [
  {
    'date': '2026-05-12',
    'description': 'Reusable interface foundations for editorial software.',
    'slug': 'gaudi',
    'title': 'Gaudi'
  }
];

const publications = [
  {
    'href': 'https://example.com/paper',
    'id': 1,
    'title': 'Capability-centric knowledge graphs',
    'venue': 'ESWC'
  }
];

const tags = [
  {
    'count': 2,
    'id': 'accessibility',
    'slug': 'accessibility',
    'title': 'Accessibility'
  }
];

const thoughts = [
  {
    'date': '2026-04-18',
    'description': 'Notes on making product decisions legible.',
    'slug': 'making-decisions',
    'title': 'Making decisions'
  }
];

export default {
  args: {
    categories,
    posts,
    projects,
    publications,
    tags,
    thoughts
  },
  component: Menu,
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
  title: 'Navigation/Menu'
};

export const Example = {
  'render': () => renderComponentExample('Navigation/Menu', componentModule)
};

export const PrimaryNavigation = {
  render: (args) => <Menu { ...args } />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mobileTrigger = canvas.queryByRole('button', { name: 'Open main menu' });

    await expect(canvas.getByRole('link', { name: 'Ahmad Assaf' })).toHaveAttribute('href', '/');

    if (mobileTrigger) {
      await userEvent.click(mobileTrigger);

      const page = within(document.body);
      const dialog = await page.findByRole('dialog', { name: 'Mobile navigation' });
      const mobileNavigation = within(dialog);

      await expect(mobileNavigation.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/blog/projects');
      await userEvent.click(mobileNavigation.getByRole('button', { name: 'Close menu' }));
      await expect(page.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument();

      return;
    }

    await expect(canvas.getByRole('button', { name: 'Open search' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Toggle Dark Mode' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/blog/projects');

    const blogTrigger = canvas.getByRole('button', { name: 'Blog' });

    await userEvent.click(blogTrigger);

    await expect(blogTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('link', { name: /web development/i })).toHaveAttribute('href', '/blog/categories/web-development');
    await expect(canvas.getByText('Design systems keep editorial rhythm predictable')).toBeInTheDocument();

    await userEvent.click(document.body);

    await expect(blogTrigger).toHaveAttribute('aria-expanded', 'false');
  }
};
