import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, fn, userEvent, within } from 'storybook/test';
import Button, { buttonTones, buttonVariants } from './Button';

const componentDocs = getComponentDocs('Core/Button');
const toneOptions = [ ...buttonTones ];

export default {
  argTypes: {
    'children': {
      'control': 'text',
      'description': 'Visible button label or content.'
    },
    'disabled': {
      'control': 'boolean',
      'description': 'Disables native buttons and removes disabled links from the tab order.',
      'table': { 'defaultValue': { 'summary': false }, 'type': { 'summary': 'boolean' } }
    },
    'radius': {
      'control': 'select',
      'description': 'Controls the button corner radius.',
      'options': [ 'sm', 'md', 'lg', 'full' ],
      'table': { 'defaultValue': { 'summary': 'md' } }
    },
    'size': {
      'control': 'select',
      'description': 'Controls button spacing and text size.',
      'options': [ 'xs', 'sm', 'md', 'lg' ],
      'table': { 'defaultValue': { 'summary': 'md' } }
    },
    'tone': {
      'control': 'select',
      'description': 'Maps the action to an approved semantic color family.',
      'options': toneOptions,
      'table': { 'defaultValue': { 'summary': 'accent' } }
    },
    'variant': {
      'control': 'select',
      'description': 'Sets the action hierarchy and visual treatment.',
      'options': [ ...Object.keys(buttonVariants.variants.variant) ],
      'table': { 'defaultValue': { 'summary': 'solid' } }
    }
  },
  args: {
    children: 'Button',
    disabled: false,
    radius: 'md',
    size: 'md',
    tone: 'accent',
    variant: 'solid'
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
  id: 'core-button',
  title: 'Core/Button'
};

export const Primary = {
  'args': {
    'children': 'Read article',
    'onClick': fn(),
    'size': 'md',
    'tone': 'accent',
    'variant': 'solid'
  },
  'play': async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { 'name': args.children });
    const expectedClasses = buttonVariants({
      radius: args.radius,
      size: args.size,
      tone: args.tone,
      variant: args.variant
    }).split(' ');

    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveClass(...expectedClasses);

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  }
};

export const Secondary = {
  'args': {
    'children': 'Browse posts',
    'size': 'md',
    'tone': 'neutral',
    'variant': 'outline'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { 'name': 'Browse posts' });

    await expect(button).toBeEnabled();
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveClass('border', 'border-border', 'text-foreground');
  }
};

export const LinkButton = {
  'args': {
    'children': 'Open blog',
    'href': '/blog',
    'tone': 'accent',
    'variant': 'outline'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { 'name': 'Open blog' });

    await expect(new URL(link.href).pathname).toBe('/blog');
    await expect(link).toHaveClass('border', 'border-accent-muted', 'text-accent');
    await expect(link).not.toHaveAttribute('target');
    await expect(link).not.toHaveAttribute('aria-disabled');
  }
};

export const AllVariants = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'solid' })).toHaveClass('bg-accent', 'text-accent-foreground');
    await expect(canvas.getByRole('button', { name: 'soft' })).toHaveClass('bg-accent-subtle', 'text-accent');
    await expect(canvas.getByRole('button', { name: 'outline' })).toHaveClass('border', 'border-accent-muted', 'text-accent');
    await expect(canvas.getByRole('button', { name: 'ghost' })).toHaveClass('text-accent');
    await expect(canvas.getByRole('button', { name: 'subtle' })).toHaveClass('min-h-11', 'p-0', 'text-accent');
  },
  'render': () => (
    <div className='flex max-w-4xl flex-wrap items-center gap-4 p-6'>
      {Object.keys(buttonVariants.variants.variant).map((variant) => (
        <Button key={ variant } variant={ variant } tone='accent'>
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

    await expect(canvas.getByRole('button', { name: 'neutral' })).toHaveClass('bg-foreground', 'text-text-inverse');
    await expect(canvas.getByRole('button', { name: 'accent' })).toHaveClass('bg-accent', 'text-accent-foreground');
    await expect(canvas.getByRole('button', { name: 'attention' })).toHaveClass('bg-attention', 'text-attention-foreground');
    await expect(canvas.getByRole('button', { name: 'danger' })).toHaveClass('bg-danger', 'text-danger-foreground');
    await expect(canvas.getByRole('button', { name: 'discovery' })).toHaveClass('bg-discovery', 'text-discovery-foreground');
    await expect(canvas.getByRole('button', { name: 'info' })).toHaveClass('bg-info', 'text-info-foreground');
    await expect(canvas.getByRole('button', { name: 'success' })).toHaveClass('bg-success', 'text-success-foreground');
    await expect(canvas.getByRole('button', { name: 'warning' })).toHaveClass('bg-warning', 'text-warning-foreground');
  },
  'render': () => (
    <div className='flex max-w-4xl flex-wrap items-center gap-3 p-6'>
      {toneOptions.map((tone) => (
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
