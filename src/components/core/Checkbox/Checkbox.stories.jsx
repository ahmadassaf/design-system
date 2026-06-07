import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, fn, userEvent, within } from 'storybook/test';

import Checkbox from './Checkbox';

const componentDocs = getComponentDocs('Core/Checkbox');

export default {
  component: Checkbox,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Checkbox'
};

export const Example = {
  args: {
    defaultChecked: true,
    label: 'Accept terms',
    onCheckedChange: fn()
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept terms' });

    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    await expect(checkbox).toBeEnabled();

    await userEvent.click(checkbox);

    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(false);

    await userEvent.click(canvas.getByText('Accept terms'));

    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
  render: (args) => <div className='p-6'><Checkbox { ...args } /></div>
};

export const States = {
  render: () => (
    <div className='grid gap-4 p-6'>
      <Checkbox label='Unchecked option' />
      <Checkbox label='Checked option' defaultChecked />
      <Checkbox label='Disabled option' disabled />
      <Checkbox label='Disabled checked option' defaultChecked disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const unchecked = canvas.getByRole('checkbox', { name: 'Unchecked option' });
    const checked = canvas.getByRole('checkbox', { name: 'Checked option' });
    const disabled = canvas.getByRole('checkbox', { name: 'Disabled option' });
    const disabledChecked = canvas.getByRole('checkbox', { name: 'Disabled checked option' });

    await expect(unchecked).toHaveAttribute('aria-checked', 'false');
    await expect(checked).toHaveAttribute('aria-checked', 'true');
    await expect(disabled).toBeDisabled();
    await expect(disabledChecked).toBeDisabled();
    await expect(disabledChecked).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(disabledChecked);

    await expect(disabledChecked).toHaveAttribute('aria-checked', 'true');
  }
};
