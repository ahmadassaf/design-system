import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { Search } from '../../../index';

const componentDocs = getComponentDocs('Layout/Search');

export default {
  args: {
    setSearchValue: fn()
  },
  component: Search,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Layout/Search'
};

export const FilterArticles = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Search articles' });

    await expect(input).toHaveAttribute('placeholder', 'Filter articles');

    await userEvent.type(input, 'semantic web');

    await expect(input).toHaveValue('semantic web');
    await expect(args.setSearchValue).toHaveBeenLastCalledWith('semantic web');
  }
};

export const ControlledPreview = {
  render: () => {
    const [ searchValue, setSearchValue ] = useState('');

    return (
      <div className='max-w-md p-6'>
        <Search setSearchValue={ setSearchValue } />
        <p className='mt-4 text-sm text-gray-600 dark:text-gray-300'>
          Current filter: <span className='font-medium text-gray-900 dark:text-white'>{searchValue || 'none'}</span>
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Search articles' });

    await expect(canvas.getByText('none')).toBeInTheDocument();

    await userEvent.type(input, 'tokens');

    await expect(canvas.getByText('tokens')).toBeInTheDocument();
  }
};
