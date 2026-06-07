import { expect, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import Switch from './Switch';

const componentDocs = getComponentDocs('Core/Switch');

export default {
  component: Switch,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Switch'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchControl = canvas.getByRole('switch', { name: 'Email notifications' });
    const checkedBackground = getComputedStyle(switchControl).backgroundColor;

    expect(switchControl).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(switchControl);
    expect(switchControl).toHaveAttribute('aria-checked', 'false');
    expect(getComputedStyle(switchControl).backgroundColor).not.toBe(checkedBackground);

    await userEvent.click(canvas.getByText('Email notifications'));
    expect(switchControl).toHaveAttribute('aria-checked', 'true');
    expect(getComputedStyle(switchControl).backgroundColor).toBe(checkedBackground);
  },
  render: () => <div className='flex items-center p-6'><Switch label='Email notifications' defaultChecked /></div>
};

export const States = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const offSwitch = canvas.getByRole('switch', { name: 'Off preference' });
    const onSwitch = canvas.getByRole('switch', { name: 'On preference' });
    const disabledSwitch = canvas.getByRole('switch', { name: 'Disabled preference' });
    const disabledEnabledSwitch = canvas.getByRole('switch', { name: 'Disabled enabled preference' });

    expect(offSwitch).toHaveAttribute('aria-checked', 'false');
    expect(onSwitch).toHaveAttribute('aria-checked', 'true');
    expect(disabledSwitch).toBeDisabled();
    expect(disabledEnabledSwitch).toBeDisabled();
    expect(disabledEnabledSwitch).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(disabledEnabledSwitch);
    expect(disabledEnabledSwitch).toHaveAttribute('aria-checked', 'true');
  },
  render: () => (
    <div className='grid gap-4 p-6'>
      <Switch label='Off preference' />
      <Switch label='On preference' defaultChecked />
      <Switch label='Disabled preference' disabled />
      <Switch label='Disabled enabled preference' defaultChecked disabled />
    </div>
  )
};

export const Sizes = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const smallSwitch = canvas.getByRole('switch', { name: 'Small switch' });
    const mediumSwitch = canvas.getByRole('switch', { name: 'Medium switch' });
    const largeSwitch = canvas.getByRole('switch', { name: 'Large switch' });

    expect(smallSwitch.getBoundingClientRect().width).toBeLessThan(mediumSwitch.getBoundingClientRect().width);
    expect(mediumSwitch.getBoundingClientRect().width).toBeLessThan(largeSwitch.getBoundingClientRect().width);
    expect(smallSwitch).toHaveAttribute('aria-checked', 'true');
    expect(mediumSwitch).toHaveAttribute('aria-checked', 'true');
    expect(largeSwitch).toHaveAttribute('aria-checked', 'true');
  },
  render: () => (
    <div className='grid gap-4 p-6'>
      <Switch label='Small switch' size='sm' defaultChecked />
      <Switch label='Medium switch' size='md' defaultChecked />
      <Switch label='Large switch' size='lg' defaultChecked />
    </div>
  )
};
