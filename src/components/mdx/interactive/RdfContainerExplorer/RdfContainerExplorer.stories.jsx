import { expect, userEvent, within } from 'storybook/test';

import RdfContainerExplorer from './RdfContainerExplorer';

export default {
  component: RdfContainerExplorer,
  parameters: { layout: 'padded' },
  title: 'MDX/Interactive/RDF Container Explorer'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alt = canvas.getByRole('button', { name: 'Alt alternatives' });
    const add = canvas.getByRole('button', { name: 'Add member D' });

    await userEvent.click(alt);
    await userEvent.click(add);
    await expect(alt).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText('https://assaf.website/D')).toBeVisible();
    await expect(canvas.getByText(/preferred/i)).toBeVisible();
  },
  render: () => <RdfContainerExplorer />
};
