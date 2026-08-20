import { expect, userEvent, waitFor, within } from 'storybook/test';

import CodeGroupTabs from './CodeGroupTabs';

export default {
  component: CodeGroupTabs,
  tags: [ 'autodocs' ],
  id: 'mdx-codegrouptabs',
  title: 'MDX/CodeGroupTabs'
};

export const GeneratedCodeGroup = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvasElement.querySelector('.rehype-code-group');
    const javascriptTab = canvas.getByRole('tab', { name: 'JavaScript' });
    const typescriptTab = canvas.getByRole('tab', { name: 'TypeScript' });
    const javascriptPanel = canvas.getByRole('tabpanel', { name: 'JavaScript' });

    await waitFor(() => expect(group).toHaveAttribute('data-tabs-initialized', 'true'));
    await expect(javascriptTab).toHaveAttribute('aria-selected', 'true');
    await expect(javascriptPanel).not.toHaveAttribute('hidden');

    await userEvent.click(typescriptTab);

    await expect(javascriptTab).toHaveAttribute('aria-selected', 'false');
    await expect(typescriptTab).toHaveAttribute('aria-selected', 'true');
    await expect(javascriptPanel).toHaveAttribute('hidden', 'true');
    await expect(canvas.getByRole('tabpanel', { name: 'TypeScript' })).not.toHaveAttribute('hidden');
  },
  render: () => (
    <div className='max-w-2xl p-6'>
      <CodeGroupTabs />
      <div className='rehype-code-group'>
        <div className='rcg-tab-container' role='tablist' aria-label='Code language'>
          <button id='code-tab-js' className='rcg-tab active' type='button' role='tab' aria-controls='code-panel-js' aria-selected='true'>JavaScript</button>
          <button id='code-tab-ts' className='rcg-tab' type='button' role='tab' aria-controls='code-panel-ts' aria-selected='false'>TypeScript</button>
        </div>
        <div id='code-panel-js' className='rcg-block active' role='tabpanel' aria-labelledby='code-tab-js'>
          <pre><code>const language = 'js';</code></pre>
        </div>
        <div id='code-panel-ts' className='rcg-block' role='tabpanel' aria-labelledby='code-tab-ts' hidden>
          <pre><code>const language: string = 'ts';</code></pre>
        </div>
      </div>
    </div>
  )
};

export const LongLabelsInNarrowColumn = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvasElement.querySelector('.rehype-code-group');
    const tabRail = group.querySelector('.rcg-tab-container');
    const lastTab = canvas.getByRole('tab', { name: 'Finding Blog Owner Locations' });

    await waitFor(() => expect(group).toHaveAttribute('data-tabs-initialized', 'true'));
    await userEvent.click(lastTab);

    await expect(lastTab).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(tabRail.scrollLeft).toBeGreaterThan(0));
  },
  render: () => (
    <div className='max-w-sm p-6'>
      <CodeGroupTabs />
      <div className='rehype-code-group'>
        <div className='rcg-tab-container' role='tablist' aria-label='SPARQL query'>
          <button id='code-tab-blog-names' className='rcg-tab active' type='button' role='tab' aria-controls='code-panel-blog-names' aria-selected='true'>Finding Blog Names</button>
          <button id='code-tab-owner-names' className='rcg-tab' type='button' role='tab' aria-controls='code-panel-owner-names' aria-selected='false'>Finding Blog Owners Names</button>
          <button id='code-tab-owner-locations' className='rcg-tab' type='button' role='tab' aria-controls='code-panel-owner-locations' aria-selected='false'>Finding Blog Owner Locations</button>
        </div>
        <div id='code-panel-blog-names' className='rcg-block active' role='tabpanel' aria-labelledby='code-tab-blog-names'>
          <figure data-rehype-pretty-code-figure=''>
            <pre><code>{ `SELECT ?name\nWHERE {\n  ?x foaf:name ?name\n}` }</code></pre>
          </figure>
        </div>
        <div id='code-panel-owner-names' className='rcg-block' role='tabpanel' aria-labelledby='code-tab-owner-names' hidden>
          <figure data-rehype-pretty-code-figure=''>
            <pre><code>{ `SELECT ?ownerName\nWHERE {\n  ?blog aa:owner ?owner .\n  ?owner foaf:name ?ownerName .\n}` }</code></pre>
          </figure>
        </div>
        <div id='code-panel-owner-locations' className='rcg-block' role='tabpanel' aria-labelledby='code-tab-owner-locations' hidden>
          <figure data-rehype-pretty-code-figure=''>
            <pre><code>{ `SELECT ?location\nWHERE {\n  ?owner foaf:based_near ?location .\n}` }</code></pre>
          </figure>
        </div>
      </div>
    </div>
  )
};
