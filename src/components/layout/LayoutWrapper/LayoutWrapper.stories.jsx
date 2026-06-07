import { expect, within } from 'storybook/test';

import LayoutWrapper from './LayoutWrapper';

const footerProps = {
  copyrightName: 'Wrapper Labs',
  newsletterProps: {
    title: 'Wrapper updates'
  },
  sections: [
    {
      links: [
        { href: '/blog', label: 'Blog' },
        { href: '/about', label: 'About' }
      ],
      title: 'Site'
    }
  ],
  socialLinks: [
    { href: 'mailto:hello@example.com', kind: 'mail' },
    { href: 'https://github.com/ahmadassaf', kind: 'github' }
  ]
};

export default {
  component: LayoutWrapper,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/'
      }
    }
  },
  tags: [ 'autodocs' ],
  title: 'Layout/LayoutWrapper'
};

export const PageShell = {
  args: {
    footerProps
  },
  render: (args) => (
    <LayoutWrapper { ...args }>
      <section aria-labelledby='wrapper-heading' className='py-12'>
        <h1 id='wrapper-heading' className='text-3xl font-bold text-gray-950 dark:text-white'>
          Page content
        </h1>
        <p className='mt-3 text-gray-600 dark:text-gray-300'>
          The wrapper keeps navigation, body content, and footer in one full-height shell.
        </p>
      </section>
    </LayoutWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole('main');
    const footer = canvas.getByRole('contentinfo');

    await expect(within(main).getByRole('heading', { name: 'Page content' })).toBeVisible();
    await expect(within(footer).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
    await expect(within(footer).getByText(`© ${new Date().getFullYear()} Wrapper Labs. All rights reserved.`)).toBeVisible();
  }
};
