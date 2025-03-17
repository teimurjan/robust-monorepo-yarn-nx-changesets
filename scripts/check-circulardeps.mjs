import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const hasCycle = (node, graph, visited, stack, path) => {
  if (!visited.has(node)) {
    visited.add(node);
    stack.add(node);
    path.push(node);

    const dependencies = graph.dependencies[node] || [];
    for (const dep of dependencies) {
      const depNode = dep.target;
      if (
        !visited.has(depNode) &&
        hasCycle(depNode, graph, visited, stack, path)
      ) {
        return true;
      }

      if (stack.has(depNode)) {
        path.push(depNode);
        return true;
      }
    }
  }

  stack.delete(node);
  path.pop();
  return false;
};

const getGraph = () => {
  const cwd = process.cwd();
  const tempOutputFilePath = path.join(cwd, "nx-graph.json");
  execSync(`nx graph --file=${tempOutputFilePath}`, {
    encoding: "utf-8",
  });
  const output = fs.readFileSync(tempOutputFilePath, "utf-8");
  fs.rmSync(tempOutputFilePath);
  return JSON.parse(output).graph;
};

const checkCircularDeps = () => {
  const graph = getGraph();

  const visited = new Set();
  const stack = new Set();

  for (const node of Object.keys(graph.dependencies)) {
    const path = [];
    if (hasCycle(node, graph, visited, stack, path)) {
      console.error("🔴 Circular dependency detected:", path.join(" → "));
      process.exit(1);
    }
  }
  console.log("✅ No circular dependencies detected.");
};

checkCircularDeps();
