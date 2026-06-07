import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';
import { Icon } from '../../../index';

const componentDocs = getComponentDocs('Core/Icon');

export default {
  argTypes: {
    'color': {
      'control': 'select',
      'options': [ undefined, 'neutral', 'muted', 'primary', 'blue', 'green', 'yellow', 'red', 'danger', 'warning', 'dim' ]
    },
    'name': {
      'control': 'select',
      'options': [ 'Search', 'BookOpen', 'Github', 'Linkedin', 'Twitter', 'Mail', 'Info', 'Warning', 'CopyIcon', 'CheckIcon', 'FolderOpen', 'javascript' ]
    },
    'size': {
      'control': 'select',
      'options': [ 'xs', 'sm', 'md', 'lg', 'xl', '2xl' ]
    }
  },
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Icon'
};

export const RegistryIcon = {
  'args': {
    'decorative': true,
    'name': 'Search',
    'size': 'md'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const decorativeIcon = canvasElement.querySelector('svg');

    await expect(canvas.queryByRole('img')).toBeNull();
    await expect(decorativeIcon).toHaveAttribute('aria-hidden', 'true');
    await expect(decorativeIcon).toHaveClass('h-5', 'w-5');
  }
};

export const SocialLink = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const githubLink = canvas.getByRole('link', { 'name': 'GitHub profile' });
    const mailLink = canvas.getByRole('link', { 'name': 'Email' });

    await expect(githubLink).toHaveAttribute('href', 'https://github.com/ahmadassaf');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    await expect(mailLink).toHaveAttribute('href', 'mailto:hello@example.com');
    await expect(mailLink).not.toHaveAttribute('target');
  },
  'render': () => (
    <div className='flex items-center gap-4 p-6'>
      <Icon kind='github' href='https://github.com/ahmadassaf' />
      <Icon kind='linkedin' href='https://www.linkedin.com' />
      <Icon kind='twitter' href='https://x.com' />
      <Icon kind='youtube' href='https://youtube.com' />
      <Icon kind='mail' href='mailto:hello@example.com' />
    </div>
  )
};

export const LabeledIcon = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByRole('img', { 'name': 'More information' });

    await expect(icon).toHaveAttribute('aria-label', 'More information');
    await expect(icon).toHaveClass('h-6', 'w-6', 'text-blue-600');
    await expect(icon).not.toHaveAttribute('aria-hidden', 'true');
  },
  'render': () => (
    <div className='p-6'>
      <Icon name='Info' label='More information' color='primary' size='lg' />
    </div>
  )
};

export const Sizes = {
  'play': async ({ canvasElement }) => {
    const icons = Array.from(canvasElement.querySelectorAll('svg'));

    await expect(icons).toHaveLength(6);
    icons.forEach((icon) => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
    await expect(icons.map((icon) => icon.getAttribute('class'))).toEqual([
      expect.stringContaining('h-3 w-3'),
      expect.stringContaining('h-4 w-4'),
      expect.stringContaining('h-5 w-5'),
      expect.stringContaining('h-6 w-6'),
      expect.stringContaining('h-8 w-8'),
      expect.stringContaining('h-10 w-10')
    ]);
  },
  'render': () => (
    <div className='flex items-center gap-4 p-6'>
      {[ 'xs', 'sm', 'md', 'lg', 'xl', '2xl' ].map((size) => (
        <Icon key={ size } name='Search' decorative size={ size } />
      ))}
    </div>
  )
};

export const Colors = {
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    [
      'neutral',
      'muted',
      'primary',
      'blue',
      'green',
      'yellow',
      'red',
      'danger',
      'warning',
      'dim'
    ].forEach((color) => {
      expect(canvas.getByRole('img', { 'name': `${color} information icon` })).toBeVisible();
    });
    expect(canvas.getByRole('img', { 'name': 'danger information icon' })).toHaveClass('text-red-600');
    expect(canvas.getByRole('img', { 'name': 'warning information icon' })).toHaveClass('text-yellow-700');
  },
  'render': () => (
    <div className='flex flex-wrap items-center gap-4 p-6'>
      {[ 'neutral', 'muted', 'primary', 'blue', 'green', 'yellow', 'red', 'danger', 'warning', 'dim' ].map((color) => (
        <Icon key={ color } name='Info' label={ `${color} information icon` } color={ color } size='lg' />
      ))}
    </div>
  )
};

export const StrokeWidths = {
  'play': async ({ canvasElement }) => {
    const icons = Array.from(canvasElement.querySelectorAll('svg'));

    await expect(icons).toHaveLength(5);
    await expect(icons.map((icon) => icon.getAttribute('stroke-width'))).toEqual([ '1', '1.5', '2', '2.5', '3' ]);
  },
  'render': () => (
    <div className='flex items-center gap-4 p-6'>
      {[ 1, 1.5, 2, 2.5, 3 ].map((strokeWidth) => (
        <Icon key={ strokeWidth } name='BookOpen' decorative size='lg' strokeWidth={ strokeWidth } />
      ))}
    </div>
  )
};
