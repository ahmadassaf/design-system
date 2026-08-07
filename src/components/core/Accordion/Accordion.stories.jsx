import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Accordion,
  AccordionContent,
  AccordionGroup,
  AccordionItem,
  AccordionTrigger } from './Accordion';

const componentDocs = getComponentDocs('Core/Accordion');

export default {
  component: AccordionGroup,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-accordion',
  title: 'Core/Accordion'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const usageTrigger = canvas.getByRole('button', { name: 'When should I use accordion?' });
    const accessibilityTrigger = canvas.getByRole('button', { name: 'Is it accessible?' });

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Use it for content that benefits from progressive disclosure.')).toBeVisible();
    await expect(accessibilityTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('The trigger is a native button and exposes expanded state.')).not.toBeInTheDocument();

    await userEvent.click(accessibilityTrigger);

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Use it for content that benefits from progressive disclosure.')).not.toBeInTheDocument();
    await expect(accessibilityTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('The trigger is a native button and exposes expanded state.')).toBeVisible();
  },
  render: () => (
    <div className='max-w-xl p-6'>
      <AccordionGroup items={ [
        { content: 'Use it for content that benefits from progressive disclosure.', title: 'When should I use accordion?', value: 'usage' },
        { content: 'The trigger is a native button and exposes expanded state.', title: 'Is it accessible?', value: 'a11y' }
      ] } />
    </div>
  )
};

export const MultipleOpen = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const usageTrigger = canvas.getByRole('button', { name: 'Can multiple sections stay open?' });
    const accessibilityTrigger = canvas.getByRole('button', { name: 'What is the keyboard contract?' });
    const contentTrigger = canvas.getByRole('button', { name: 'How should content be written?' });

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(accessibilityTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(contentTrigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(contentTrigger);

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(accessibilityTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(contentTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Keep titles short and put long explanations inside the panel content.')).toBeVisible();
  },
  render: () => (
    <div className='max-w-xl p-6'>
      <AccordionGroup
        type='multiple'
        defaultValue={ [ 'usage', 'a11y' ] }
        items={ [
          { content: 'Use it when readers may need more than one answer open while comparing information.', title: 'Can multiple sections stay open?', value: 'usage' },
          { content: 'Triggers are buttons and expose aria-expanded to assistive technology.', title: 'What is the keyboard contract?', value: 'a11y' },
          { content: 'Keep titles short and put long explanations inside the panel content.', title: 'How should content be written?', value: 'content' }
        ] }
      />
    </div>
  )
};

export const Composed = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tokensTrigger = canvas.getByRole('button', { name: 'Tokens' });
    const componentsTrigger = canvas.getByRole('button', { name: 'Components' });

    await expect(tokensTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Color, type, spacing, radius, and motion values.')).toBeVisible();
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(componentsTrigger);

    await expect(tokensTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Color, type, spacing, radius, and motion values.')).not.toBeInTheDocument();
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Core components use tokens and expose documented customization props.')).toBeVisible();
  },
  render: () => (
    <div className='max-w-xl p-6'>
      <Accordion defaultValue='tokens'>
        {({ currentValue, setValue }) => (
          <>
            {[
              { content: 'Color, type, spacing, radius, and motion values.', title: 'Tokens', value: 'tokens' },
              { content: 'Core components use tokens and expose documented customization props.', title: 'Components', value: 'components' }
            ].map((item) => {
              const isOpen = currentValue === item.value;

              return (
                <AccordionItem key={ item.value } value={ item.value }>
                  <AccordionTrigger isOpen={ isOpen } onClick={ () => setValue(isOpen ? undefined : item.value) }>
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent isOpen={ isOpen }>{item.content}</AccordionContent>
                </AccordionItem>
              );
            })}
          </>
        )}
      </Accordion>
    </div>
  )
};

export const Controlled = {
  args: {
    onValueChange: fn()
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const tokensTrigger = canvas.getByRole('button', { name: 'Tokens' });
    const componentsTrigger = canvas.getByRole('button', { name: 'Components' });

    await expect(tokensTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(componentsTrigger);

    await expect(args.onValueChange).toHaveBeenLastCalledWith('components');
    await expect(tokensTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Core components use tokens and expose documented customization props.')).toBeVisible();

    await userEvent.click(componentsTrigger);

    await expect(args.onValueChange).toHaveBeenLastCalledWith(undefined);
    await expect(componentsTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Core components use tokens and expose documented customization props.')).not.toBeInTheDocument();
  },
  render: ({ onValueChange }) => {
    const ControlledAccordion = () => {
      const [ value, setValue ] = useState('tokens');

      return (
        <Accordion
          value={ value }
          onValueChange={ (nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          } }
        >
          {({ currentValue, setValue: setAccordionValue }) => (
            <>
              {[
                { content: 'Color, type, spacing, radius, and motion values.', title: 'Tokens', value: 'tokens' },
                { content: 'Core components use tokens and expose documented customization props.', title: 'Components', value: 'components' }
              ].map((item) => {
                const isOpen = currentValue === item.value;

                return (
                  <AccordionItem key={ item.value } value={ item.value }>
                    <AccordionTrigger isOpen={ isOpen } onClick={ () => setAccordionValue(isOpen ? undefined : item.value) }>
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent isOpen={ isOpen }>{item.content}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </>
          )}
        </Accordion>
      );
    };

    return (
      <div className='max-w-xl p-6'>
        <ControlledAccordion />
      </div>
    );
  }
};
