import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';
import Banner from './Banner';

const componentDocs = getComponentDocs('Core/Banner');
const toneOptions = [ 'gray', 'neutral', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'indigo' ];

export default {
  component: Banner,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-banner',
  title: 'Core/Banner'
};

export const Default = {
  'args': {
    'children': 'New essays and project notes are available.',
    title: 'Now published'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banner = canvas.getByRole('status');

    await expect(banner).toBeVisible();
    await expect(within(banner).getByText('Now published')).toBeVisible();
    await expect(within(banner).getByText('New essays and project notes are available.')).toBeVisible();
    await expect(banner).toHaveClass('bg-gray-50', 'text-gray-900');
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  }
};

export const Linked = {
  'args': {
    'children': 'Read the latest articles.',
    'href': '/blog',
    'title': 'Updated'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Updated: Read the latest articles.' });

    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/blog');
    await expect(link).toHaveAccessibleName('Updated: Read the latest articles.');
    await expect(link).toHaveTextContent('Updated');
    await expect(link).toHaveTextContent('Read the latest articles.');
    await expect(link).toHaveTextContent('→');
  }
};

export const Variants = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banners = canvas.getAllByRole('status');

    await expect(banners).toHaveLength(3);
    await expect(banners[0]).toHaveClass('bg-blue-600', 'text-white');
    await expect(banners[1]).toHaveClass('bg-blue-50', 'text-blue-900');
    await expect(banners[2]).toHaveClass('border', 'border-blue-200', 'text-blue-900');
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  },
  'render': () => (
    <div className='space-y-3 p-6'>
      {[ 'solid', 'soft', 'outline' ].map((variant) => (
        <Banner key={ variant } title={ variant } tone='blue' variant={ variant }>
          New design system release available.
        </Banner>
      ))}
    </div>
  )
};

export const Tones = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banners = canvas.getAllByRole('status');

    await expect(banners).toHaveLength(10);
    await expect(banners[0]).toHaveClass('bg-gray-50', 'text-gray-900');
    await expect(banners[1]).toHaveClass('bg-neutral-50', 'text-neutral-900');
    await expect(banners[2]).toHaveClass('bg-blue-50', 'text-blue-900');
    await expect(banners[3]).toHaveClass('bg-teal-50', 'text-teal-900');
    await expect(banners[4]).toHaveClass('bg-green-50', 'text-green-900');
    await expect(banners[5]).toHaveClass('bg-amber-50', 'text-amber-950');
    await expect(banners[6]).toHaveClass('bg-yellow-50', 'text-yellow-950');
    await expect(banners[7]).toHaveClass('bg-red-50', 'text-red-900');
    await expect(banners[8]).toHaveClass('bg-rose-50', 'text-rose-900');
    await expect(banners[9]).toHaveClass('bg-indigo-50', 'text-indigo-900');
  },
  'render': () => (
    <div className='space-y-3 p-6'>
      {toneOptions.map((tone) => (
        <Banner key={ tone } title={ tone } tone={ tone } variant='soft'>
          Concise announcement text.
        </Banner>
      ))}
    </div>
  )
};
