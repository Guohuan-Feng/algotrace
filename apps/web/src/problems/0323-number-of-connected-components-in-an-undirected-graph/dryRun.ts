import type { FrameKind } from "../../shared/types";

export type ConnectedComponentsFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  n: number;
  edges: Array<[number, number]>;
  graph: number[][];
  visited: number[];
  stack: number[];
  current: number | null;
  target: number | null;
  activeComponent: number | null;
  count: number;
  result: number | null;
};

export function createConnectedComponentsDryRun(nInput: number, edgesInput: number[][]): { frames: ConnectedComponentsFrame[] } {
  const n = Math.max(0, nInput);
  const edges = edgesInput
    .filter((edge): edge is [number, number] => edge.length === 2 && edge.every(Number.isInteger))
    .map(([left, right]) => [left, right] as [number, number]);
  const graph = Array.from({ length: n }, () => [] as number[]);
  const visited = new Set<number>();
  const stack: number[] = [];
  const frames: ConnectedComponentsFrame[] = [];
  let count = 0;
  let activeComponent: number | null = null;

  const push = (frame: Omit<ConnectedComponentsFrame, "n" | "edges" | "graph" | "visited" | "stack" | "activeComponent" | "count">) => {
    frames.push({
      ...frame,
      n,
      edges: edges.map(([left, right]) => [left, right]),
      graph: graph.map((neighbors) => [...neighbors]),
      visited: [...visited].sort((left, right) => left - right),
      stack: [...stack],
      activeComponent,
      count,
    });
  };

  push({
    kind: "start",
    title: "Initialize adjacency list",
    detail: `Create ${n} neighbor lists for the undirected graph.`,
    activeLines: [5],
    current: null,
    target: null,
    result: null,
  });

  for (const [left, right] of edges) {
    if (!isValidNode(left) || !isValidNode(right)) continue;
    graph[left].push(right);
    graph[right].push(left);
    push({
      kind: "build",
      title: `Add undirected edge ${left} - ${right}`,
      detail: "Add both directions because the graph is undirected.",
      activeLines: [8, 9, 10],
      current: left,
      target: right,
      result: null,
    });
  }

  push({
    kind: "build",
    title: "Initialize visited and count",
    detail: "visited is empty and count starts at 0.",
    activeLines: [12, 21],
    current: null,
    target: null,
    result: null,
  });

  for (let node = 0; node < n; node += 1) {
    push({
      kind: "visit",
      title: `Check node ${node}`,
      detail: visited.has(node) ? `${node} is already part of an earlier component.` : `${node} has not been visited yet.`,
      activeLines: [23, 25],
      current: node,
      target: null,
      result: null,
    });

    if (visited.has(node)) {
      push({
        kind: "prune",
        title: `Skip visited node ${node}`,
        detail: "Its component was already counted by a previous DFS.",
        activeLines: [25],
        current: node,
        target: null,
        result: null,
      });
      continue;
    }

    count += 1;
    activeComponent = count;
    push({
      kind: "found",
      title: `Component ${count} starts at node ${node}`,
      detail: "An unvisited node means this is a new connected component.",
      activeLines: [25, 26],
      current: node,
      target: null,
      result: null,
    });

    push({
      kind: "visit",
      title: `Call dfs(${node})`,
      detail: "Visit every node reachable from this component root.",
      activeLines: [27],
      current: node,
      target: null,
      result: null,
    });
    dfs(node);
  }

  activeComponent = null;
  push({
    kind: "done",
    title: "Components counted",
    detail: `Every node was checked. Return count = ${count}.`,
    activeLines: [29],
    current: null,
    target: null,
    result: count,
  });

  return { frames };

  function isValidNode(node: number) {
    return node >= 0 && node < n;
  }

  function dfs(node: number) {
    stack.push(node);
    visited.add(node);
    push({
      kind: "build",
      title: `Visit node ${node}`,
      detail: `Add ${node} to visited for component ${activeComponent}.`,
      activeLines: [14, 15],
      current: node,
      target: null,
      result: null,
    });

    for (const neighbor of graph[node]) {
      push({
        kind: "visit",
        title: `Inspect edge ${node} - ${neighbor}`,
        detail: `Check whether neighbor ${neighbor} is already visited.`,
        activeLines: [17, 18],
        current: node,
        target: neighbor,
        result: null,
      });
      if (visited.has(neighbor)) {
        push({
          kind: "prune",
          title: `Skip visited neighbor ${neighbor}`,
          detail: "This node is already inside the same explored component.",
          activeLines: [18],
          current: node,
          target: neighbor,
          result: null,
        });
        continue;
      }

      push({
        kind: "visit",
        title: `Recurse to dfs(${neighbor})`,
        detail: `Continue exploring component ${activeComponent}.`,
        activeLines: [19],
        current: node,
        target: neighbor,
        result: null,
      });
      dfs(neighbor);
    }

    stack.pop();
    push({
      kind: "backtrack",
      title: `Return from dfs(${node})`,
      detail: "All neighbors of this node have been checked.",
      activeLines: [17],
      current: node,
      target: null,
      result: null,
    });
  }
}
