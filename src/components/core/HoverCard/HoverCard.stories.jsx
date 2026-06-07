import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { StoryStage } from '../story-helpers';

import HoverCard, { HoverCard as HoverCardRoot, HoverCardContent, HoverCardTrigger } from './HoverCard';

const componentDocs = getComponentDocs('Core/HoverCard');

export default {
  component: HoverCard,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/HoverCard'
};

export const Example = {
  render: () => (
    <StoryStage className='flex items-center justify-center' minHeight='min-h-72'>
      <HoverCard
        trigger={ <button type='button' className='text-sm font-semibold text-blue-600'>Knowledge graphs</button> }
        content='Graph-shaped context for linking concepts, entities, and sources.'
      />
    </StoryStage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Knowledge graphs' });

    expect(trigger).toHaveClass('font-semibold', 'text-blue-600');

    await userEvent.hover(trigger);

    const content = await screen.findByText('Graph-shaped context for linking concepts, entities, and sources.');
    const panel = content.closest('.w-80') || content;

    expect(content).toBeVisible();
    expect(panel).toHaveClass('w-80', 'rounded-lg', 'border', 'shadow-lg');

    await userEvent.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Graph-shaped context for linking concepts, entities, and sources.')).not.toBeInTheDocument();
    });
  }
};

export const RichContent = {
  render: () => (
    <StoryStage className='flex items-center justify-center' minHeight='min-h-72'>
      <HoverCard
        trigger={ <button type='button' className='rounded-md bg-gray-950 px-3 py-2 text-sm font-semibold text-white'>Gaudi</button> }
        content={ (
          <div className='space-y-2'>
            <p className='font-semibold text-gray-950 dark:text-white'>Gaudi Design System</p>
            <p>Core components, tokens, and docs for editorial products.</p>
          </div>
        ) }
      />
    </StoryStage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Gaudi' });

    await userEvent.hover(trigger);

    expect(await screen.findByText('Gaudi Design System')).toBeVisible();
    expect(screen.getByText('Core components, tokens, and docs for editorial products.')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Gaudi Design System')).not.toBeInTheDocument();
    });
  }
};

export const Composed = {
  render: () => (
    <StoryStage className='flex items-center justify-center' minHeight='min-h-72'>
      <HoverCardRoot>
        <HoverCardTrigger asChild>
          <a href='' className='text-sm font-semibold text-gray-950 hover:text-blue-600 dark:text-white'>Blog architecture</a>
        </HoverCardTrigger>
        <HoverCardContent sideOffset={ 12 }>
          Hover cards give supporting context without replacing links or required content.
        </HoverCardContent>
      </HoverCardRoot>
    </StoryStage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText('Blog architecture').closest('a');

    expect(trigger).toBeVisible();
    expect(trigger).toHaveAttribute('href');

    await userEvent.hover(trigger);

    const content = await screen.findByText('Hover cards give supporting context without replacing links or required content.');
    const panel = content.closest('.w-80') || content;

    expect(content).toBeVisible();
    expect(panel).toHaveClass('w-80', 'rounded-lg', 'border', 'shadow-lg');

    await userEvent.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Hover cards give supporting context without replacing links or required content.')).not.toBeInTheDocument();
    });
  }
};
