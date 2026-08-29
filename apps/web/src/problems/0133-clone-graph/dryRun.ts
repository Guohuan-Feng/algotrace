import type { FrameKind } from "../../shared/types";

export type CloneGraphFrame = {
  kind: FrameKind;
  title: string;
  detail: string;
  activeLines: number[];
  adjacency: number[][];
  cloneAdjacency: number[][];
  cloneMap: number[];
  stack: number[];
  current: number | null;
  neighbor: number | null;
  result: number[][] | null;
};

export function createCloneGraphDryRun(adjacencyInput: number[][]): { frames: CloneGraphFrame[] } {
  const adjacency = adjacencyInput.map((neighbors) => [...neighbors]);
  const cloneAdjacency = adjacency.map(() => [] as number[]);
  const cloneMap = new Set<number>();
  const stack: number[] = [];
  const frames: CloneGraphFrame[] = [];
  const push = (frame: Omit<CloneGraphFrame, "adjacency" | "cloneAdjacency" | "cloneMap" | "stack">) => frames.push({
    ...frame,
    adjacency: adjacency.map((neighbors) => [...neighbors]),
    cloneAdjacency: cloneAdjacency.map((neighbors) => [...neighbors]),
    cloneMap: [...cloneMap].sort((left, right) => left - right),
    stack: [...stack],
  });

  push({ kind: "start", title: "Receive start node", detail: adjacency.length ? "The first adjacency-list row represents the given node with value 1." : "An empty adjacency list represents node = None.", activeLines: [2, 3], current: adjacency.length ? 1 : null, neighbor: null, result: null });
  if (!adjacency.length) {
    push({ kind: "done", title: "Return None", detail: "The guard returns None because there is no input node to clone.", activeLines: [3, 4], current: null, neighbor: null, result: [] });
    return { frames };
  }

  push({ kind: "build", title: "Create visited map", detail: "visited maps each original node to its one cloned copy.", activeLines: [6], current: null, neighbor: null, result: null });
  const dfs = (node: number): number => {
    stack.push(node);
    push({ kind: "visit", title: `dfs(node ${node})`, detail: "Check whether this original node already has a clone in visited.", activeLines: [8, 9], current: node, neighbor: null, result: null });
    if (cloneMap.has(node)) {
      push({ kind: "prune", title: `Reuse clone of ${node}`, detail: `visited already holds node ${node}'s clone, preventing an infinite cycle.`, activeLines: [9, 10], current: node, neighbor: null, result: null });
      stack.pop();
      return node;
    }

    cloneMap.add(node);
    push({ kind: "found", title: `Create Node(${node})`, detail: "Make the clone before exploring neighbors, then save it in visited.", activeLines: [12, 13], current: node, neighbor: null, result: null });
    for (const neighbor of adjacency[node - 1] ?? []) {
      push({ kind: "visit", title: `Clone edge ${node} -> ${neighbor}`, detail: "Recursively obtain the neighbor clone before appending it.", activeLines: [15, 16], current: node, neighbor, result: null });
      const clonedNeighbor = dfs(neighbor);
      cloneAdjacency[node - 1]!.push(clonedNeighbor);
      push({ kind: "build", title: `Append cloned ${neighbor}`, detail: `copy(${node}).neighbors now contains clone(${clonedNeighbor}).`, activeLines: [16], current: node, neighbor, result: null });
    }
    push({ kind: "backtrack", title: `Return clone of ${node}`, detail: "Its neighbor list is complete, so this call returns its copy.", activeLines: [18], current: node, neighbor: null, result: null });
    stack.pop();
    return node;
  };

  dfs(1);
  push({ kind: "done", title: "Return dfs(node)", detail: "All reachable original nodes are mapped exactly once and every neighbor edge is reproduced.", activeLines: [20], current: null, neighbor: null, result: cloneAdjacency.map((neighbors) => [...neighbors]) });
  return { frames };
}
