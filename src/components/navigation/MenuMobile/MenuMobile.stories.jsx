import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import MenuMobile from './MenuMobile';

const componentDocs = getComponentDocs('Navigation/MenuMobile');

const categories = [
  { 'description': 'Posts about applied AI systems and product engineering.', 'id': 'ai-engineering', 'title': 'ai-engineering' },
  { 'description': 'Notes on RDF, linked data, and graph-backed applications.', 'id': 'knowledge-graphs', 'title': 'knowledge-graphs' }
];

const links = [
  { 'href': '#blog', 'title': 'Blog' },
  { 'href': '#publications', 'title': 'Publications' },
  { 'href': '#projects', 'title': 'Projects' },
  { 'href': '#about', 'title': 'About' }
];

export default {
  args: {
    categories,
    links,
    setLauncherOpen: fn(),
    setMobileMenuOpen: fn()
  },
  component: MenuMobile,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ '!autodocs' ],
  title: 'Navigation/MenuMobile'
};

export const Example = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog', { name: 'Mobile navigation' });
    const closeButton = canvas.getByRole('button', { name: 'Close menu' });
    const searchButton = canvas.getByRole('button', { name: 'Open search' });

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(async () => {
      await expect(closeButton).toHaveFocus();
    });
    await expect(canvas.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('href', '/blog/categories/ai-engineering');
    await expect(canvas.getByRole('link', { name: /Publications/i })).toHaveAttribute('href', '#publications');

    await userEvent.click(searchButton);

    await expect(args.setLauncherOpen).toHaveBeenCalledWith(true);

    await userEvent.keyboard('{Escape}');

    await expect(args.setMobileMenuOpen).toHaveBeenCalledWith(false);

    await userEvent.click(closeButton);

    await expect(args.setMobileMenuOpen).toHaveBeenCalledTimes(2);
  },
  render: (args) => (
    <div className='storybook-menu-mobile-force min-h-[720px] p-6'>
      <style>{'.storybook-menu-mobile-force .lg\\:hidden { display: block !important; }'}</style>
      <MenuMobile { ...args } />
    </div>
  )
};
