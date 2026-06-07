import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { BlogNewsletterForm, NewsletterForm } from '../../../index';

const componentDocs = getComponentDocs('Layout/NewsletterForm');

export default {
  argTypes: {
    title: {
      control: 'text'
    }
  },
  args: {
    title: 'Subscribe to the newsletter'
  },
  component: NewsletterForm,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Layout/NewsletterForm'
};

export const Default = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText('Email address');
    const button = canvas.getByRole('button', { name: 'Sign up' });

    await expect(canvas.getByRole('heading', { name: 'Subscribe to the newsletter' })).toBeInTheDocument();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
    await expect(emailInput).toBeRequired();
    await expect(button).toHaveAttribute('type', 'submit');
  }
};

export const SuccessfulSubmission = {
  args: {
    title: 'Get monthly notes'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const originalFetch = globalThis.fetch;
    const fetchMock = fn(async () => ({
      json: async () => ({})
    }));

    globalThis.fetch = fetchMock;

    try {
      const emailInput = canvas.getByLabelText('Email address');
      const button = canvas.getByRole('button', { name: 'Sign up' });

      await userEvent.type(emailInput, 'reader@example.com');
      await userEvent.click(button);

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      await expect(fetchMock).toHaveBeenCalledWith('/api/buttondown', expect.objectContaining({
        body: JSON.stringify({ email: 'reader@example.com' }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }));
      await expect(await canvas.findByText(/now subscribed/i)).toBeInTheDocument();
      await expect(emailInput).toBeDisabled();
      await expect(canvas.getByRole('button', { name: 'Thank you!' })).toBeDisabled();
    } finally {
      globalThis.fetch = originalFetch;
    }
  }
};

export const InvalidSubmission = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const originalFetch = globalThis.fetch;
    const fetchMock = fn(async () => ({
      json: async () => ({ error: 'already_subscribed' })
    }));

    globalThis.fetch = fetchMock;

    try {
      const emailInput = canvas.getByLabelText('Email address');

      await userEvent.type(emailInput, 'reader@example.com');
      await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      await expect(await canvas.findByText(/invalid or you are already subscribed/i)).toBeInTheDocument();
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      await expect(emailInput).toBeEnabled();
    } finally {
      globalThis.fetch = originalFetch;
    }
  }
};

export const BlogVariant = {
  args: {
    title: 'Get post updates'
  },
  render: ({ title }) => <BlogNewsletterForm title={ title } />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: 'Get post updates' })).toBeInTheDocument();
    await expect(canvas.getByLabelText('Email address')).toHaveAttribute('placeholder', 'Enter your email');
    await expect(canvas.getByRole('button', { name: 'Sign up' })).toBeEnabled();
  }
};
