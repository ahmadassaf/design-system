import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { Terminal, terminalVariants } from '../../../index';

const componentDocs = getComponentDocs('Core/Terminal');

const installCommands = [
  {
    'command': 'pnpm add github:ahmadassaf/design-system',
    'output': [{ 'text': 'Packages resolved, downloaded, and linked.', 'tone': 'success' }]
  },
  {
    'command': 'pnpm test:ds-contracts',
    'output': [
      { 'text': '85 component contracts passed.', 'tone': 'success' },
      { 'text': 'Public Core exports verified.', 'tone': 'muted' }
    ]
  }
];

const blogCommands = [
  {
    'command': 'pnpm content',
    'output': [{ 'text': 'Contentlayer generated posts, projects, and thoughts.', 'tone': 'success' }]
  },
  {
    'command': 'pnpm build:no-github',
    'output': [{ 'text': 'Next.js build completed without GitHub API calls.', 'tone': 'success' }]
  }
];

export default {
  argTypes: {
    'ariaLabel': {
      'table': {
        'disable': true
      }
    },
    'className': {
      'table': {
        'disable': true
      }
    },
    'classNames': {
      'table': {
        'disable': true
      }
    },
    'commands': {
      'control': false,
      'table': {
        'disable': true
      }
    },
    'delayBetweenCommands': {
      'table': {
        'disable': true
      }
    },
    'initialDelay': {
      'table': {
        'disable': true
      }
    },
    'outputs': {
      'control': false,
      'table': {
        'disable': true
      }
    },
    'promptSymbol': {
      'table': {
        'disable': true
      }
    },
    'radius': {
      'control': 'select',
      'options': [ ...Object.keys(terminalVariants.variants.radius) ]
    },
    'showHeader': {
      'control': 'boolean'
    },
    'size': {
      'control': 'select',
      'options': [ ...Object.keys(terminalVariants.variants.size) ]
    },
    'typingSpeed': {
      'table': {
        'disable': true
      }
    },
    'variant': {
      'control': 'select',
      'options': [ ...Object.keys(terminalVariants.variants.variant) ]
    }
  },
  component: Terminal,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Terminal'
};

export const Default = {
  'args': {
    'ariaLabel': 'Design system terminal example',
    'commands': installCommands,
    'title': 'design-system — bash',
    'username': 'blog'
  }
};

export const Static = {
  'args': {
    'animate': false,
    'ariaLabel': 'Static terminal output',
    'commands': blogCommands,
    'title': 'blog — zsh',
    'username': 'ahmad'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const terminal = canvas.getByRole('region', { 'name': 'Static terminal output' });
    const body = terminal.querySelector('pre');

    expect(canvas.getByText('blog — zsh')).toBeInTheDocument();
    expect(body).toHaveTextContent('ahmad$pnpm content');
    expect(body).toHaveTextContent('Contentlayer generated posts, projects, and thoughts.');
    expect(body).toHaveTextContent('Next.js build completed without GitHub API calls.');
    expect(canvas.getByText('Contentlayer generated posts, projects, and thoughts.').parentElement).toHaveClass('text-green-300');
  }
};

export const Variants = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const darkTerminal = canvas.getByText('dark').closest('section');
    const translucentTerminal = canvas.getByText('translucent').closest('section');
    const lightTerminal = canvas.getByText('light').closest('section');

    expect(darkTerminal).toHaveClass('bg-gray-950', 'text-gray-100');
    expect(translucentTerminal).toHaveClass('bg-gray-950/90', 'backdrop-blur');
    expect(lightTerminal).toHaveClass('bg-white', 'text-gray-950');
    expect(within(lightTerminal).getByText('Packages resolved, downloaded, and linked.').parentElement).toHaveClass('text-green-700');
  },
  'render': () => (
    <div className='grid max-w-5xl gap-6 p-6 lg:grid-cols-2'>
      <Terminal animate={ false } commands={ installCommands } title='dark' variant='dark' />
      <Terminal animate={ false } commands={ installCommands } title='translucent' variant='translucent' />
      <Terminal animate={ false } commands={ installCommands } title='light' variant='light' />
    </div>
  )
};
