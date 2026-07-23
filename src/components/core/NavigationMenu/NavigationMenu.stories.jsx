import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, userEvent, within } from 'storybook/test';
import { StoryStage } from '../story-helpers';

import { NavigationMenu, NavigationMenuDropdown, NavigationMenuLink, NavigationMenuList, NavigationMenuPanel } from './NavigationMenu';

const componentDocs = getComponentDocs('Core/NavigationMenu');

export default {
  component: NavigationMenu,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/NavigationMenu'
};

const blogSections = [
  {
    description: 'Long-form writing, design system notes, and engineering essays.',
    href: '',
    label: 'All articles',
    meta: 'Latest first'
  },
  {
    description: 'Knowledge graphs, semantic web, linked data, and retrieval systems.',
    href: '',
    label: 'Data',
    meta: 'Category'
  },
  {
    description: 'Implementation notes for frontend architecture and developer tooling.',
    href: '',
    label: 'Engineering',
    meta: 'Category'
  },
  {
    description: 'Design system decisions, component APIs, and editorial UI patterns.',
    href: '',
    label: 'Design systems',
    meta: 'Tag'
  }
];

const workSections = [
  {
    description: 'Research, papers, talks, and conference material.',
    href: '',
    label: 'Publications'
  },
  {
    description: 'Software, experiments, and reusable tools.',
    href: '',
    label: 'Projects'
  }
];

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Main navigation' });
    const categoriesButton = canvas.getByRole('button', { name: 'Categories' });
    const workButton = canvas.getByRole('button', { name: 'Work' });
    // href='' renders Link as a span, so locate the active item via aria-current.
    const activeLink = canvas.getByText('Blog').closest('[aria-current="page"]');

    await expect(navigation).toBeVisible();
    await expect(activeLink).not.toBeNull();
    await expect(activeLink.closest('[role="listitem"]')).not.toBeNull();
    await expect(categoriesButton).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('All articles')).toBeVisible();

    await userEvent.click(workButton);

    await expect(categoriesButton).toHaveAttribute('aria-expanded', 'false');
    await expect(workButton).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.queryByText('All articles')).toBeNull();
    await expect(canvas.getByText('Publications')).toBeVisible();

    await userEvent.keyboard('{Escape}');

    await expect(workButton).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Publications')).toBeNull();
  },
  render: () => (
    <StoryStage className='flex items-start' minHeight='min-h-80'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuLink href='' active>Blog</NavigationMenuLink>
          <NavigationMenuDropdown label='Categories' width='xl' defaultOpen>
            <NavigationMenuPanel columns={ 2 }>
              {blogSections.map((item) => (
                <NavigationMenuLink key={ item.label } href={ item.href } variant='panel' description={ item.description } meta={ item.meta }>
                  {item.label}
                </NavigationMenuLink>
              ))}
            </NavigationMenuPanel>
          </NavigationMenuDropdown>
          <NavigationMenuDropdown label='Work' width='lg'>
            <NavigationMenuPanel columns={ 2 }>
              {workSections.map((item) => (
                <NavigationMenuLink key={ item.label } href={ item.href } variant='panel' description={ item.description }>
                  {item.label}
                </NavigationMenuLink>
              ))}
            </NavigationMenuPanel>
          </NavigationMenuDropdown>
          <NavigationMenuLink href=''>Thoughts</NavigationMenuLink>
          <NavigationMenuLink href=''>About</NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
    </StoryStage>
  )
};

export const Compact = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Footer navigation' });
    const items = within(navigation).getAllByRole('listitem');

    await expect(items).toHaveLength(4);
    await expect(within(navigation).getByText('Blog')).toBeVisible();
    await expect(within(navigation).getByText('Publications')).toBeVisible();
    await expect(within(navigation).queryByRole('button')).toBeNull();
  },
  render: () => (
    <div className='p-8'>
      <NavigationMenu label='Footer navigation'>
        <NavigationMenuList className='gap-4'>
          <NavigationMenuLink href=''>Blog</NavigationMenuLink>
          <NavigationMenuLink href=''>Publications</NavigationMenuLink>
          <NavigationMenuLink href=''>Projects</NavigationMenuLink>
          <NavigationMenuLink href=''>About</NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
};

export const MultipleDropdowns = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const blogButton = canvas.getByRole('button', { name: 'Blog' });
    const workButton = canvas.getByRole('button', { name: 'Work' });

    await expect(blogButton).toHaveAttribute('aria-expanded', 'false');
    await expect(workButton).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(blogButton);

    await expect(blogButton).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Engineering')).toBeVisible();

    await userEvent.click(workButton);

    await expect(blogButton).toHaveAttribute('aria-expanded', 'false');
    await expect(workButton).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.queryByText('Engineering')).toBeNull();
    await expect(canvas.getByText('Projects')).toBeVisible();
  },
  render: () => (
    <StoryStage className='flex items-start justify-center' minHeight='min-h-80'>
      <NavigationMenu className='justify-center'>
        <NavigationMenuList>
          <NavigationMenuDropdown label='Blog' align='center' width='lg'>
            <NavigationMenuPanel columns={ 1 }>
              {blogSections.slice(0, 3).map((item) => (
                <NavigationMenuLink key={ item.label } href={ item.href } variant='panel' description={ item.description }>
                  {item.label}
                </NavigationMenuLink>
              ))}
            </NavigationMenuPanel>
          </NavigationMenuDropdown>
          <NavigationMenuDropdown label='Work' align='center' width='md'>
            <NavigationMenuPanel columns={ 1 }>
              {workSections.map((item) => (
                <NavigationMenuLink key={ item.label } href={ item.href } variant='panel' description={ item.description }>
                  {item.label}
                </NavigationMenuLink>
              ))}
            </NavigationMenuPanel>
          </NavigationMenuDropdown>
        </NavigationMenuList>
      </NavigationMenu>
    </StoryStage>
  )
};
