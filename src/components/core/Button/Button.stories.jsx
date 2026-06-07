import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, buttonVariants } from '../../../index';

const componentDocs = getComponentDocs('Core/Button');

export default {
  argTypes: {
    'size': {
      'control': 'select',
      'options': [ 'xs', 'sm', 'md', 'lg' ]
    },
    'tone': {
      'control': 'select',
      'options': [ 'gray', 'neutral', 'blue', 'green', 'yellow', 'red', 'indigo' ]
    },
    'variant': {
      'control': 'select',
      'options': [ ...Object.keys(buttonVariants.variants.variant) ]
    }
  },
  component: Button,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Button'
};

export const Primary = {
  'args': {
    'children': 'Read article',
    'onClick': fn(),
    'size': 'md',
    'tone': 'blue',
    'variant': 'solid'
  },
  'play': async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { 'name': 'Read article' });

    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveClass('bg-blue-600', 'text-white');
    await expect(button).toHaveClass('rounded-md', 'px-6', 'py-3');

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  }
};

export const Secondary = {
  'args': {
    'children': 'Browse posts',
    'size': 'md',
    'tone': 'gray',
    'variant': 'outline'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { 'name': 'Browse posts' });

    await expect(button).toBeEnabled();
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveClass('border', 'border-gray-300', 'text-gray-700');
  }
};

export const LinkButton = {
  'args': {
    'children': 'Open blog',
    'href': '/blog',
    'tone': 'blue',
    'variant': 'outline'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { 'name': 'Open blog' });

    await expect(new URL(link.href).pathname).toBe('/blog');
    await expect(link).toHaveClass('border', 'border-blue-200', 'text-blue-700');
    await expect(link).not.toHaveAttribute('target');
    await expect(link).not.toHaveAttribute('aria-disabled');
  }
};

export const AllVariants = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'solid' })).toHaveClass('bg-blue-600', 'text-white');
    await expect(canvas.getByRole('button', { name: 'soft' })).toHaveClass('bg-blue-50', 'text-blue-700');
    await expect(canvas.getByRole('button', { name: 'outline' })).toHaveClass('border', 'border-blue-200', 'text-blue-700');
    await expect(canvas.getByRole('button', { name: 'ghost' })).toHaveClass('text-blue-700');
    await expect(canvas.getByRole('button', { name: 'subtle' })).toHaveClass('p-0', 'text-blue-600');
  },
  'render': () => (
    <div className='flex max-w-4xl flex-wrap items-center gap-4 p-6'>
      {Object.keys(buttonVariants.variants.variant).map((variant) => (
        <Button key={ variant } variant={ variant } tone='blue'>
          {variant}
        </Button>
      ))}
    </div>
  )
};

export const Sizes = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Button xs' })).toHaveClass('px-3', 'py-1.5', 'text-xs');
    await expect(canvas.getByRole('button', { name: 'Button sm' })).toHaveClass('px-4', 'py-2', 'text-sm');
    await expect(canvas.getByRole('button', { name: 'Button md' })).toHaveClass('px-6', 'py-3', 'text-sm');
    await expect(canvas.getByRole('button', { name: 'Button lg' })).toHaveClass('px-8', 'py-4', 'text-base');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-3 p-6'>
      {[ 'xs', 'sm', 'md', 'lg' ].map((size) => (
        <Button key={ size } size={ size }>Button {size}</Button>
      ))}
    </div>
  )
};

export const Tones = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'gray' })).toHaveClass('bg-gray-700', 'text-white');
    await expect(canvas.getByRole('button', { name: 'neutral' })).toHaveClass('bg-neutral-700', 'text-white');
    await expect(canvas.getByRole('button', { name: 'blue' })).toHaveClass('bg-blue-600', 'text-white');
    await expect(canvas.getByRole('button', { name: 'green' })).toHaveClass('bg-green-700', 'text-white');
    await expect(canvas.getByRole('button', { name: 'yellow' })).toHaveClass('bg-yellow-500', 'text-gray-950');
    await expect(canvas.getByRole('button', { name: 'red' })).toHaveClass('bg-red-600', 'text-white');
    await expect(canvas.getByRole('button', { name: 'indigo' })).toHaveClass('bg-indigo-600', 'text-white');
  },
  'render': () => (
    <div className='flex max-w-4xl flex-wrap items-center gap-3 p-6'>
      {[ 'gray', 'neutral', 'blue', 'green', 'yellow', 'red', 'indigo' ].map((tone) => (
        <Button key={ tone } tone={ tone }>{tone}</Button>
      ))}
    </div>
  )
};

export const States = {
  'render': () => (
    <div className='flex flex-wrap items-center gap-3 p-6'>
      <Button>Default</Button>
      <Button disabled>Disabled action</Button>
      <Button href='/blog' variant='outline'>Internal link</Button>
      <Button href='https://example.com' variant='soft'>External link</Button>
    </div>
  ),
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabledButton = canvas.getByRole('button', { 'name': 'Disabled action' });
    const internalLink = canvas.getByRole('link', { 'name': 'Internal link' });
    const externalLink = canvas.getByRole('link', { 'name': 'External link' });

    await expect(disabledButton).toBeDisabled();
    await expect(disabledButton).toHaveClass('cursor-not-allowed');
    await expect(internalLink).toHaveAttribute('href', '/blog');
    await expect(internalLink).not.toHaveAttribute('target');
    await expect(externalLink).toHaveAttribute('target', '_blank');
    await expect(externalLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
  }
};
