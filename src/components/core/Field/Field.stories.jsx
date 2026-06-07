import { expect, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import { Field, FieldDescription, FieldError, FieldInput, FieldLabel } from './Field';

const componentDocs = getComponentDocs('Core/Field');

export default {
  component: Field,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Field'
};

export const Example = {
  render: () => (
    <div className='max-w-sm p-6'>
      <Field>
        <FieldLabel htmlFor='email'>Email</FieldLabel>
        <FieldInput id='email' type='email' placeholder='you@example.com' />
        <FieldDescription>Used for article updates only.</FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email');
    const description = canvas.getByText('Used for article updates only.');

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
    expect(description.tagName).toBe('P');
    expect(description).toBeVisible();

    await userEvent.click(canvas.getByText('Email'));
    expect(input).toHaveFocus();

    await userEvent.type(input, 'reader@example.com');
    expect(input).toHaveValue('reader@example.com');
  }
};

export const Error = {
  render: () => (
    <div className='max-w-sm p-6'>
      <Field>
        <FieldLabel htmlFor='slug'>Article slug</FieldLabel>
        <FieldInput id='slug' aria-invalid='true' defaultValue='Design Systems' />
        <FieldError>Use lowercase letters and hyphens only.</FieldError>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Article slug');
    const error = canvas.getByText('Use lowercase letters and hyphens only.');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveValue('Design Systems');
    expect(error.tagName).toBe('P');
    expect(error).toBeVisible();
    expect(error).toHaveClass('font-medium', 'text-red-600');
  }
};

export const Disabled = {
  render: () => (
    <div className='max-w-sm p-6'>
      <Field>
        <FieldLabel htmlFor='readonly-email'>Email</FieldLabel>
        <FieldInput id='readonly-email' type='email' value='editor@example.com' disabled readOnly />
        <FieldDescription>This value is managed by account settings.</FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Email');

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveValue('editor@example.com');

    await userEvent.click(canvas.getByText('Email'));
    expect(input).not.toHaveFocus();
    await userEvent.type(input, 'changed@example.com');
    expect(input).toHaveValue('editor@example.com');
  }
};
