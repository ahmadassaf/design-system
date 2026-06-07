import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, fn, userEvent, within } from 'storybook/test';

import MenuSearch from './MenuSearch';

const componentDocs = getComponentDocs('Navigation/MenuSearch');

export default {
  args: {
    className: 'storybook-menu-search',
    setOpen: fn()
  },
  component: MenuSearch,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ '!autodocs' ],
  title: 'Navigation/MenuSearch'
};

export const Example = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Open search' });

    await expect(button).toBeVisible();
    await expect(button).toHaveTextContent('Search');
    await expect(button.parentElement).toHaveClass('storybook-menu-search');

    await userEvent.click(button);

    await expect(args.setOpen).toHaveBeenCalledWith(true);
  },
  render: (args) => (
    <div className='max-w-sm p-6'>
      <MenuSearch { ...args } />
    </div>
  )
};
