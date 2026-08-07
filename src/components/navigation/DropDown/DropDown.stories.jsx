import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';
import DropDown from './DropDown';

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
  tags: [ '!autodocs' ],
  title: 'Navigation/DropDown'
};

export const Example = {
  'render': () => renderComponentExample('Navigation/DropDown', componentModule)
};

const ToggleDisclosureExample = (args) => {
  const [ menuDropDownOpen, setMenuDropDownOpen ] = useState(false);
  const controlsId = 'story-disclosure-panel';
  const triggerId = 'story-disclosure-trigger';
  const handleSetMenuDropDownOpen = (nextOpen) => {
    args.setMenuDropDownOpen(nextOpen);
    setMenuDropDownOpen(nextOpen);
  };

  return (
    <>
      <DropDown
        className='story-dropdown-trigger'
        controlsId={ controlsId }
        id={ triggerId }
        name={ args.name }
        menuDropDownOpen={ menuDropDownOpen }
        setMenuDropDownOpen={ handleSetMenuDropDownOpen }
      />
      <div id={ controlsId } aria-labelledby={ triggerId } hidden={ !menuDropDownOpen } />
    </>
  );
};

export const ToggleDisclosure = {
  render: (args) => <ToggleDisclosureExample { ...args } />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: args.name });

    const controlsId = trigger.getAttribute('aria-controls');

    await expect(controlsId).toBeTruthy();
    await expect(document.getElementById(controlsId)).toBeInTheDocument();
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
