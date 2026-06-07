import { expect, waitFor, within } from 'storybook/test';

export default {
  tags: [ 'autodocs' ],
  title: 'MDX/CitationTracker'
};

export const BackLinkTracking = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstCitation = canvas.getByRole('link', { name: 'Citation one' });
    const secondCitation = canvas.getByRole('link', { name: 'Citation two' });
    const bibliographyBackLink = canvas.getByRole('link', { name: 'Back to citation' });

    await expect(firstCitation).toHaveAttribute('data-citation-popover', 'true');
    await expect(firstCitation).toHaveAttribute('data-citation-keys', '["smith-2026"]');
    await expect(secondCitation).toHaveAttribute('data-citation-keys', '["smith-2026"]');
    await expect(canvas.getByRole('button', { name: 'Use last Smith citation' })).toHaveAttribute('data-citation-popover-item', 'multiple');
    await expect(bibliographyBackLink).toHaveAttribute('data-citation-key', 'smith-2026');
    await waitFor(() => expect(bibliographyBackLink.hash).toBe('#citation-ref-1'));
  },
  render: () => (
    <div className='space-y-4 p-6'>
      <p>
        <a id='citation-ref-1' href='#citation-smith-2026' data-citation-popover='true' data-citation-keys='["smith-2026"]'>
          Citation one
        </a>
        {' '}
        <a id='citation-ref-2' href='#citation-smith-2026' data-citation-popover='true' data-citation-keys='["smith-2026"]'>
          Citation two
        </a>
      </p>
      <button type='button' data-citation-popover-item='multiple' data-citation-key='smith-2026'>
        Use last Smith citation
      </button>
      <ol>
        <li id='citation-smith-2026'>
          Smith 2026.
          {' '}
          <a className='citation-back-link' href='#citation-ref-1' data-citation-key='smith-2026' aria-label='Back to citation'>
            Back
          </a>
        </li>
      </ol>
    </div>
  )
};
