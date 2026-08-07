import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import Spinner from './Spinner';

const componentDocs = getComponentDocs('Core/Spinner');

export default {
  component: Spinner,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-spinner',
  title: 'Core/Spinner'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loadingSpinners = canvas.getAllByRole('status', { name: 'Loading' });
    const spinnerSizes = loadingSpinners.map((spinner) => spinner.getBoundingClientRect().width);

    await expect(loadingSpinners).toHaveLength(4);
    loadingSpinners.forEach((spinner) => {
      expect(spinner).toHaveAccessibleName('Loading');
      expect(getComputedStyle(spinner).animationName).not.toBe('none');
      expect(getComputedStyle(spinner).borderRightColor).toBe('rgba(0, 0, 0, 0)');
    });
    expect(spinnerSizes[0]).toBeLessThan(spinnerSizes[1]);
    expect(spinnerSizes[1]).toBeLessThan(spinnerSizes[2]);
    expect(spinnerSizes[2]).toBeLessThan(spinnerSizes[3]);
  },
  render: () => <div className='flex items-center gap-4 p-6'><Spinner size='xs' /><Spinner size='sm' /><Spinner /><Spinner size='lg' /></div>
};

export const WithLabels = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loadingPosts = canvas.getByRole('status', { name: 'Loading posts' });
    const savingPreferences = canvas.getByRole('status', { name: 'Saving preferences' });

    expect(loadingPosts.getBoundingClientRect().width).toBeLessThan(savingPreferences.getBoundingClientRect().width);
    await expect(loadingPosts).toHaveAccessibleName('Loading posts');
    await expect(savingPreferences).toHaveAccessibleName('Saving preferences');
    await expect(canvas.getByText('Loading posts')).toBeVisible();
    await expect(canvas.getByText('Saving preferences')).toBeVisible();
  },
  render: () => (
    <div className='flex flex-wrap items-center gap-6 p-6'>
      <span className='inline-flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
        <Spinner label='Loading posts' size='sm' />
        Loading posts
      </span>
      <span className='inline-flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300'>
        <Spinner label='Saving preferences' />
        Saving preferences
      </span>
    </div>
  )
};
