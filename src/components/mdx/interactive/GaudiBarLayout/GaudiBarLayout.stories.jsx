import { createComponentDocsPage, getComponentDocs } from '../../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/GaudiBarLayout');
const GaudiBarLayout = componentModule.default;

export default {
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'mdx-gaudibarlayout',
  title: 'MDX/GaudiBarLayout'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const topBar = canvas.getByRole('region', { name: 'top primary bar' });
    const desktop = topBar.parentElement.parentElement;
    const desktopHeight = desktop.getBoundingClientRect().height;

    await expect(canvas.getByText('How gaudiBar composes the desktop')).toBeVisible();
    await expect(canvas.getByRole('button', { 'name': 'top bar, Left region. 5 widgets.' })).toHaveAttribute('aria-pressed', 'true');

    const topRight = canvas.getByRole('button', { 'name': 'top bar, Right region. 3 widgets.' });

    await userEvent.hover(topRight);
    await expect(topRight).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText('Wi-Fi')).toBeVisible();
    await expect(desktop.getBoundingClientRect().height).toBe(desktopHeight);

    const bottomMiddle = canvas.getByRole('button', { 'name': 'bottom bar, Middle region. Empty region.' });

    await expect(bottomMiddle).toBeVisible();
    await expect(bottomMiddle).toBeDisabled();

    const bottomRight = canvas.getByRole('button', { 'name': 'bottom bar, Right region. 5 widgets.' });

    await userEvent.hover(bottomRight);
    await expect(bottomRight).toHaveAttribute('aria-pressed', 'true');
    await expect(desktop.getBoundingClientRect().height).toBe(desktopHeight);
    await expect(canvas.getByText('CPU')).toBeVisible();
    await expect(canvas.getByText('129GB')).toBeVisible();
    await expect(canvas.getByText('3ms')).toBeVisible();
  },
  'render': () => renderComponentExample('MDX/GaudiBarLayout', componentModule)
};

export const Narrow = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const diagram = canvas.getByRole('group', { name: 'gaudiBar layout diagram' });

    await expect(diagram.scrollWidth).toBeLessThanOrEqual(diagram.clientWidth + 1);
    await expect(canvas.getByRole('button', { 'name': 'bottom bar, Middle region. Empty region.' })).toBeDisabled();
    await expect(canvas.getByRole('button', { 'name': 'bottom bar, Right region. 5 widgets.' })).toBeVisible();
  },
  render: () => (
    <div className='w-[390px] p-4'>
      <GaudiBarLayout />
    </div>
  )
};
