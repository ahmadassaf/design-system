import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';
import Badge, { badgeVariants } from './Badge';

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
  id: 'core-badge',
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
    await expect(badge).toHaveClass('bg-accent');
    await expect(badge).toHaveClass('text-accent-foreground');
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
    await expect(linkedBadge).toHaveClass('bg-surface-muted');
    await expect(linkedBadge).toHaveClass('text-text-muted');
    await expect(linkedBadge).toHaveClass('uppercase');
    await expect(stableLabel).toBeVisible();
    await expect(stableBadge).toHaveClass('bg-success-subtle');
    await expect(stableBadge?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    await expect(deprecatedLabel).toBeVisible();
    await expect(deprecatedBadge).toHaveClass('border');
    await expect(deprecatedBadge).toHaveClass('border-danger-border');
    await expect(deprecatedBadge).toHaveClass('text-danger');
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

      expect(badge).toHaveClass('bg-accent-subtle', 'text-accent');
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

    await expect(solid).toHaveClass('bg-success', 'text-success-foreground');
    await expect(soft).toHaveClass('bg-success-subtle', 'text-success');
    await expect(outline).toHaveClass('border', 'border-success-border', 'text-success');
  },
  'render': () => (
    <div className='flex max-w-3xl flex-wrap gap-2 p-6'>
      {Object.keys(badgeVariants.variants.variant).map((variant) => (
        <Badge key={ variant } variant={ variant } tone='green'>{variant}</Badge>
      ))}
    </div>
  )
};
