# Interactive MDX

This directory is the catalogue for bespoke interactive HTML used inside MDX articles.

Each interactive owns a folder containing its implementation, scoped styles, stories or tests, and `index.js` entry point:

```text
interactive/
  ComponentName/
    ComponentName.js
    ComponentName.contract.test.js
    ComponentName.module.css
    ComponentName.stories.jsx
    index.js
```

Add the component to `interactive/index.js`. The central MDX component map then exposes it by name, so an article can write `<ComponentName />` without adding a local import.
