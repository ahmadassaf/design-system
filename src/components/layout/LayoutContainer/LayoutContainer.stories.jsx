import { expect, within } from 'storybook/test';

import Aurora from '../Aurora';
import Footer from '../Footer';
import FloatingMenu from '../../navigation/FloatingMenu';
import Menu from '../../navigation/Menu';

const footerProps = {
  copyrightName: 'Container Labs',
  newsletterProps: {
    title: 'Container updates'
  },
  sections: [
    {
      links: [
        { href: '/blog/categories/engineering', label: 'Engineering' },
        { href: '/blog/projects/gaudi', label: 'Gaudi' }
      ],
      title: 'Explore'
    }
  ],
  socialLinks: [
    { href: 'mailto:hello@example.com', kind: 'mail' },
    { href: 'https://github.com/ahmadassaf', kind: 'github' }
  ]
};

const menuProps = {
  categories: [
    {
      description: 'Development, programming and code',
      id: 'engineering',
      title: 'Engineering'
    }
  ],
  posts: [
    {
      date: '2026-05-20',
      path: '/blog/design-systems-keep-editorial-rhythm-predictable',
      slug: 'design-systems-keep-editorial-rhythm-predictable',
      title: 'Design systems keep editorial rhythm predictable'
    }
  ],
  projects: [],
  publications: [],
  tags: [],
  thoughts: []
};

const LayoutContainerPreview = ({ children, footerProps: storyFooterProps, menuProps: storyMenuProps }) => (
  <div className='bg-white text-black antialiased dark:bg-gray-900 dark:text-white'>
    <Aurora>
      <div className='relative isolate w-full px-4 dark:z-10 sm:w-[95%] sm:px-8 xl:max-w-6xl'>
        <div className='flex min-h-screen flex-col justify-between'>
          <FloatingMenu />
          <Menu { ...storyMenuProps } />
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Gaudi Design System',
                url: 'https://github.com/ahmadassaf/design-system'
              })
            }}
          />
          <main className='mb-4'>{children}</main>
          <Footer { ...storyFooterProps } />
        </div>
      </div>
    </Aurora>
  </div>
);

export default {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/'
      }
    }
  },
  tags: [ 'autodocs' ],
  title: 'Layout/LayoutContainer'
};

export const ResolvedPageShell = {
  args: {
    footerProps,
    menuProps
  },
  render: (args) => (
    <LayoutContainerPreview { ...args }>
      <section aria-labelledby='container-heading' className='py-12'>
        <h1 id='container-heading' className='text-3xl font-bold text-gray-950 dark:text-white'>
          Server layout content
        </h1>
        <p className='mt-3 text-gray-600 dark:text-gray-300'>
          The public layout resolves theme, structured data, navigation, content, and footer.
        </p>
      </section>
    </LayoutContainerPreview>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getAllByRole('main').find((element) => element.classList.contains('mb-4'));
    const footer = canvas.getByRole('contentinfo');
    const structuredData = canvasElement.querySelector('script[type="application/ld+json"]');

    await expect(main).toBeDefined();
    await expect(within(main).getByRole('heading', { name: 'Server layout content' })).toBeVisible();
    await expect(canvasElement.querySelector('.aurora')).toBeInTheDocument();
    await expect(structuredData).toBeInTheDocument();
    await expect(structuredData.textContent).toEqual(expect.stringContaining('"@type":"WebSite"'));
    await expect(within(footer).getByRole('link', { name: 'Engineering' })).toHaveAttribute('href', '/blog/categories/engineering');
  }
};
