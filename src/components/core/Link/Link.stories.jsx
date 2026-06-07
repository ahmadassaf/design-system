import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';
import { Link } from '../../../index';

const componentDocs = getComponentDocs('Core/Link');

export default {
  argTypes: {
    'tone': {
      'control': 'select',
      'options': [ 'gray', 'neutral', 'blue', 'green', 'yellow', 'red', 'indigo' ]
    },
    'variant': {
      'control': 'select',
      'options': [ 'inline', 'muted', 'nav', 'bare' ]
    }
  },
  component: Link,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Link'
};

export const Internal = {
  'args': {
    'children': 'Read the blog',
    'href': '/blog',
    'tone': 'blue',
    'variant': 'inline'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { 'name': 'Read the blog' });

    await expect(link).toHaveAttribute('href', '/blog');
    await expect(link).not.toHaveAttribute('target');
    await expect(link).toHaveClass('font-medium', 'text-blue-600');
  }
};

export const External = {
  'args': {
    'children': 'Visit GitHub',
    'href': 'https://github.com/ahmadassaf',
    'tone': 'blue',
    'variant': 'inline'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { 'name': 'Visit GitHub' });

    await expect(link).toHaveAttribute('href', 'https://github.com/ahmadassaf');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
};

export const Variants = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inlineLink = canvas.getByRole('link', { 'name': 'inline' });
    const mutedLink = canvas.getByRole('link', { 'name': 'muted' });
    const navLink = canvas.getByRole('link', { 'name': 'nav' });
    const bareLink = canvas.getByRole('link', { 'name': 'bare' });

    await expect(inlineLink).toHaveClass('font-medium', 'no-underline');
    await expect(mutedLink).toHaveClass('font-medium', 'text-neutral-600');
    await expect(navLink).toHaveClass('font-semibold');
    await expect(bareLink).toHaveClass('text-current');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-4 p-6'>
      {[ 'inline', 'muted', 'nav', 'bare' ].map((variant) => (
        <Link key={ variant } href='/blog' variant={ variant }>{variant}</Link>
      ))}
    </div>
  )
};

export const Tones = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('link', { 'name': 'gray' })).toHaveClass('text-gray-700');
    await expect(canvas.getByRole('link', { 'name': 'neutral' })).toHaveClass('text-gray-950');
    await expect(canvas.getByRole('link', { 'name': 'blue' })).toHaveClass('text-blue-600');
    await expect(canvas.getByRole('link', { 'name': 'green' })).toHaveClass('text-green-700');
    await expect(canvas.getByRole('link', { 'name': 'yellow' })).toHaveClass('text-yellow-800');
    await expect(canvas.getByRole('link', { 'name': 'red' })).toHaveClass('text-red-700');
    await expect(canvas.getByRole('link', { 'name': 'indigo' })).toHaveClass('text-indigo-700');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-4 p-6'>
      {[ 'gray', 'neutral', 'blue', 'green', 'yellow', 'red', 'indigo' ].map((tone) => (
        <Link key={ tone } href='/blog' tone={ tone }>{tone}</Link>
      ))}
    </div>
  )
};

export const LinkTypes = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const internalLink = canvas.getByRole('link', { 'name': 'Internal blog link' });
    const anchorLink = canvas.getByRole('link', { 'name': 'Anchor link' });
    const externalLink = canvas.getByRole('link', { 'name': 'External documentation link' });
    const fallback = canvas.getByText('Non-link fallback text');

    await expect(internalLink).toHaveAttribute('href', '/blog');
    await expect(anchorLink).toHaveAttribute('href', '#examples');
    await expect(anchorLink).not.toHaveAttribute('target');
    await expect(externalLink).toHaveAttribute('target', '_blank');
    await expect(fallback.tagName).toBe('SPAN');
    await expect(fallback).not.toHaveAttribute('href');
    await expect(canvas.queryByRole('link', { 'name': 'Non-link fallback text' })).toBeNull();
  },
  'render': () => (
    <div className='grid gap-3 p-6'>
      <Link href='/blog'>Internal blog link</Link>
      <Link href='#examples'>Anchor link</Link>
      <Link href='https://example.com'>External documentation link</Link>
      <Link>Non-link fallback text</Link>
    </div>
  )
};
