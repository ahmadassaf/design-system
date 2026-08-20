/**
 * Interactive MDX catalogue
 *
 * Each article-specific interactive lives in its own folder with its
 * implementation, styles, tests or stories, and local entry point. Components
 * registered here become available to MDX authors by tag name without a local
 * import in every article.
 */

import GaudiBarLayout from './GaudiBarLayout';
import LinkedDataQualityFramework from './LinkedDataQualityFramework';
import PipelineDiagram from './PipelineDiagram';
import RdfBlankNodeExplorer from './RdfBlankNodeExplorer';
import RdfCollectionExplorer from './RdfCollectionExplorer';
import RdfContainerExplorer from './RdfContainerExplorer';
import RdfTripleExplorer from './RdfTripleExplorer';

export const InteractiveMDXComponents = {
  GaudiBarLayout,
  LinkedDataQualityFramework,
  PipelineDiagram,
  RdfBlankNodeExplorer,
  RdfCollectionExplorer,
  RdfContainerExplorer,
  RdfTripleExplorer
};

export {
  GaudiBarLayout,
  LinkedDataQualityFramework,
  PipelineDiagram,
  RdfBlankNodeExplorer,
  RdfCollectionExplorer,
  RdfContainerExplorer,
  RdfTripleExplorer
};
