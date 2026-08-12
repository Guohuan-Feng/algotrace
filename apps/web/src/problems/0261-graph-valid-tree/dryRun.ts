import type { FrameKind } from "../../shared/types";

export type GraphEdge = [number, number];

export type GraphValidTreeFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  n: number;
  edges: GraphEdge[];
  graph: number[][];
  visited: number[];
  stack: Array<{ node: number; parent: number }>;
  current: number | null;
  parent: number | null;
  target: number | null;
  cycleEdge: GraphEdge | null;
  result: boolean | null;
};

export function createGraphValidTreeDryRun(nInput: number, edgesInput: number[][]): { frames: GraphValidTreeFrame[] } {
  const n = Math.max(0, nInput);
  const edges: GraphEdge[] = edgesInput
    .filter((edge): edge is GraphEdge => edge.length === 2 && edge.every(Number.isInteger))
    .map(([left, right]) => [left, right]);
  const graph = Array.from({ length: n }, () => [] as number[]);
  const visited = new Set<number>();
  const stack: Array<{ node: number; parent: number }> = [];
  const frames: GraphValidTreeFrame[] = [];

  const push = (frame: Omit<GraphValidTreeFrame, "n" | "edges" | "graph" | "visited" | "stack">) => {
    frames.push({
      ...frame,
      n,
      edges: edges.map(([left, right]) => [left, right]),
      graph: graph.map((neighbors) => [...neighbors]),
      visited: [...visited].sort((left, right) => left - right),
      stack: stack.map((entry) => ({ ...entry })),
    });
  };

  push({
    kind: "start",
    title: "Initialize adjacency list",
    detail: `Create ${n} empty neighbor lists for the undirected graph.`,
    activeLines: [5],
    current: null,
    parent: null,
    target: null,
    cycleEdge: null,
    result: null,
  });

  for (const [left, right] of edges) {
    if (!isValidNode(left) || !isValidNode(right)) {
      push({
        kind: "prune",
        title: `Ignore invalid edge ${left} - ${right}`,
        detail: `Both endpoints must be between 0 and ${Math.max(0, n - 1)}.`,
        activeLines: [7],
        current: null,
        parent: null,
        target: null,
        cycleEdge: null,
        result: null,
      });
      continue;
    }

    graph[left].push(right);
    graph[right].push(left);
    push({
      kind: "build",
      title: `Add undirected edge ${left} - ${right}`,
      detail: `${right} joins graph[${left}] and ${left} joins graph[${right}].`,
      activeLines: [7, 8, 9],
      current: left,
      parent: null,
      target: right,
      cycleEdge: null,
      result: null,
    });
  }

  if (n === 0) {
    push({
      kind: "done",
      title: "No starting node",
      detail: "dfs(0, -1) cannot run for an empty graph, so it is not a valid tree.",
      activeLines: [28, 29],
      current: null,
      parent: null,
      target: null,
      cycleEdge: null,
      result: false,
    });
    return { frames };
  }

  push({
    kind: "visit",
    title: "Start dfs(0, -1)",
    detail: "A valid tree must have no cycle and must be fully connected from node 0.",
    activeLines: [28],
    current: 0,
    parent: -1,
    target: null,
    cycleEdge: null,
    result: null,
  });

  if (!dfs(0, -1)) {
    push({
      kind: "done",
      title: "Not a valid tree",
      detail: "DFS found a cycle, so return False immediately.",
      activeLines: [28, 29],
      current: null,
      parent: null,
      target: null,
      cycleEdge: null,
      result: false,
    });
    return { frames };
  }

  const result = visited.size === n;
  push({
    kind: "done",
    title: result ? "Valid tree" : "Not a valid tree",
    detail: result
      ? `All ${n} nodes were reached without a cycle.`
      : `Only ${visited.size} of ${n} nodes were reached, so the graph is disconnected.`,
    activeLines: [31],
    current: null,
    parent: null,
    target: null,
    cycleEdge: null,
    result,
  });

  return { frames };

  function isValidNode(node: number) {
    return node >= 0 && node < n;
  }

  function dfs(node: number, parent: number): boolean {
    stack.push({ node, parent });
    push({
      kind: "visit",
      title: `Enter dfs(${node}, ${parent})`,
      detail: `Check whether node ${node} was visited on an earlier DFS path.`,
      activeLines: [13, 14],
      current: node,
      parent,
      target: null,
      cycleEdge: null,
      result: null,
    });

    if (visited.has(node)) {
      const from = stack.length > 1 ? stack[stack.length - 2].node : node;
      push({
        kind: "found",
        title: "Cycle detected",
        detail: `Node ${node} was already visited through a different path.`,
        activeLines: [14, 15],
        current: node,
        parent,
        target: null,
        cycleEdge: [from, node],
        result: false,
      });
      stack.pop();
      return false;
    }

    visited.add(node);
    push({
      kind: "build",
      title: `Visit node ${node}`,
      detail: `Add ${node} to visited.`,
      activeLines: [17],
      current: node,
      parent,
      target: null,
      cycleEdge: null,
      result: null,
    });

    for (const neighbor of graph[node]) {
      push({
        kind: "visit",
        title: `Inspect edge ${node} - ${neighbor}`,
        detail: `Compare neighbor ${neighbor} with parent ${parent}.`,
        activeLines: [19, 20],
        current: node,
        parent,
        target: neighbor,
        cycleEdge: null,
        result: null,
      });

      if (neighbor === parent) {
        push({
          kind: "prune",
          title: `Skip parent edge ${node} - ${neighbor}`,
          detail: "This edge only leads back to the node that called the current DFS.",
          activeLines: [20, 21],
          current: node,
          parent,
          target: neighbor,
          cycleEdge: null,
          result: null,
        });
        continue;
      }

      push({
        kind: "visit",
        title: `Recurse to dfs(${neighbor}, ${node})`,
        detail: `Explore neighbor ${neighbor} with ${node} recorded as its parent.`,
        activeLines: [23],
        current: node,
        parent,
        target: neighbor,
        cycleEdge: null,
        result: null,
      });

      if (!dfs(neighbor, node)) {
        push({
          kind: "found",
          title: "Cycle result bubbles up",
          detail: `dfs(${neighbor}, ${node}) returned False, so dfs(${node}, ${parent}) also returns False.`,
          activeLines: [23, 24],
          current: node,
          parent,
          target: neighbor,
          cycleEdge: [node, neighbor],
          result: false,
        });
        stack.pop();
        return false;
      }
    }

    push({
      kind: "backtrack",
      title: `Return True from dfs(${node}, ${parent})`,
      detail: `Every non-parent neighbor of ${node} was safe.`,
      activeLines: [26],
      current: node,
      parent,
      target: null,
      cycleEdge: null,
      result: true,
    });
    stack.pop();
    return true;
  }
}
