import { expect, within } from 'storybook/test';

import { CheckList, Page, QuickLink, Section, Table, Td, Th } from './StoryDocs';

const blockGroups = [
  [ 'Blog content recipes', 'Reference compositions for article shells, series context, table of contents, banners, and FAQs.', 'blocks-blog-content-sections--default' ],
  [ 'Blog listing recipes', 'Reference compositions for featured content, lists, pagination, and search.', 'blocks-blog-sections--default' ],
  [ 'FAQ recipes', 'Reference compositions built from the exported MDX Faq primitive.', 'blocks-faqs--default' ],
  [ 'Footer recipes', 'Reference compositions built from the exported Footer component.', 'blocks-footers--default' ],
  [ 'Stats recipes', 'Reference metric compositions for evidence, outcomes, and supporting context.', 'blocks-stats-sections--default' ],
  [ 'ThoughtsSection', 'The package-exported block for recent editorial cards and archive states.', 'blocks-thoughts--recent-thoughts' ]
];

const compositionRules = [
  'Start with the exported ThoughtsSection block or a documented recipe when the same multi-component section appears across pages.',
  'Keep application data, routing policy, and request state outside the block; pass them through documented props.',
  'Compose blocks from Core, Layout, Navigation, and Post APIs instead of duplicating their behavior.',
  'Verify sparse, empty, loading, and failure states whenever the block owns a variable collection or action.',
  'Preserve heading order and landmark ownership when placing several blocks on one page.'
];

export default {
  id: 'blocks-overview',
  parameters: {
    layout: 'fullscreen'
  },
  tags: [ '!autodocs' ],
  title: 'Blocks'
};

export const Default = {
  name: 'Overview',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const [ title, , storyId ] of blockGroups)
      await expect(canvas.getByRole('link', { name: new RegExp(`^${title}`) })).toHaveAttribute('href', `./?path=/story/${storyId}`);
  },
  render: () => (
    <Page
      title='Blocks'
      intro='Blocks documents one package-exported composition, ThoughtsSection, plus reference recipes built from public Gaudi primitives. Start here before assembling a page-specific section.'
    >
      <Section id='choose-a-group' title='Choose a group' description='Each destination identifies whether it is an exported block or a reference recipe, then documents supported variants and realistic examples.'>
        <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          {blockGroups.map(([ title, description, storyId ]) => (
            <QuickLink key={ storyId } title={ title } description={ description } storyId={ storyId } />
          ))}
        </div>
      </Section>

      <Section id='composition-rules' title='Composition rules' description='Use these constraints to keep the exported block and reference recipes reusable without turning them into application shells.'>
        <CheckList items={ compositionRules } />
      </Section>

      <Section id='ownership-boundaries' title='Ownership boundaries' description='The exported block or recipe coordinates presentation and local interaction. The consuming application retains product policy and data ownership.'>
        <Table label='Composition ownership boundaries'>
          <thead><tr><Th>Concern</Th><Th>Composition owns</Th><Th>Application owns</Th></tr></thead>
          <tbody>
            <tr><Td>Content</Td><Td>Layout, hierarchy, and supported variants</Td><Td>Data loading, permissions, and editorial policy</Td></tr>
            <tr><Td>Interaction</Td><Td>Local controls, focus order, and feedback placement</Td><Td>Navigation outcomes, persistence, and analytics</Td></tr>
            <tr><Td>Responsive behavior</Td><Td>Internal reflow and readable component sizing</Td><Td>Page shell, surrounding grid, and route-level navigation</Td></tr>
            <tr><Td>Recovery</Td><Td>Documented empty and error presentation</Td><Td>Retry logic, logging, and request lifecycle</Td></tr>
          </tbody>
        </Table>
      </Section>
    </Page>
  )
};
