import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, screen, within } from 'storybook/test';

import * as componentModule from './index';

const componentDocs = getComponentDocs('MDX/Preview');

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
  title: 'MDX/Preview'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const externalPreview = await canvas.findByRole('link', {
      name: 'assaf.website - assaf.website'
    });
    const unavailablePreview = await canvas.findByRole('link', {
      name: 'Unavailable link (link may be unavailable)'
    });
    const internalPreview = await canvas.findByRole('link', {
      name: 'Internal blog link - Internal'
    });

    await expect(externalPreview).toHaveAttribute('href', 'https://assaf.website');
    await expect(unavailablePreview).toHaveAttribute('href', 'https://this-link-will-not-work.invalid');
    await expect(unavailablePreview).toHaveClass('text-red-700');
    await expect(internalPreview).toHaveAttribute('href', '/blog');
    await expect(internalPreview.closest('[data-preview-internal="true"]')).toBeInTheDocument();
    await expect(screen.getByText('Browse the latest posts, projects, and notes from the blog archive.')).toBeVisible();
    await expect(screen.getByText('June 5, 2026')).toBeVisible();
    await expect(screen.getByText('design systems')).toBeVisible();
  },
  'render': () => renderComponentExample('MDX/Preview', componentModule)
};

export const Loading = {
  name: 'Loading',
  parameters: {
    chromatic: { disableSnapshot: false }
  },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[aria-hidden="true"]');

    await expect(skeleton).toHaveClass('inline-flex');
    await expect(skeleton?.querySelectorAll('.animate-pulse')).toHaveLength(2);
    await expect(within(canvasElement).queryByRole('link')).not.toBeInTheDocument();
  },
  render: () => (
    <div className='p-6'>
      <componentModule.PreviewLoadingSkeleton />
    </div>
  )
};
