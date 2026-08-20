import { expect, userEvent, within } from 'storybook/test';

import RdfBlankNodeExplorer from './RdfBlankNodeExplorer';

export default {
  component: RdfBlankNodeExplorer,
  parameters: { layout: 'padded' },
  title: 'MDX/Interactive/RDF Blank Node Explorer'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const branch = canvas.getByRole('button', { name: 'Trace the blank node for Blog B' });

    await userEvent.click(branch);
    await expect(branch).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText('Groups “Blog B” and https://blogb.com')).toBeVisible();
  },
  render: () => <RdfBlankNodeExplorer />
};
