import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Tooltip');

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
  id: 'mdx-tooltip',
  title: 'MDX/Tooltip'
};

export const Example = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const triggerText = canvas.getByText('Hover this editorial term');
    const tooltip = canvas.getByText('A compact explanation attached to inline text.');
    const tooltipTrigger = tooltip.parentElement;
    const icon = tooltipTrigger.querySelector('svg');

    await expect(triggerText).toBeVisible();
    await expect(tooltip).not.toBeVisible();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(tooltip).toHaveClass('pointer-events-none', 'whitespace-normal', 'text-center');

    await userEvent.hover(tooltipTrigger);
    await waitFor(() => expect(tooltip).toBeVisible());
    await expect(tooltipTrigger).toHaveAttribute('aria-describedby', tooltip.id);

    await userEvent.unhover(tooltipTrigger);
    await waitFor(() => expect(tooltip).not.toBeVisible());

    tooltipTrigger.focus();
    await waitFor(() => expect(tooltip).toBeVisible());

    tooltipTrigger.blur();
    await waitFor(() => expect(tooltip).not.toBeVisible());
  },
  'render': () => renderComponentExample('MDX/Tooltip', componentModule)
};
