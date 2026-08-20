import { expect, userEvent, within } from 'storybook/test';

import RdfTripleExplorer from './RdfTripleExplorer';

export default {
  component: RdfTripleExplorer,
  parameters: { layout: 'padded' },
  title: 'MDX/Interactive/RDF Triple Explorer'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const object = canvas.getByRole('button', { name: 'Inspect object: assaf.website/blog' });

    await userEvent.click(object);
    await expect(object).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText('The resource reached by following the relationship.')).toBeVisible();
  },
  render: () => <RdfTripleExplorer />
};
