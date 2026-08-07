import { useRef, useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import Button from '../Button';
import DialogPortal from './DialogPortal';

const componentDocs = getComponentDocs('Core/DialogPortal');

const Demo = () => {
  const [ open, setOpen ] = useState(false);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  const handleDialogKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = Array.from(dialogRef.current?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') || []);
    const first = focusable[0];
    const last = focusable.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div>
      <Button onClick={ () => setOpen(true) }>Open dialog</Button>
      {open ? (
        <DialogPortal initialFocusRef={ closeButtonRef }>
          <div
            ref={ dialogRef }
            className='fixed inset-0 z-[var(--ds-z-overlay)] grid place-items-center bg-gray-950/70 p-4'
            role='dialog'
            aria-modal='true'
            aria-labelledby='dialog-portal-title'
            onKeyDown={ handleDialogKeyDown }
          >
            <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-950'>
              <h2 id='dialog-portal-title' className='text-xl font-bold text-gray-950 dark:text-gray-100'>Isolated dialog</h2>
              <p className='mt-2 text-gray-700 dark:text-gray-300'>The page behind this dialog is inert while it is open.</p>
              <div className='mt-6 flex flex-wrap justify-end gap-3'>
                <Button variant='outline' onClick={ () => setOpen(false) }>Cancel</Button>
                <Button ref={ closeButtonRef } onClick={ () => setOpen(false) }>Close dialog</Button>
              </div>
            </div>
          </div>
        </DialogPortal>
      ) : null}
    </div>
  );
};

export default {
  component: DialogPortal,
  id: 'core-dialogportal',
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/DialogPortal'
};

export const Default = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open dialog' });

    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Isolated dialog' });
    const closeButton = within(dialog).getByRole('button', { name: 'Close dialog' });

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => expect(closeButton).toHaveFocus());
    await expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await userEvent.tab();
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(closeButton).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Isolated dialog' })).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
};
