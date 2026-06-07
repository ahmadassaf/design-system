import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { Pill, pillVariants } from '../../../index';

const componentDocs = getComponentDocs('Core/Pill');

export default {
  argTypes: {
    'size': {
      'control': 'select',
      'options': [ ...Object.keys(pillVariants.variants.size) ]
    },
    'tone': {
      'control': 'select',
      'options': [ ...Object.keys(pillVariants.variants.tone) ]
    },
    'variant': {
      'control': 'select',
      'options': [ ...Object.keys(pillVariants.variants.variant) ]
    }
  },
  component: Pill,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Pill'
};

export const Default = {
  'args': {
    'children': 'Engineering',
    'tone': 'blue',
    'variant': 'solid'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pill = canvas.getByText('Engineering').parentElement;

    await expect(pill.tagName).toBe('SPAN');
    await expect(pill).toHaveClass('bg-blue-600', 'text-white', 'uppercase');
    await expect(canvas.queryByRole('link', { name: 'Engineering' })).toBeNull();
  }
};

export const Tones = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('blue').parentElement).toHaveClass('bg-blue-600', 'text-white');
    await expect(canvas.getByText('gray').parentElement).toHaveClass('bg-gray-600', 'text-white');
    await expect(canvas.getByText('green').parentElement).toHaveClass('bg-green-700', 'text-white');
    await expect(canvas.getByText('indigo').parentElement).toHaveClass('bg-indigo-600', 'text-white');
    await expect(canvas.getByText('neutral').parentElement).toHaveClass('bg-neutral-600', 'text-white');
    await expect(canvas.getByText('red').parentElement).toHaveClass('bg-red-600', 'text-white');
    await expect(canvas.getByText('yellow').parentElement).toHaveClass('bg-yellow-500', 'text-gray-950');
  },
  'render': () => (
    <div className='flex max-w-3xl flex-wrap gap-2 p-6'>
      {Object.keys(pillVariants.variants.tone).map((tone) => (
        <Pill key={ tone } tone={ tone }>{tone}</Pill>
      ))}
    </div>
  )
};

export const Variants = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('solid').parentElement).toHaveClass('bg-green-700', 'text-white');
    await expect(canvas.getByText('soft').parentElement).toHaveClass('bg-green-50', 'text-green-700');
    await expect(canvas.getByText('outline').parentElement).toHaveClass('border', 'border-green-200');
    await expect(canvas.getByText('ghost').parentElement).toHaveClass('text-green-700');
    await expect(canvas.getByText('subtle').parentElement).toHaveClass('text-green-700');
    await expect(canvas.getByText('Live').parentElement.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  },
  'render': () => (
    <div className='flex max-w-3xl flex-wrap gap-2 p-6'>
      {Object.keys(pillVariants.variants.variant).map((variant) => (
        <Pill key={ variant } variant={ variant } tone='green'>{variant}</Pill>
      ))}
      <Pill tone='green' pulse>Live</Pill>
    </div>
  )
};

export const Sizes = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('xs').parentElement).toHaveClass('text-[10px]', 'px-1.5');
    await expect(canvas.getByText('sm').parentElement).toHaveClass('text-[11px]', 'px-2');
    await expect(canvas.getByText('md').parentElement).toHaveClass('text-xs', 'px-2.5');
    await expect(canvas.getByText('lg').parentElement).toHaveClass('text-sm', 'px-3');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-2 p-6'>
      {Object.keys(pillVariants.variants.size).map((size) => (
        <Pill key={ size } size={ size } tone='blue' variant='soft'>{size}</Pill>
      ))}
    </div>
  )
};

export const LinkedAndStatus = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const linkedPill = canvas.getByRole('link', { name: 'Engineering' });
    const stablePill = canvas.getByText('Stable').parentElement;
    const deprecatedPill = canvas.getByText('Deprecated').parentElement;

    await expect(linkedPill).toHaveAttribute('href', '/blog/tags/engineering');
    await expect(linkedPill).toHaveClass('bg-gray-100', 'text-gray-700');
    await expect(stablePill).toHaveClass('bg-green-50', 'text-green-700');
    await expect(stablePill.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    await expect(deprecatedPill).toHaveClass('border', 'border-red-200', 'text-red-700');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-2 p-6'>
      <Pill href='/blog/tags/engineering' tone='gray' variant='soft'>Engineering</Pill>
      <Pill tone='green' variant='soft' pulse>Stable</Pill>
      <Pill tone='red' variant='outline'>Deprecated</Pill>
    </div>
  )
};
