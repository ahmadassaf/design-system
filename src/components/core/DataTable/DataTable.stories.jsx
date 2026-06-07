import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import DataTable from './DataTable';

const componentDocs = getComponentDocs('Core/DataTable');

export default {
  component: DataTable,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/DataTable'
};

export const Example = {
  render: () => (
    <div className='p-6'>
      <DataTable
        columns={ [
          { header: 'Component', key: 'component' },
          { header: 'Layer', key: 'layer' },
          { header: 'Status', key: 'status' }
        ] }
        rows={ [
          { component: 'Button', layer: 'Core', status: 'Ready' },
          { component: 'DataTable', layer: 'Core', status: 'Ready' }
        ] }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table');
    const headers = canvas.getAllByRole('columnheader');
    const rows = canvas.getAllByRole('row');

    expect(table).toBeVisible();
    expect(headers.map((header) => header.textContent)).toEqual([ 'Component', 'Layer', 'Status' ]);
    headers.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col');
    });
    expect(rows).toHaveLength(3);
    expect(canvas.getByRole('cell', { name: 'Button' })).toBeVisible();
    expect(canvas.getAllByRole('cell', { name: 'Core' })).toHaveLength(2);
    expect(canvas.getAllByRole('cell', { name: 'Ready' })).toHaveLength(2);
    expect(rows[1]).toHaveTextContent('ButtonCoreReady');
    expect(rows[2]).toHaveTextContent('DataTableCoreReady');
  }
};

export const WithCaptionAndCustomCells = {
  render: () => (
    <div className='p-6'>
      <DataTable
        caption='Core component status'
        columns={ [
          { header: 'Component', key: 'component' },
          { header: 'Owner', key: 'owner' },
          {
            header: 'Status',
            key: 'status',
            render: (row) => <span className='rounded-sm bg-green-50 px-2 py-1 text-xs font-semibold text-green-700'>{row.status}</span>
          }
        ] }
        rows={ [
          { component: 'Button', id: 'button', owner: 'Core', status: 'Ready' },
          { component: 'DataTable', id: 'data-table', owner: 'Core', status: 'Ready' }
        ] }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table', { name: 'Core component status' });
    const caption = canvas.getByText('Core component status');
    const statusBadges = canvas.getAllByText('Ready');

    expect(table).toBeVisible();
    expect(caption.tagName).toBe('CAPTION');
    expect(statusBadges).toHaveLength(2);
    statusBadges.forEach((badge) => {
      expect(badge.tagName).toBe('SPAN');
      expect(badge).toHaveClass('rounded-sm', 'bg-green-50', 'font-semibold', 'text-green-700');
    });
    expect(canvas.getByRole('cell', { name: 'Button' })).toBeVisible();
    expect(canvas.getByRole('cell', { name: 'DataTable' })).toBeVisible();
  }
};
