import assert from 'node:assert/strict';
import test from 'node:test';

import { processorViews } from './UnifiedProcessorExplorer.data.js';

test('every processor view has complete reversible routes', () => {
  Object.entries(processorViews).forEach(([ viewName, view ]) => {
    assert.ok(view.routes.forward, `${viewName} needs a forward route`);
    assert.ok(view.routes.reverse, `${viewName} needs a reverse route`);

    Object.values(view.routes).forEach((route) => {
      assert.equal(route.edges.length, route.order.length - 1, `${viewName} route edges must connect every station`);
      route.order.forEach((nodeId) => assert.ok(view.nodes[nodeId], `${viewName} references missing node ${nodeId}`));
    });
  });
});

test('forward and reverse routes invert their station order', () => {
  Object.entries(processorViews).forEach(([ viewName, view ]) => {
    assert.deepEqual(
      view.routes.reverse.order,
      [ ...view.routes.forward.order ].reverse(),
      `${viewName} must remain truly reversible`
    );
  });
});

test('every inspectable item has explanatory copy', () => {
  Object.entries(processorViews).forEach(([ viewName, view ]) => {
    const items = [
      ...Object.values(view.nodes),
      ...Object.values(view.nodes).flatMap((node) => [ node.plugin, node.utility ].filter(Boolean)),
      ...Object.values(view.routes).flatMap((route) => route.edges)
    ];

    items.forEach((item) => {
      assert.ok(item.id, `${viewName} contains an item without an id`);
      assert.ok(item.label, `${viewName}/${item.id} needs a label`);
      assert.ok(item.description, `${viewName}/${item.id} needs a description`);
      assert.ok(item.type, `${viewName}/${item.id} needs a type`);
    });
  });
});
