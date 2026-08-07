import { useState } from 'react';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import Button from '../../core/Button';
import MenuMobile from './MenuMobile';

const componentDocs = getComponentDocs('Navigation/MenuMobile');

const categories = [
  { 'description': 'Posts about applied AI systems and product engineering.', 'id': 'ai-engineering', 'title': 'ai-engineering' },
  { 'description': 'Notes on RDF, linked data, and graph-backed applications.', 'id': 'knowledge-graphs', 'title': 'knowledge-graphs' }
];

const links = [
  { 'href': '#publications', 'title': 'Publications' },
  { 'href': '#projects', 'title': 'Projects' },
  { 'href': '#about', 'title': 'About' }
];

const MenuMobileFixture = ({ initialOpen = false, ...args }) => {
  const [ open, setOpen ] = useState(initialOpen);

  const handleOpenChange = (nextOpen) => {
    args.setMobileMenuOpen(nextOpen);
    setOpen(nextOpen);
  };

  return (
    <div className={ `storybook-menu-mobile-force p-6 ${open ? 'min-h-[720px]' : 'min-h-36'}` }>
      <style>{'.lg\\:hidden { display: block !important; }'}</style>
      <Button type='button' variant='solid' tone='accent' onClick={ () => handleOpenChange(true) }>
        Open mobile navigation
      </Button>
      {open ? <MenuMobile { ...args } setMobileMenuOpen={ handleOpenChange } /> : <p className='mt-4 text-sm text-text-muted' role='status'>Mobile navigation closed</p>}
    </div>
  );
};

export default {
  argTypes: {
    blogLink: { control: 'object', description: 'Primary Blog destination rendered before its category links.' },
    categories: { control: 'object', description: 'Blog category destinations with ids, titles, and descriptions.' },
    links: { control: 'object', description: 'Additional top-level navigation destinations.' },
    setLauncherOpen: { control: false, description: 'Opens search after the mobile dialog closes.' },
    setMobileMenuOpen: { control: false, description: 'Controls the surrounding mobile-menu state.' }
  },
  args: {
    blogLink: { 'href': '#blog', 'title': 'Blog' },
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
    const page = within(document.body);
    const openButton = canvas.getByRole('button', { name: 'Open mobile navigation' });

    await expect(canvas.getByRole('status')).toHaveTextContent('Mobile navigation closed');
    await userEvent.click(openButton);

    const dialog = await page.findByRole('dialog', { name: 'Mobile navigation' });
    const portal = within(dialog);
    const closeButton = portal.getByRole('button', { name: 'Close menu' });
    const searchButton = portal.getByRole('button', { name: 'Open search' });

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    if (canvasElement.ownerDocument.hasFocus())
      await waitFor(async () => {
        await expect(closeButton).toHaveFocus();
      });
    await expect(closeButton.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    await expect(closeButton.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(portal.getByRole('navigation', { name: 'Mobile navigation links' })).toBeVisible();
    await expect(portal.getByRole('list', { name: 'Blog categories' })).toBeVisible();
    await expect(portal.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '#blog');
    await expect(portal.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('href', '/blog/categories/ai-engineering');
    await expect(portal.getByRole('link', { name: /Publications/i })).toHaveAttribute('href', '#publications');

    await userEvent.click(searchButton);

    await expect(args.setLauncherOpen).toHaveBeenCalledWith(true);
    await expect(args.setMobileMenuOpen).toHaveBeenCalledWith(false);
    await waitFor(() => expect(page.queryByRole('dialog', { name: 'Mobile navigation' })).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('Mobile navigation closed');
  },
  render: (args) => <MenuMobileFixture { ...args } />
};
