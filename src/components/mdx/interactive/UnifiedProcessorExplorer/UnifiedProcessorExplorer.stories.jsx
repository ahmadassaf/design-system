import { expect, userEvent, within } from 'storybook/test';

import mdxStyles from '../../MdxContent/MdxContent.module.css';
import UnifiedProcessorExplorer from './UnifiedProcessorExplorer';

export default {
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ 'autodocs' ],
  id: 'mdx-unifiedprocessorexplorer',
  title: 'MDX/UnifiedProcessorExplorer'
};

const StoryFrame = ({ children, narrow = false }) => (
  <div className={ `mx-auto w-full p-6 ${narrow ? 'max-w-[390px]' : 'max-w-5xl'}` }>{children}</div>
);

export const Unified = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Unified connects Markdown and HTML through syntax trees')).toBeVisible();
    await expect(canvas.getAllByText('remark-parse').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('remark-rehype').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('rehype-stringify').length).toBeGreaterThanOrEqual(1);

    await userEvent.click(canvas.getByRole('button', { name: 'HTML → Markdown' }));
    await expect(canvas.getAllByText('rehype-parse').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('rehype-remark').length).toBeGreaterThanOrEqual(1);
    await expect(canvas.getAllByText('remark-stringify').length).toBeGreaterThanOrEqual(1);

    await userEvent.click(canvas.getByRole('button', { name: /rehype plugins/ }));
    await expect(canvas.getByText('Rehype plugins visit and transform HTML-level nodes before the tree is serialized.')).toBeVisible();
  },
  render: () => <StoryFrame><UnifiedProcessorExplorer /></StoryFrame>
};

export const Remark = {
  render: () => <StoryFrame><UnifiedProcessorExplorer view='remark' /></StoryFrame>
};

export const Rehype = {
  render: () => <StoryFrame><UnifiedProcessorExplorer view='rehype' /></StoryFrame>
};

export const Narrow = {
  render: () => <StoryFrame narrow><UnifiedProcessorExplorer /></StoryFrame>
};

export const InsideMdxRuntime = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const route = canvas.getByRole('button', { exact: true, name: 'remark-parse' });
    const routeLabel = within(route).getByText('remark-parse');

    await expect(routeLabel).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0)' });
    await expect(routeLabel).toHaveStyle({ borderTopWidth: '0px' });
  },
  render: () => (
    <div className={ mdxStyles.root }>
      <StoryFrame><UnifiedProcessorExplorer /></StoryFrame>
    </div>
  )
};
