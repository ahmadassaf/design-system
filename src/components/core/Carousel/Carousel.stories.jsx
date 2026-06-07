import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Carousel, carouselVariants } from '../../../index';

const componentDocs = getComponentDocs('Core/Carousel');

const editorialItems = [
  {
    'action': 'Read article',
    'description': 'A practical walkthrough of how graph-shaped context changes retrieval and reasoning systems.',
    'eyebrow': 'Knowledge Graphs',
    'href': '/blog',
    'id': 'knowledge-graphs',
    'title': 'An Introduction to Knowledge Graphs'
  },
  {
    'action': 'Explore notes',
    'description': 'Reusable tokens, layout elements, and accessible content components for long-form publishing.',
    'eyebrow': 'Design Systems',
    'href': '/blog',
    'id': 'design-systems',
    'title': 'Design systems keep editorial rhythm predictable'
  },
  {
    'action': 'View project',
    'description': 'A compact view into project architecture, documentation, and implementation decisions.',
    'eyebrow': 'Projects',
    'href': '/blog/projects',
    'id': 'projects',
    'title': 'Project notes for engineering work'
  }
];

const appleItems = [
  {
    'content': 'Use this variant for horizontal editorial cards where the image and title do most of the work. The expanded state gives readers more detail without navigating away.',
    'description': 'A larger card format for feature collections.',
    'eyebrow': 'Artificial Intelligence',
    'id': 'ai',
    'title': 'You can do more with AI.'
  },
  {
    'content': 'Cards keep a consistent width, snap in a horizontal rail, and expose a dialog for deeper content when selected.',
    'description': 'Dense but readable cards for grouped content.',
    'eyebrow': 'Productivity',
    'id': 'productivity',
    'title': 'Enhance your productivity.'
  },
  {
    'content': 'Use concise labels and meaningful accessible names. Decorative images can use an empty alt value.',
    'description': 'A product-style carousel card treatment.',
    'eyebrow': 'Product',
    'id': 'product',
    'title': 'Launching a focused component system.'
  }
];

export default {
  argTypes: {
    'size': {
      'control': 'select',
      'options': [ ...Object.keys(carouselVariants.variants.size) ]
    },
    'variant': {
      'control': 'select',
      'options': [ ...Object.keys(carouselVariants.variants.variant) ]
    }
  },
  component: Carousel,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Carousel'
};

export const Standard = {
  'args': {
    'ariaLabel': 'Featured articles',
    'classNames': {
      'description': '!text-white/95 drop-shadow-sm',
      'eyebrow': '!text-white/85 drop-shadow-sm',
      'title': '!text-white drop-shadow-sm'
    },
    'items': editorialItems,
    'loop': true,
    'variant': 'standard'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole('region', { 'name': 'Featured articles' });
    const nextButton = canvas.getByRole('button', { 'name': 'Next slide' });
    const previousButton = canvas.getByRole('button', { 'name': 'Previous slide' });

    await expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(previousButton).toBeEnabled();
    await expect(nextButton).toBeEnabled();
    await expect(canvas.getByText('1 of 3')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { 'level': 3, 'name': 'An Introduction to Knowledge Graphs' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { 'name': 'Read article' })).toHaveAttribute('href', '/blog');

    await userEvent.click(nextButton);

    await expect(canvas.getByText('2 of 3')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { 'level': 3, 'name': 'Design systems keep editorial rhythm predictable' })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { 'name': 'Go to slide 3' }));

    await expect(canvas.getByText('3 of 3')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { 'name': 'Go to slide 3' })).toHaveAttribute('aria-current', 'true');

    await userEvent.keyboard('{ArrowRight}');

    await expect(canvas.getByText('1 of 3')).toBeInTheDocument();
  }
};

export const AppleCards = {
  'args': {
    'ariaLabel': 'Featured cards',
    'classNames': {
      'description': '!text-white/95 drop-shadow-sm',
      'eyebrow': '!text-white/85 drop-shadow-sm',
      'title': '!text-white drop-shadow-sm'
    },
    'items': appleItems,
    'loop': true,
    'variant': 'apple'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('region', { 'name': 'Featured cards' })).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(canvas.getByRole('button', { 'name': 'Go to slide 1' })).toHaveAttribute('aria-current', 'true');

    await userEvent.click(canvas.getByRole('button', { 'name': 'Open Enhance your productivity.' }));

    const dialog = await canvas.findByRole('dialog', { 'name': 'Enhance your productivity.' });
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(canvas.getByRole('button', { 'name': 'Go to slide 2' })).toHaveAttribute('aria-current', 'true');
    await expect(within(dialog).getByText('Dense but readable cards for grouped content.')).toBeInTheDocument();
    await expect(within(dialog).getByText('Cards keep a consistent width, snap in a horizontal rail, and expose a dialog for deeper content when selected.')).toBeVisible();

    await userEvent.click(within(dialog).getAllByRole('button', { 'name': 'Close carousel card' })[1]);

    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole('button', { 'name': 'Open Launching a focused component system.' }));

    await expect(await canvas.findByRole('dialog', { 'name': 'Launching a focused component system.' })).toBeVisible();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
  }
};

export const Sizes = {
  'render': () => (
    <div className='space-y-8'>
      <Carousel ariaLabel='Small carousel' items={ editorialItems } size='sm' />
      <Carousel ariaLabel='Large carousel' items={ editorialItems } size='lg' />
    </div>
  ),
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const small = canvas.getByRole('region', { 'name': 'Small carousel' });
    const large = canvas.getByRole('region', { 'name': 'Large carousel' });

    await expect(small).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(large).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(within(small).getByRole('button', { 'name': 'Previous slide' })).toBeDisabled();
    await expect(within(large).getByRole('button', { 'name': 'Previous slide' })).toBeDisabled();

    await userEvent.click(within(small).getByRole('button', { 'name': 'Next slide' }));

    await expect(within(small).getByText('2 of 3')).toBeInTheDocument();
    await expect(within(large).getByText('1 of 3')).toBeInTheDocument();
  }
};
