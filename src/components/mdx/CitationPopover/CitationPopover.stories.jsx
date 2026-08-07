import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Citation');

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
  id: 'mdx-citation',
  title: 'MDX/Citation'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const singleCitation = canvas.getAllByRole('link', { name: 'Reference 1' })[0];
    const groupedCitation = canvas.getByRole('link', { name: 'References 1, 2, 3' });
    const popoverRoot = canvasElement.querySelector('[data-gaudi-citation-popover-root="true"]');

    await expect(singleCitation).toHaveAttribute('data-citation-popover', 'true');
    await expect(singleCitation).toHaveAttribute('href', '#citation-HusseinYC18');

    await userEvent.hover(singleCitation);

    await waitFor(() => {
      expect(popoverRoot?.firstElementChild).toBeInTheDocument();
    });
    await expect(within(popoverRoot).getByText(/Representation learning for heterogeneous information networks/)).toBeVisible();

    await userEvent.hover(groupedCitation);

    await waitFor(() => {
      expect(within(popoverRoot).getByRole('link', { name: /2 Wang et al\. \(2019\).*Heterogeneous graph neural network literature/ })).toBeVisible();
    });

    const groupedItem = within(popoverRoot).getByRole('link', { name: /2 Wang et al\. \(2019\).*Heterogeneous graph neural network literature/ });

    await expect(groupedItem).toBeVisible();

    await userEvent.click(groupedItem);

    const wangBackLink = canvas.getByText('Wang et al. (2019).', { exact: false }).closest('li')?.querySelector('.citation-back-link');

    await expect(wangBackLink).toBeVisible();
    await expect(wangBackLink).toHaveAttribute('href', '#cite-ref-story-2');
    await expect(canvas.getByRole('link', { name: 'References 1, 2, 3' })).toHaveAttribute('data-citation-popover-bound', 'true');
  },
  'render': () => renderComponentExample('MDX/Citation', componentModule)
};
