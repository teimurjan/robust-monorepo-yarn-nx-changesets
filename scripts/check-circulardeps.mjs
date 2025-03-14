import { getPackages } from "@manypkg/get-packages";
import { getDirectedDependentsGraph } from "./get-directed-dependents-graph.mjs";

const checkCirculardeps = async () => {
  const cwd = process.cwd();
  const packages = await getPackages(cwd);
  const dependentsGraph = getDirectedDependentsGraph(packages);
  const cycles = dependentsGraph.getCycles();

  if (cycles.length > 0) {
    console.error(
      `Found circular dependencies:\n\n${cycles
        .map((cycle) => cycle.join(" -> "))
        .join("\n")}`
    );
    process.exit(1);
  } else {
    console.log("No circular dependencies found");
    process.exit(0);
  }
};

checkCirculardeps();
