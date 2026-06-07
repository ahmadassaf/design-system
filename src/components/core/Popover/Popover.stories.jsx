import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { StoryStage } from '../story-helpers';

import Popover, { Popover as PopoverWrapper, PopoverContent, PopoverTrigger } from './Popover';

const componentDocs = getComponentDocs('Core/Popover');

const ComposedPopover = () => {
  const [ open, setOpen ] = useState(false);

  return (
    <StoryStage className='flex items-start' minHeight='min-h-72'>
      <PopoverWrapper>
        <PopoverTrigger onClick={ () => setOpen((value) => !value) }>Open composed popover</PopoverTrigger>
        {open ? <PopoverContent>Use the primitive slots when the trigger lives inside another layout.</PopoverContent> : null}
      </PopoverWrapper>
    </StoryStage>
  );
};

export default {
  component: Popover,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Popover'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open popover' });

    await expect(trigger).toHaveAttribute('type', 'button');
    await expect(canvas.queryByText('Compact supporting content in a positioned panel.')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    const content = canvas.getByText('Compact supporting content in a positioned panel.');

    await expect(content).toBeVisible();
    await expect(content).toHaveTextContent('Compact supporting content in a positioned panel.');

    await userEvent.click(canvasElement);
    await waitFor(() => expect(canvas.queryByText('Compact supporting content in a positioned panel.')).not.toBeInTheDocument());
  },
  render: () => <StoryStage className='flex items-start' minHeight='min-h-72'><Popover trigger='Open popover'>Compact supporting content in a positioned panel.</Popover></StoryStage>
};

export const RichContent = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Release notes' }));

    await expect(canvas.getByText('Gaudi 0.4')).toBeVisible();
    await expect(canvas.getByText('Core docs now show curated props and variant examples.')).toBeVisible();
  },
  render: () => (
    <StoryStage className='flex items-start' minHeight='min-h-72'>
      <Popover trigger='Release notes'>
        <div className='space-y-2'>
          <p className='font-semibold text-gray-950 dark:text-white'>Gaudi 0.4</p>
          <p>Core docs now show curated props and variant examples.</p>
        </div>
      </Popover>
    </StoryStage>
  )
};

export const Composed = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open composed popover' });

    await expect(canvas.queryByText('Use the primitive slots when the trigger lives inside another layout.')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    await expect(canvas.getByText('Use the primitive slots when the trigger lives inside another layout.')).toBeVisible();

    await userEvent.click(trigger);
    await expect(canvas.queryByText('Use the primitive slots when the trigger lives inside another layout.')).not.toBeInTheDocument();
  },
  render: ComposedPopover
};
