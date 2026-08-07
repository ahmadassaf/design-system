import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import FloatingMenu from './FloatingMenu';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Navigation/FloatingMenu');
const waitForScrollEffect = () => new Promise((resolve) => window.setTimeout(resolve, 25));

export default {
  args: {
    className: 'story-floating-menu'
  },
  component: FloatingMenu,
  excludeStories: [ 'Example' ],
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ '!autodocs' ],
  title: 'Navigation/FloatingMenu'
};

export const Example = {
  'render': () => renderComponentExample('Navigation/FloatingMenu', componentModule)
};

export const ScrollAwareNavigation = {
  render: (args) => (
    <div className='min-h-[220px] p-8'>
      <FloatingMenu className={ args.className } />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const backTop = canvas.getByRole('button', { name: 'Back to top', hidden: true });
    const menu = backTop.closest('div');
    const originalScrollTo = window.scrollTo;
    const scrollTo = fn();

    await expect(canvas.getByRole('link', { name: 'Projects', hidden: true })).toHaveAttribute('href', '/blog/projects');
    await expect(menu).toHaveClass(args.className);
    await expect(menu).toHaveClass('opacity-0');
    await expect(menu).toHaveAttribute('aria-hidden', 'true');

    await waitForScrollEffect();

    Object.defineProperty(window, 'scrollY', { 'configurable': true, 'value': 200 });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => expect(menu).toHaveClass('opacity-0'));

    Object.defineProperty(window, 'scrollY', { 'configurable': true, 'value': 120 });
    window.dispatchEvent(new Event('scroll'));

    await waitForScrollEffect();

    await waitFor(() => expect(menu).toHaveClass('opacity-100'));
    await expect(menu).toHaveAttribute('aria-hidden', 'false');

    window.scrollTo = scrollTo;
    await userEvent.click(backTop);

    await expect(scrollTo).toHaveBeenCalledWith({ 'behavior': 'smooth', 'top': 0 });

    Object.defineProperty(window, 'scrollY', { 'configurable': true, 'value': 0 });
    window.dispatchEvent(new Event('scroll'));
    window.scrollTo = originalScrollTo;
  }
};
