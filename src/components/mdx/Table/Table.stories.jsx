import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, waitFor, within } from 'storybook/test';

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
  title: 'MDX/Table'
};

export const Example = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table');
    const statusHeader = canvas.getByRole('columnheader', { 'name': 'Status' });
    const statusCell = canvas.getByRole('cell', { 'name': 'Accessible' });
    const componentHeader = canvas.getByRole('columnheader', { 'name': 'Component' });
    const rows = canvas.getAllByRole('row');
    const initialStatusHeaderClass = statusHeader.className;
    const initialStatusCellClass = statusCell.className;

    await expect(table).toBeVisible();
    await expect(table).toHaveClass('w-full', 'table-auto');
    await expect(rows).toHaveLength(3);
    await expect(componentHeader).toBeVisible();
    await expect(canvas.getByRole('cell', { 'name': 'Callout' })).toBeVisible();

    await userEvent.hover(statusCell);
    await waitFor(() => {
      expect(statusHeader.className).not.toBe(initialStatusHeaderClass);
      expect(statusCell.className).not.toBe(initialStatusCellClass);
    });

    await userEvent.unhover(statusCell);
    await waitFor(() => {
      expect(statusHeader.className).toBe(initialStatusHeaderClass);
      expect(statusCell.className).toBe(initialStatusCellClass);
    });
  },
  'render': () => renderComponentExample('MDX/Table', componentModule)
};
