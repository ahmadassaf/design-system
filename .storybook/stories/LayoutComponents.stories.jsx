import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import ArticleContentLayout from '../../src/components/layout/ArticleContentLayout';
import Aurora from '../../src/components/layout/Aurora';
import Footer from '../../src/components/layout/Footer';
import LayoutWrapper from '../../src/components/layout/LayoutWrapper';
import NewsletterForm, { BlogNewsletterForm } from '../../src/components/layout/NewsletterForm';
import Search from '../../src/components/layout/Search';

const SearchExample = () => {
  const [ query, setQuery ] = useState('');

  return (
    <div className='mx-auto max-w-xl p-6'>
      <Search resultsId='storybook-article-results' setSearchValue={ setQuery } value={ query } />
      <p id='storybook-article-results' className='mt-4 text-sm text-gray-600 dark:text-gray-300' role='status'>
        {query ? `Filtering articles by “${query}”` : 'Showing all articles'}
      </p>
    </div>
  );
};

const aside = (
  <aside className='space-y-2 px-1 py-4' aria-label='Article contents'>
    <h2 className='text-sm font-semibold text-gray-950 dark:text-white'>On this page</h2>
    <a href='#layout-boundaries' className='block text-sm text-blue-600 dark:text-blue-400'>Layout boundaries</a>
  </aside>
);

export default {
  id: 'layout-components',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'Layout/Components'
};

export const ArticleContent = {
  name: 'ArticleContentLayout',
  render: () => (
    <div className='mx-auto max-w-6xl px-6'>
      <ArticleContentLayout aside={ aside } collapsibleAside>
        <h1 id='layout-boundaries'>Layout boundaries</h1>
        <p>ArticleContentLayout keeps long-form content and its supporting navigation readable across breakpoints.</p>
      </ArticleContentLayout>
    </div>
  )
};

export const AuroraSurface = {
  name: 'Aurora',
  render: () => (
    <Aurora className='min-h-[28rem] px-6'>
      <div className='relative z-10 max-w-2xl text-center'>
        <h1 className='text-4xl font-bold text-gray-950 dark:text-white'>Theme-aware page atmosphere</h1>
        <p className='mt-4 text-gray-600 dark:text-gray-300'>Content remains complete when motion or decorative gradients are unavailable.</p>
      </div>
    </Aurora>
  )
};

export const FooterLayout = {
  name: 'Footer',
  render: () => <div className='mx-auto max-w-6xl px-6'><Footer /></div>
};

export const PageShell = {
  name: 'LayoutWrapper',
  render: () => (
    <LayoutWrapper footerProps={{ newsletterProps: { endpoint: '/api/buttondown' } }}>
      <div className='mx-auto max-w-4xl px-6 py-16'>
        <h1 className='text-4xl font-bold'>Application page shell</h1>
        <p className='mt-4 text-gray-600 dark:text-gray-300'>LayoutWrapper composes the shared navigation, main landmark, and footer.</p>
      </div>
    </LayoutWrapper>
  )
};

export const Newsletter = {
  name: 'NewsletterForm',
  render: () => <div className='mx-auto max-w-xl p-6'><NewsletterForm /></div>
};

export const BlogNewsletter = {
  name: 'BlogNewsletterForm',
  render: () => <div className='mx-auto max-w-2xl p-6'><BlogNewsletterForm title='Subscribe to new articles' /></div>
};

export const ArticleSearch = {
  name: 'Search',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'Filter articles' });

    await userEvent.type(search, 'graphs');
    await expect(canvas.getByRole('status')).toHaveTextContent('Filtering articles by “graphs”');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear article filter' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing all articles');
  },
  render: () => <SearchExample />
};
