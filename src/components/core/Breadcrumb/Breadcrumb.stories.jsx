import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';

import { Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbTrail } from './Breadcrumb';

const componentDocs = getComponentDocs('Core/Breadcrumb');

export default {
  component: BreadcrumbTrail,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  title: 'Core/Breadcrumb'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    const trail = within(navigation);
    const homeLink = trail.getByRole('link', { name: 'Home' });
    const blogLink = trail.getByRole('link', { name: 'Blog' });
    const currentPage = trail.getByText('Design Systems');

    await expect(trail.getByRole('list')).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', '/');
    await expect(blogLink).toHaveAttribute('href', '/blog');
    await expect(currentPage).toHaveAttribute('aria-current', 'page');
    await expect(currentPage).toHaveClass('font-medium', 'text-gray-950');
    await expect(trail.getAllByRole('listitem')).toHaveLength(3);
    await expect(trail.queryByRole('link', { name: 'Design Systems' })).not.toBeInTheDocument();
  },
  render: () => <div className='p-6'><BreadcrumbTrail items={ [{ href: '/', label: 'Home' }, { href: '/blog', label: 'Blog' }, { current: true, label: 'Design Systems' }] } /></div>
};

export const LongTrail = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    const trail = within(navigation);

    await expect(trail.getAllByRole('listitem')).toHaveLength(5);
    await expect(trail.getByRole('link', { name: 'Tags' })).toHaveAttribute('href', '/blog/tags');
    await expect(trail.getByText('Core components')).toHaveAttribute('aria-current', 'page');
    await expect(trail.queryByRole('link', { name: 'Core components' })).not.toBeInTheDocument();
  },
  render: () => (
    <div className='p-6'>
      <BreadcrumbTrail
        items={ [
          { href: '/', label: 'Home' },
          { href: '/blog', label: 'Blog' },
          { href: '/blog/tags', label: 'Tags' },
          { href: '/blog/tags/design-systems', label: 'Design Systems' },
          { current: true, label: 'Core components' }
        ] }
      />
    </div>
  )
};

export const Composed = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Article breadcrumb' });
    const trail = within(navigation);

    await expect(trail.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    await expect(trail.getByLabelText('More pages')).toBeVisible();
    await expect(trail.queryByRole('link', { name: 'More pages' })).not.toBeInTheDocument();
    await expect(trail.getByText('Current article')).toHaveAttribute('aria-current', 'page');
    await expect(trail.getAllByRole('listitem')).toHaveLength(3);
  },
  render: () => (
    <div className='p-6'>
      <Breadcrumb label='Article breadcrumb'>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href='/'>Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Current article</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
};
