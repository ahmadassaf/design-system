import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import * as componentModule from './index';
import Video from './Video';

const componentDocs = getComponentDocs('MDX/Video');

const sharedArgs = {
  'thumbnailAlt': 'Knowledge graph article video preview',
  'thumbnailSrc': '/static/images/og-card.jpg',
  'title': 'Knowledge graph walkthrough',
  'videoSrc': 'https://www.youtube.com/embed/qh3NGpYRG3I'
};

export default {
  argTypes: {
    animationStyle: {
      control: 'select',
      options: [ 'from-center', 'from-bottom', 'from-top', 'from-left', 'from-right', 'fade', 'top-in-bottom-out', 'left-in-right-out' ]
    },
    classNames: { table: { disable: true } }
  },
  args: {
    ...sharedArgs,
    'animationStyle': 'from-center'
  },
  component: Video,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'mdx-video',
  title: 'MDX/Video'
};

export const Example = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { 'name': 'Play video' });

    await expect(trigger).toBeVisible();
    await expect(canvas.getByAltText('Knowledge graph article video preview')).toBeVisible();

    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { 'name': 'Knowledge graph walkthrough' });
    const closeButtons = within(dialog).getAllByRole('button', { 'name': 'Close video dialog' });
    const closeButton = closeButtons.at(-1);
    const iframe = within(dialog).getByTitle('Knowledge graph walkthrough');

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => expect(closeButton).toHaveFocus());
    await expect(document.body).toHaveStyle({ 'overflow': 'hidden' });
    await expect(iframe).toHaveAttribute('src', expect.stringContaining('https://www.youtube.com/embed/qh3NGpYRG3I?autoplay=1'));

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { 'name': 'Knowledge graph walkthrough' })).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
  'render': () => renderComponentExample('MDX/Video', componentModule)
};

export const AnimationStyles = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fadeExample = canvas.getByText('fade').closest('.space-y-2');
    const fadeTrigger = within(fadeExample).getByRole('button', { 'name': 'Play video' });

    await userEvent.click(fadeTrigger);

    const dialog = await screen.findByRole('dialog', { 'name': 'Video dialog: fade' });
    const panel = within(dialog).getByText('Video dialog: fade').closest('[data-open]');

    await expect(panel).toHaveClass('opacity-0', 'data-open:opacity-100');

    await userEvent.click(within(dialog).getAllByRole('button', { 'name': 'Close video dialog' }).at(-1));
    await waitFor(() => expect(screen.queryByRole('dialog', { 'name': 'Video dialog: fade' })).not.toBeInTheDocument());
  },
  'render': () => (
    <div className='grid max-w-5xl gap-5 p-6 md:grid-cols-2'>
      {[
        'from-center',
        'from-bottom',
        'top-in-bottom-out',
        'fade'
      ].map((animationStyle) => (
        <div key={ animationStyle } className='space-y-2'>
          <p className='text-sm font-semibold text-gray-700 dark:text-gray-200'>{animationStyle}</p>
          <Video { ...sharedArgs } animationStyle={ animationStyle } title={ `Video dialog: ${animationStyle}` } />
        </div>
      ))}
    </div>
  )
};
