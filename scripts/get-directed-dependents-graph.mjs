import { getDependentsGraph } from "@changesets/get-dependents-graph";
import { DirectedGraph } from "directed-graph-typed";

export const getDirectedDependentsGraph = (packages) => {
  const dependentsGraphMap = getDependentsGraph({
    ...packages,
    root: packages.rootPackage,
  });

  const graph = new DirectedGraph();
  dependentsGraphMap.forEach((packages, dependent) => {
    graph.addVertex(dependent);
    packages.forEach((dependency) => {
      graph.addVertex(dependency);
      graph.addEdge(dependent, dependency);
    });
  });

  return graph;
};
