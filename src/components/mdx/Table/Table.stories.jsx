import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Table');

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
  id: 'mdx-table',
  title: 'MDX/Table'
};

export const Example = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table');
    const statusHeader = canvas.getByRole('columnheader', { 'name': 'Status' });
    const componentHeader = canvas.getByRole('columnheader', { 'name': 'Component' });
    const rows = canvas.getAllByRole('row');
    const scrollRegion = canvas.getByRole('region', { 'name': 'Scrollable table' });

    await expect(table).toBeVisible();
    await expect(table).toHaveClass('w-full', 'table-auto');
    await expect(scrollRegion).toHaveAttribute('tabindex', '0');
    await expect(rows).toHaveLength(3);
    await expect(componentHeader).toBeVisible();
    await expect(statusHeader).toBeVisible();
    await expect(canvas.getByRole('cell', { 'name': 'Callout' })).toBeVisible();
    await expect(canvas.getByRole('cell', { 'name': 'Accessible' })).toBeVisible();
  },
  'render': () => renderComponentExample('MDX/Table', componentModule)
};
