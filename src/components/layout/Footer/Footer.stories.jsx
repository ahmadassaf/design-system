import { expect, within } from 'storybook/test';

import Footer from './Footer';

const sections = [
  {
    links: [
      { href: '/blog/categories/engineering', label: 'Engineering' },
      { href: '/blog/categories/data', label: 'Data' }
    ],
    title: 'Topics'
  },
  {
    links: [
      { href: '/blog/projects/gaudi', label: 'Gaudi' },
      { href: '/blog/projects/atlas', label: 'Atlas' }
    ],
    title: 'Projects'
  },
  {
    links: [
      { href: '/about', label: 'About' },
      { href: '/press', label: 'Press' }
    ],
    title: 'Company'
  }
];

const socialLinks = [
  { href: 'mailto:hello@example.com', kind: 'mail' },
  { href: 'https://github.com/ahmadassaf', kind: 'github' },
  { href: 'https://www.linkedin.com/in/ahmadassaf', kind: 'linkedin' }
];

export default {
  argTypes: {
    variant: {
      control: 'select',
      options: [ 'standard', 'editorial' ]
    }
  },
  component: Footer,
  tags: [ 'autodocs' ],
  title: 'Layout/Footer'
};

export const Standard = {
  args: {
    copyrightName: 'Gaudi Labs',
    newsletterProps: {
      title: 'Get field notes'
    },
    sections,
    socialLinks,
    variant: 'standard'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = canvas.getByRole('contentinfo');
    const footerNavigation = within(footer).getByRole('navigation', { name: 'Footer navigation' });
    const engineeringLink = within(footerNavigation).getByRole('link', { name: 'Engineering' });

    await expect(within(footer).getByRole('heading', { name: 'Footer' })).toHaveClass('sr-only');
    await expect(engineeringLink).toHaveAttribute('href', '/blog/categories/engineering');
    await expect(within(footer).getByRole('textbox', { name: 'Email address' })).toBeRequired();
    await expect(within(footer).getByRole('link', { name: 'GitHub profile' })).toHaveAttribute('target', '_blank');
    await expect(within(footer).getByText(`© ${new Date().getFullYear()} Gaudi Labs. All rights reserved.`)).toBeVisible();
  }
};

export const Editorial = {
  args: {
    brandDescription: 'Research notes for semantic systems, data products, and engineering practice.',
    brandTitle: 'Gaudi Notes',
    copyrightName: {
      name: 'Gaudi Notes'
    },
    sections,
    socialLinks,
    variant: 'editorial'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = canvas.getByRole('contentinfo');

    await expect(within(footer).getByRole('heading', { name: 'Gaudi Notes' })).toBeVisible();
    await expect(within(footer).getByRole('navigation', { name: 'Footer navigation' })).toBeVisible();
    await expect(within(footer).queryByRole('textbox', { name: 'Email address' })).not.toBeInTheDocument();
    await expect(within(footer).getByRole('link', { name: 'LinkedIn profile' })).toHaveAttribute('rel', expect.stringContaining('noopener'));
  }
};
