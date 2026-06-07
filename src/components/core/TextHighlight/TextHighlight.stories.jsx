import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { TextHighlight } from '../../../index';

const componentDocs = getComponentDocs('Core/TextHighlight');

export default {
  argTypes: {
    'tone': {
      'control': 'select',
      'options': [ 'gray', 'neutral', 'blue', 'green', 'yellow', 'red', 'indigo' ]
    },
    'variant': {
      'control': 'select',
      'options': [ 'marker', 'soft', 'underline' ]
    }
  },
  component: TextHighlight,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/TextHighlight'
};

export const Variants = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const marker = canvas.getByText('marker emphasis');
    const soft = canvas.getByText('soft emphasis');
    const underline = canvas.getByText('underline emphasis');

    expect(marker).toHaveClass('bg-linear-to-r', 'from-green-100', 'to-green-300', 'px-1', 'pb-0.5');
    expect(soft).toHaveClass('bg-green-50', 'text-green-900', 'px-1');
    expect(underline).toHaveClass('underline', 'decoration-4', 'underline-offset-2', 'decoration-green-300', 'bg-none');
  },
  'render': () => (
    <div className='space-y-4 p-6 text-2xl font-semibold text-gray-900 dark:text-gray-100'>
      {[ 'marker', 'soft', 'underline' ].map((variant) => (
        <p key={ variant }>
          Design systems make <TextHighlight variant={ variant } tone='green'>{variant} emphasis</TextHighlight> reusable.
        </p>
      ))}
    </div>
  )
};

export const Default = {
  'render': () => (
    <p className='p-6 text-2xl font-semibold text-gray-900 dark:text-gray-100'>
      Design systems make <TextHighlight>consistency visible</TextHighlight>.
    </p>
  )
};

export const Tones = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('blue')).toHaveClass('from-blue-100', 'to-blue-300');
    expect(canvas.getByText('green')).toHaveClass('from-green-100', 'to-green-300');
    expect(canvas.getByText('yellow')).toHaveClass('from-yellow-100', 'to-yellow-300');
    expect(canvas.getByText('red')).toHaveClass('from-red-100', 'to-red-300');
    expect(canvas.getByText('indigo')).toHaveClass('from-indigo-100', 'to-indigo-300');
  },
  'render': () => (
    <div className='space-y-3 p-6 text-xl font-semibold text-gray-900 dark:text-gray-100'>
      {[ 'gray', 'neutral', 'blue', 'green', 'yellow', 'red', 'indigo' ].map((tone) => (
        <p key={ tone }>
          <TextHighlight tone={ tone } animate={ false }>{tone}</TextHighlight> highlight tone
        </p>
      ))}
    </div>
  )
};

export const Static = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const highlight = canvas.getByText('visual regression tests stable');

    expect(highlight).toHaveClass('bg-linear-to-r', 'from-indigo-100', 'to-indigo-300');
    expect(highlight).not.toHaveAttribute('style');
  },
  'render': () => (
    <p className='p-6 text-2xl font-semibold text-gray-900 dark:text-gray-100'>
      Static rendering keeps <TextHighlight animate={ false } tone='indigo'>visual regression tests stable</TextHighlight>.
    </p>
  )
};
