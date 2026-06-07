import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { Grid, GridItem } from '../../../index';

const componentDocs = getComponentDocs('Core/Grid');

export default {
  argTypes: {
    'columns': {
      'control': 'select',
      'options': [ '2', '3', '4' ]
    },
    'gap': {
      'control': 'select',
      'options': [ 'sm', 'md', 'lg' ]
    }
  },
  component: Grid,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Grid'
};

export const Default = {
  'render': () => (
    <div className='p-6'>
      <Grid columns='3' gap='md'>
        <GridItem title='Tokens' description='Color, type, spacing, and shape definitions.' />
        <GridItem title='Components' description='Reusable Core elements for blog and content surfaces.' />
        <GridItem title='Storybook' description='Interactive documentation for every public export.' />
      </Grid>
    </div>
  ),
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvasElement.querySelector('.grid');
    const items = grid.children;

    expect(grid).toBeVisible();
    expect(grid).toHaveClass('mx-auto', 'grid-cols-1', 'md:grid-cols-3', 'gap-4');
    expect(items).toHaveLength(3);
    expect(canvas.getByText('Tokens')).toBeVisible();
    expect(canvas.getByText('Color, type, spacing, and shape definitions.')).toBeVisible();
    expect(canvas.getByText('Components')).toBeVisible();
    expect(canvas.getByText('Storybook')).toBeVisible();
    expect(items[0]).toHaveTextContent('TokensColor, type, spacing, and shape definitions.');
    expect(items[1]).toHaveTextContent('ComponentsReusable Core elements for blog and content surfaces.');
    expect(items[2]).toHaveTextContent('StorybookInteractive documentation for every public export.');
  }
};

export const ItemVariants = {
  'render': () => (
    <div className='p-6'>
      <Grid columns='3'>
        {[ 'elevated', 'outline', 'soft' ].map((variant) => (
          <GridItem key={ variant } variant={ variant } title={ variant } description='Grid item visual style.' />
        ))}
      </Grid>
    </div>
  ),
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const elevatedItem = canvas.getByText('elevated').parentElement.parentElement;
    const outlineItem = canvas.getByText('outline').parentElement.parentElement;
    const softItem = canvas.getByText('soft').parentElement.parentElement;

    expect(canvas.getAllByText('Grid item visual style.')).toHaveLength(3);
    expect(elevatedItem).toHaveClass('border-gray-200', 'bg-white', 'shadow-sm');
    expect(outlineItem).toHaveClass('border-gray-200', 'bg-white');
    expect(outlineItem).not.toHaveClass('shadow-sm');
    expect(softItem).toHaveClass('border-gray-100', 'bg-gray-50');
  }
};
