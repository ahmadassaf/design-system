import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';
import { Badge, badgeVariants } from '../../../index';

const componentDocs = getComponentDocs('Core/Badge');
const getBadgeRoot = (element) => element.classList.contains('inline-flex') ? element : element.parentElement;

export default {
  argTypes: {
    'size': {
      'control': 'select',
      'options': [ ...Object.keys(badgeVariants.variants.size) ]
    },
    'tone': {
      'control': 'select',
      'options': [ ...Object.keys(badgeVariants.variants.tone) ]
    },
    'variant': {
      'control': 'select',
      'options': [ ...Object.keys(badgeVariants.variants.variant) ]
    }
  },
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Badge'
};

export const Default = {
  'args': {
    'children': 'Beta',
    'tone': 'blue',
    'variant': 'solid'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Beta');
    const badge = getBadgeRoot(label);

    await expect(label).toBeVisible();
    await expect(badge).toHaveClass('bg-blue-600');
    await expect(badge).toHaveClass('text-white');
    await expect(badge).toHaveClass('uppercase');
    await expect(badge?.tagName).toBe('SPAN');
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  }
};

export const LinkedAndStatus = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const linkedBadge = canvas.getByRole('link', { name: 'Engineering' });
    const stableLabel = canvas.getByText('Stable');
    const stableBadge = getBadgeRoot(stableLabel);
    const deprecatedLabel = canvas.getByText('Deprecated');
    const deprecatedBadge = getBadgeRoot(deprecatedLabel);

    await expect(linkedBadge).toHaveAttribute('href', '/blog/tags/engineering');
    await expect(linkedBadge).toHaveTextContent('Engineering');
    await expect(linkedBadge).toHaveClass('bg-gray-100');
    await expect(linkedBadge).toHaveClass('uppercase');
    await expect(stableLabel).toBeVisible();
    await expect(stableBadge).toHaveClass('bg-green-50');
    await expect(stableBadge?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    await expect(deprecatedLabel).toBeVisible();
    await expect(deprecatedBadge).toHaveClass('border');
    await expect(deprecatedBadge).toHaveClass('text-red-700');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-2 p-6'>
      <Badge href='/blog/tags/engineering' tone='gray' variant='soft'>Engineering</Badge>
      <Badge tone='green' variant='soft' pulse>Stable</Badge>
      <Badge tone='red' variant='outline'>Deprecated</Badge>
    </div>
  )
};

export const Sizes = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const labels = Object.keys(badgeVariants.variants.size);

    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();

    labels.forEach((size) => {
      const badge = getBadgeRoot(canvas.getByText(size));

      expect(badge).toHaveClass('bg-blue-50', 'text-blue-700');
      expect(badge).toHaveTextContent(size);
    });
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-2 p-6'>
      {Object.keys(badgeVariants.variants.size).map((size) => (
        <Badge key={ size } size={ size } tone='blue' variant='soft'>{size}</Badge>
      ))}
    </div>
  )
};

export const Variants = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const solid = getBadgeRoot(canvas.getByText('solid'));
    const soft = getBadgeRoot(canvas.getByText('soft'));
    const outline = getBadgeRoot(canvas.getByText('outline'));

    await expect(solid).toHaveClass('bg-green-700', 'text-white');
    await expect(soft).toHaveClass('bg-green-50', 'text-green-700');
    await expect(outline).toHaveClass('border', 'border-green-200', 'text-green-700');
  },
  'render': () => (
    <div className='flex max-w-3xl flex-wrap gap-2 p-6'>
      {Object.keys(badgeVariants.variants.variant).map((variant) => (
        <Badge key={ variant } variant={ variant } tone='green'>{variant}</Badge>
      ))}
    </div>
  )
};
