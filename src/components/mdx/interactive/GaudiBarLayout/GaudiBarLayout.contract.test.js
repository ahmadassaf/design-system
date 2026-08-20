import assert from 'node:assert/strict';
import test from 'node:test';

import { gaudiBarRegions } from './GaudiBarLayout.data.js';

test('GaudiBarLayout exposes three populated regions in each primary bar', () => {
  for (const bar of [ 'top', 'bottom' ]) {
    const regions = gaudiBarRegions.filter((region) => region.bar === bar);

    assert.equal(regions.length, 3);
    assert.deepEqual(regions.map((region) => region.label), [ 'Left region', 'Middle region', 'Right region' ]);
    assert.ok(regions.every((region) => region.widgets.length > 0));
  }
});

test('GaudiBarLayout region and widget labels remain unique within their scope', () => {
  assert.equal(new Set(gaudiBarRegions.map((region) => region.id)).size, gaudiBarRegions.length);

  for (const region of gaudiBarRegions)
    assert.equal(new Set(region.widgets.map((widget) => widget.label)).size, region.widgets.length);
});
