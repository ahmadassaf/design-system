import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import CmdLauncherShortcut from './CmdLauncherShortcut';

const componentDocs = getComponentDocs('Core/CmdLauncherShortcut');

export default {
  component: CmdLauncherShortcut,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-cmdlaunchershortcut',
  title: 'Core/CmdLauncherShortcut'
};

export const Example = {
  render: () => (
    <div className='p-6'>
      <CmdLauncherShortcut />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shortcut = canvas.getByText('Press').parentElement;
    const keys = canvasElement.querySelectorAll('kbd');

    expect(shortcut).toBeVisible();
    expect(shortcut).toHaveTextContent('Press⌘+Kto start');
    expect(keys).toHaveLength(2);
    expect(keys[0]).toHaveTextContent('⌘');
    expect(keys[1]).toHaveTextContent('K');
    expect(canvas.getByText('+')).toBeVisible();
  }
};
