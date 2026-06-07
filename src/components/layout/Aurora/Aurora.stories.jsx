import { expect, within } from 'storybook/test';

import Aurora from './Aurora';

export default {
  argTypes: {
    className: {
      control: 'text'
    },
    showRadialGradient: {
      control: 'boolean'
    }
  },
  component: Aurora,
  tags: [ 'autodocs' ],
  title: 'Layout/Aurora'
};

export const WithContent = {
  args: {
    className: 'px-6 text-center',
    showRadialGradient: true
  },
  render: (args) => (
    <Aurora { ...args }>
      <section aria-labelledby='aurora-heading' className='relative z-10 max-w-2xl py-24'>
        <h1 id='aurora-heading' className='text-4xl font-bold text-gray-950 dark:text-white'>
          Editorial surface
        </h1>
        <p className='mt-4 text-base text-gray-600 dark:text-gray-300'>
          Shared page backgrounds can carry visual depth while keeping content
          readable in light and dark themes.
        </p>
      </section>
    </Aurora>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { name: 'Editorial surface' });
    const auroraLayer = canvasElement.querySelector('.aurora');

    await expect(heading).toBeVisible();
    await expect(heading.closest('main')).toBeInTheDocument();
    await expect(auroraLayer).toBeInTheDocument();
    await expect(auroraLayer).toHaveClass('absolute', 'overflow-hidden');
  }
};

export const CustomSurfaceClass = {
  args: {
    className: 'min-h-[28rem] items-start justify-start p-8',
    showRadialGradient: true
  },
  render: (args) => (
    <Aurora { ...args }>
      <p className='relative z-10 text-sm font-medium text-gray-700 dark:text-gray-200'>
        Custom spacing is applied to the aurora surface.
      </p>
    </Aurora>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const copy = canvas.getByText('Custom spacing is applied to the aurora surface.');

    await expect(copy).toBeVisible();
    await expect(copy.parentElement).toHaveClass('min-h-[28rem]', 'items-start', 'justify-start');
  }
};

export const WithoutRadialGradient = {
  args: {
    className: 'min-h-[24rem] px-6',
    showRadialGradient: false
  },
  render: (args) => (
    <Aurora { ...args }>
      <h2 className='relative z-10 text-2xl font-semibold text-gray-950 dark:text-white'>
        Linear aurora wash
      </h2>
    </Aurora>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const auroraLayer = canvasElement.querySelector('.aurora');

    await expect(canvas.getByRole('heading', { name: 'Linear aurora wash' })).toBeVisible();
    await expect(auroraLayer).toHaveAttribute('data-radial-gradient', 'false');
  }
};
