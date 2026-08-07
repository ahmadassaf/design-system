import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';
import Avatar from './Avatar';

const componentDocs = getComponentDocs('Core/Avatar');
const toneOptions = [ 'gray', 'neutral', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'indigo' ];

export default {
  argTypes: {
    'shape': {
      'control': 'select',
      'options': [ 'square', 'circle' ]
    },
    'size': {
      'control': 'select',
      'options': [ 'xs', 'sm', 'md', 'lg' ]
    },
    'tone': {
      'control': 'select',
      'options': toneOptions
    }
  },
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-avatar',
  title: 'Core/Avatar'
};

export const Initials = {
  'args': {
    'label': 'AA',
    'shape': 'circle',
    'size': 'lg',
    'tone': 'blue'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('img', { name: 'AA avatar' });

    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveClass('rounded-full');
    await expect(avatar).toHaveClass('size-14');
    await expect(avatar).toHaveClass('bg-blue-600');
    await expect(within(avatar).getByText('AA')).toHaveAttribute('aria-hidden', 'true');
    await expect(avatar).toHaveAccessibleName('AA avatar');
  }
};

export const Sizes = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatars = canvas.getAllByRole('img', { name: 'AA avatar' });

    await expect(avatars).toHaveLength(4);
    await expect(avatars[0]).toHaveClass('size-5', 'text-xs');
    await expect(avatars[1]).toHaveClass('size-8', 'text-xs');
    await expect(avatars[2]).toHaveClass('size-10', 'text-sm');
    await expect(avatars[3]).toHaveClass('size-14', 'text-base');
    await expect(avatars.every((avatar) => avatar.classList.contains('rounded-full'))).toBe(true);
  },
  'render': () => (
    <div className='flex items-center gap-4 p-6'>
      {[ 'xs', 'sm', 'md', 'lg' ].map((size) => (
        <Avatar key={ size } label='AA' tone='blue' shape='circle' size={ size } />
      ))}
    </div>
  )
};

export const Colors = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatars = canvas.getAllByRole('img', { name: 'AA avatar' });

    await expect(avatars).toHaveLength(10);
    await expect(avatars[0]).toHaveClass('bg-gray-600');
    await expect(avatars[1]).toHaveClass('bg-neutral-600');
    await expect(avatars[2]).toHaveClass('bg-blue-600');
    await expect(avatars[3]).toHaveClass('bg-teal-700');
    await expect(avatars[4]).toHaveClass('bg-green-700');
    await expect(avatars[5]).toHaveClass('bg-amber-700');
    await expect(avatars[6]).toHaveClass('bg-yellow-500', 'text-yellow-950');
    await expect(avatars[7]).toHaveClass('bg-red-600');
    await expect(avatars[8]).toHaveClass('bg-rose-700');
    await expect(avatars[9]).toHaveClass('bg-indigo-600');
  },
  'render': () => (
    <div className='flex items-center gap-4 p-6'>
      {toneOptions.map((tone) => (
        <Avatar key={ tone } label='AA' tone={ tone } shape='circle' size='lg' />
      ))}
    </div>
  )
};
