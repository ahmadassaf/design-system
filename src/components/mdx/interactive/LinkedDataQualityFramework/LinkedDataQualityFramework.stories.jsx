import { createComponentDocsPage, getComponentDocs } from '../../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../../.storybook/stories/ComponentExamples';
import { expect, userEvent, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/LinkedDataQualityFramework');

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
  id: 'mdx-linkeddataqualityframework',
  title: 'MDX/LinkedDataQualityFramework'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Roomba’s Linked Data quality architecture')).toBeVisible();
    await expect(canvas.getAllByText('CKAN').length).toBeGreaterThanOrEqual(1);

    const profileValidator = canvas.getByRole('button', { name: /Profile validator/ });

    await userEvent.click(profileValidator);

    await expect(profileValidator).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getAllByText('Metadata profiler').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('Ownership').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getByText('Quality indicators scored')).toBeVisible();
  },
  'render': () => renderComponentExample('MDX/LinkedDataQualityFramework', componentModule)
};
