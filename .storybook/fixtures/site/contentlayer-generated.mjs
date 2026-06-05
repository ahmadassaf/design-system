export const allPosts = [
  {
    date: '2026-05-20',
    description: 'How component ownership keeps a blog interface consistent.',
    path: '/blog/design-systems-keep-editorial-rhythm-predictable',
    readingTime: { text: '8 min read' },
    slug: 'design-systems-keep-editorial-rhythm-predictable',
    title: 'Design systems keep editorial rhythm predictable',
    type: 'post'
  }
];

export const allProjects = [
  {
    date: '2026-05-12',
    description: 'Reusable interface foundations for editorial software.',
    path: '/blog/projects/gaudi',
    slug: 'gaudi',
    title: 'Gaudi',
    type: 'project'
  }
];

export const allThoughts = [
  {
    date: '2026-04-18',
    description: 'Notes on making product decisions legible.',
    path: '/thoughts/making-decisions',
    slug: 'making-decisions',
    title: 'Making decisions',
    type: 'thought'
  }
];

export const allAuthors = [];
export const allDocuments = [ ...allPosts, ...allProjects, ...allThoughts ];
export const isType = (type, document) => document?.type === type;
