import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import { DropDown } from '../../../index';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Navigation/DropDown');

export default {
  args: {
    name: 'Topics',
    setMenuDropDownOpen: fn()
  },
  component: DropDown,
  excludeStories: [ 'Example' ],
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ '!autodocs', '!dev' ],
  title: 'Navigation/DropDown'
};

export const Example = {
  'render': () => renderComponentExample('Navigation/DropDown', componentModule)
};

const ToggleDisclosureExample = (args) => {
  const [ menuDropDownOpen, setMenuDropDownOpen ] = useState(false);
  const handleSetMenuDropDownOpen = (nextOpen) => {
    args.setMenuDropDownOpen(nextOpen);
    setMenuDropDownOpen(nextOpen);
  };

  return (
    <DropDown
      className='story-dropdown-trigger'
      name={ args.name }
      menuDropDownOpen={ menuDropDownOpen }
      setMenuDropDownOpen={ handleSetMenuDropDownOpen }
    />
  );
};

export const ToggleDisclosure = {
  render: (args) => <ToggleDisclosureExample { ...args } />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: args.name });

    await expect(trigger).toHaveAttribute('aria-controls', 'disclosure-1');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);

    await expect(args.setMenuDropDownOpen).toHaveBeenLastCalledWith(true);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveClass('story-dropdown-trigger');

    await userEvent.click(document.body);

    await expect(args.setMenuDropDownOpen).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
};
