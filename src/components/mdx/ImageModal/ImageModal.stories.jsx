import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/ImageModal');

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
  id: 'mdx-imagemodal',
  title: 'MDX/ImageModal'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const openButton = canvas.getByRole('button', { name: 'Open image modal' });

    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(openButton);

    const dialog = await screen.findByRole('dialog', {
      name: 'Accessible image preview with focus management.'
    });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus());
    await expect(within(dialog).getByRole('img', { name: 'Gaudi design system article preview' })).toBeVisible();
    await expect(within(dialog).getByText('Accessible image preview with focus management.')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(openButton).toHaveFocus();

    await userEvent.click(openButton);
    const reopenedDialog = await screen.findByRole('dialog', {
      name: 'Accessible image preview with focus management.'
    });

    await userEvent.click(reopenedDialog);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
  'render': () => renderComponentExample('MDX/ImageModal', componentModule)
};
