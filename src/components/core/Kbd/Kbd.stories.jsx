import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';
import { Kbd } from '../../../index';

const componentDocs = getComponentDocs('Core/Kbd');

export default {
  argTypes: {
    'size': {
      'control': 'select',
      'options': [ 'xs', 'sm', 'md', 'lg' ]
    },
    'variant': {
      'control': 'select',
      'options': [ 'raised', 'outline', 'flat' ]
    }
  },
  component: Kbd,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Kbd'
};

export const SingleKey = {
  'args': {
    'children': 'K'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const key = canvas.getByText('K');

    await expect(key.tagName).toBe('KBD');
    await expect(key).toHaveClass('rounded-md', 'border-gray-300', 'text-xs');
    await expect(key).not.toHaveAttribute('aria-label');
  }
};

export const Shortcut = {
  'args': {
    'keys': 'command,shift,k'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shortcut = canvas.getByRole('img', { 'name': 'Command plus Shift plus K' });
    const commandKey = canvas.getByText('⌘');
    const shiftKey = canvas.getByText('⇧');
    const letterKey = canvas.getByText('K');

    await expect(shortcut).toBeVisible();
    await expect(commandKey.tagName).toBe('KBD');
    await expect(commandKey).toHaveAttribute('aria-hidden', 'true');
    await expect(shiftKey).toHaveAttribute('aria-hidden', 'true');
    await expect(letterKey).toHaveAttribute('aria-hidden', 'true');
  }
};

export const KeySet = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('img', { 'name': 'Command plus K' })).toBeVisible();
    await expect(canvas.getByLabelText('Escape')).toHaveTextContent('esc');
    await expect(canvas.getByLabelText('Enter')).toHaveTextContent('↵');
    await expect(canvas.getByRole('img', { 'name': 'Shift plus Tab' })).toBeVisible();
    await expect(canvas.getByLabelText('Option')).toHaveTextContent('⌥');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-3 p-6'>
      {[ 'command,k', 'escape', 'enter', 'shift,tab', 'option' ].map((keys) => (
        <Kbd key={ keys } keys={ keys } />
      ))}
    </div>
  )
};

export const Variants = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shortcuts = canvas.getAllByRole('img', { 'name': 'Command plus K' });
    const [ raised, outline, flat ] = shortcuts.map((shortcut) => within(shortcut).getByText('⌘'));

    await expect(shortcuts).toHaveLength(3);
    await expect(raised).toHaveClass('bg-gradient-to-t', 'shadow-[0_2px_0_0_rgba(0,0,0,0.08)]');
    await expect(outline).toHaveClass('bg-transparent', 'shadow-none');
    await expect(flat).toHaveClass('bg-gray-50', 'shadow-none');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-3 p-6'>
      {[ 'raised', 'outline', 'flat' ].map((variant) => (
        <Kbd key={ variant } keys='command,k' variant={ variant } />
      ))}
    </div>
  )
};

export const Sizes = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shortcuts = canvas.getAllByRole('img', { 'name': 'Command plus K' });
    const [ xs, sm, md, lg ] = shortcuts.map((shortcut) => within(shortcut).getByText('K'));

    await expect(shortcuts).toHaveLength(4);
    await expect(xs).toHaveClass('text-[10px]', 'px-1');
    await expect(sm).toHaveClass('text-[11px]', 'px-1.5');
    await expect(md).toHaveClass('text-xs', 'px-2');
    await expect(lg).toHaveClass('text-sm', 'px-2.5');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-3 p-6'>
      {[ 'xs', 'sm', 'md', 'lg' ].map((size) => (
        <Kbd key={ size } keys='command,k' size={ size } />
      ))}
    </div>
  )
};
