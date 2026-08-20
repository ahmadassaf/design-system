import { expect, userEvent, within } from 'storybook/test';

import RdfCollectionExplorer from './RdfCollectionExplorer';

export default {
  component: RdfCollectionExplorer,
  parameters: { layout: 'padded' },
  title: 'MDX/Interactive/RDF Collection Explorer'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole('button', { name: 'Next' });

    await userEvent.click(next);
    await expect(canvas.getByText('rdf:first → https://assaf.website/B')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'List node 2, rdf:first B' })).toHaveAttribute('aria-pressed', 'true');
  },
  render: () => <RdfCollectionExplorer />
};
