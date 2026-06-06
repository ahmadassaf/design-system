import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { renderComponentExample } from '../../../../.storybook/stories/ComponentExamples';

import * as componentModule from './index';

const componentDocs = getComponentDocs('Navigation/MenuSearch');

export default {
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
  title: 'Navigation/MenuSearch'
};

export const Example = {
  'render': () => renderComponentExample('Navigation/MenuSearch', componentModule)
};
